import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';
import slugify from 'slugify';

export const getContentPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      search,
      sort = 'created_at',
      order = 'desc'
    } = req.query as any;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('content_pages')
      .select(`
        *,
        author:profiles(username),
        sections(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sort, { ascending: order === 'asc' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: pages, error, count } = await query;

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: pages,
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

export const getContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: page, error } = await supabase
      .from('content_pages')
      .select(`
        *,
        author:profiles(username),
        sections(*)
      `)
      .eq('id', id)
      .single();

    if (error || !page) {
      res.status(404).json({
        success: false,
        error: 'Content page not found'
      } as ApiResponse);
      return;
    }

    // Sort sections by order
    if (page.sections) {
      page.sections.sort((a: any, b: any) => a.order - b.order);
    }

    res.json({
      success: true,
      data: page
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getContentPageByHtmlName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { htmlName } = req.params;

    const { data: page, error } = await supabase
      .from('content_pages')
      .select(`
        *,
        author:profiles(username),
        sections(*)
      `)
      .eq('html_name', htmlName)
      .eq('status', 'published')
      .single();

    if (error || !page) {
      res.status(404).json({
        success: false,
        error: 'Content page not found'
      } as ApiResponse);
      return;
    }

    // Sort sections by order
    if (page.sections) {
      page.sections.sort((a: any, b: any) => a.order - b.order);
    }

    res.json({
      success: true,
      data: page
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const createContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      html_name,
      description,
      background_image,
      background_color,
      sections = [],
      status = 'draft'
    } = req.body;
    
    const authorId = (req as any).user.id;

    // Create content page
    const { data: page, error: pageError } = await supabase
      .from('content_pages')
      .insert([{
        title,
        html_name,
        description,
        background_image,
        background_color,
        sections: [],
        status,
        author_id: authorId
      }])
      .select()
      .single();

    if (pageError) {
      res.status(400).json({
        success: false,
        error: pageError.message
      } as ApiResponse);
      return;
    }

    // Create sections if provided
    if (sections.length > 0) {
      const sectionsToInsert = sections.map((section: any, index: number) => ({
        content_page_id: page.id,
        type: section.type,
        order: section.order || index,
        data: section.data
      }));

      const { error: sectionsError } = await supabase
        .from('sections')
        .insert(sectionsToInsert);

      if (sectionsError) {
        // Rollback page creation
        await supabase.from('content_pages').delete().eq('id', page.id);
        
        res.status(400).json({
          success: false,
          error: sectionsError.message
        } as ApiResponse);
        return;
      }
    }

    res.status(201).json({
      success: true,
      data: page,
      message: 'Content page created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      html_name,
      description,
      background_image,
      background_color,
      sections,
      status
    } = req.body;

    // Update content page
    const { data: page, error: pageError } = await supabase
      .from('content_pages')
      .update({
        title,
        html_name,
        description,
        background_image,
        background_color,
        status
      })
      .eq('id', id)
      .select()
      .single();

    if (pageError) {
      res.status(400).json({
        success: false,
        error: pageError.message
      } as ApiResponse);
      return;
    }

    // Update sections if provided
    if (sections) {
      // Delete existing sections
      await supabase
        .from('sections')
        .delete()
        .eq('content_page_id', id);

      // Insert new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map((section: any, index: number) => ({
          content_page_id: id,
          type: section.type,
          order: section.order || index,
          data: section.data
        }));

        const { error: sectionsError } = await supabase
          .from('sections')
          .insert(sectionsToInsert);

        if (sectionsError) {
          res.status(400).json({
            success: false,
            error: sectionsError.message
          } as ApiResponse);
          return;
        }
      }
    }

    res.json({
      success: true,
      data: page,
      message: 'Content page updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete sections first (due to foreign key constraint)
    await supabase
      .from('sections')
      .delete()
      .eq('content_page_id', id);

    // Delete content page
    const { error } = await supabase
      .from('content_pages')
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
      message: 'Content page deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};