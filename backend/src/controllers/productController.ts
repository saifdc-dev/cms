import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse, PaginationQuery } from '../types/index.js';
import slugify from 'slugify';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'active',
      search,
      sort = 'created_at',
      order = 'desc'
    } = req.query as any;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('products_with_details')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sort, { ascending: order === 'asc' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error, count } = await query;

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products_with_details')
      .select(`
        *,
        variations:product_variations(*),
        reviews:reviews(
          id,
          rating,
          comment,
          user:profiles(username),
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: product
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, images, price, category_id, status } = req.body;
    const slug = slugify(name, { lower: true });

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        description,
        images: images || [],
        price,
        category_id,
        status
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
      data: product,
      message: 'Product created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, images, price, category_id, status } = req.body;
    
    const updateData: any = {
      description,
      images,
      price,
      category_id,
      status
    };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }

    const { data: product, error } = await supabase
      .from('products')
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
      data: product,
      message: 'Product updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
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
      message: 'Product deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

// Product Variations
export const getProductVariations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const { data: variations, error } = await supabase
      .from('product_variations')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: variations
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const createProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, sku, options, price, stock, status } = req.body;

    const { data: variation, error } = await supabase
      .from('product_variations')
      .insert([{
        product_id,
        sku,
        options,
        price,
        stock,
        status
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
      data: variation,
      message: 'Product variation created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sku, options, price, stock, status } = req.body;

    const { data: variation, error } = await supabase
      .from('product_variations')
      .update({ sku, options, price, stock, status })
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
      data: variation,
      message: 'Product variation updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('product_variations')
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
      message: 'Product variation deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};