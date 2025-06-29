import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    // Convert to key-value object
    const settingsObject = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: settingsObject
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    const { data: setting, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !setting) {
      res.status(404).json({
        success: false,
        error: 'Setting not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: setting
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { value, type, description } = req.body;

    const { data: setting, error } = await supabase
      .from('settings')
      .upsert([{
        key,
        value,
        type,
        description
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

    res.json({
      success: true,
      data: setting,
      message: 'Setting updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateMultipleSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { settings } = req.body;

    const settingsToUpsert = Object.entries(settings).map(([key, config]: [string, any]) => ({
      key,
      value: config.value,
      type: config.type || 'string',
      description: config.description
    }));

    const { data: updatedSettings, error } = await supabase
      .from('settings')
      .upsert(settingsToUpsert)
      .select();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

// Site Info
export const getSiteInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: siteInfo, error } = await supabase
      .from('site_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: siteInfo || {}
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateSiteInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      site_name,
      logo_url,
      description,
      contact_email,
      phone,
      address,
      social_icons
    } = req.body;

    const { data: siteInfo, error } = await supabase
      .from('site_info')
      .upsert([{
        id: '1', // Single row for site info
        site_name,
        logo_url,
        description,
        contact_email,
        phone,
        address,
        social_icons: social_icons || []
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

    res.json({
      success: true,
      data: siteInfo,
      message: 'Site info updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};