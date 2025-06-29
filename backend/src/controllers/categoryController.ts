import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';
import slugify from 'slugify';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parent_id, include_products = false } = req.query;

    let query = supabase
      .from('categories')
      .select('*')
      .order('name');

    if (parent_id) {
      query = query.eq('parent_id', parent_id);
    } else if (parent_id !== 'all') {
      query = query.is('parent_id', null);
    }

    const { data: categories, error } = await query;

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    // Include product count if requested
    if (include_products === 'true') {
      for (const category of categories) {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);
        
        (category as any).product_count = count || 0;
      }
    }

    res.json({
      success: true,
      data: categories
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        children:categories!parent_id(*),
        parent:categories!parent_id(*)
      `)
      .eq('id', id)
      .single();

    if (error || !category) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      } as ApiResponse);
      return;
    }

    // Get product count
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    (category as any).product_count = count || 0;

    res.json({
      success: true,
      data: category
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, color, parent_id } = req.body;
    const slug = slugify(name, { lower: true });

    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        slug,
        description,
        color: color || '#6B7280',
        parent_id
      }])
      .select()
      .single();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, color, parent_id } = req.body;
    
    const updateData: any = {
      description,
      color,
      parent_id
    };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if category has products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (productCount && productCount > 0) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete category with associated products'
      } as ApiResponse);
      return;
    }

    // Check if category has children
    const { count: childrenCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id);

    if (childrenCount && childrenCount > 0) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete category with subcategories'
      } as ApiResponse);
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};