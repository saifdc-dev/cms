import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role = 'customer' } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists'
      } as ApiResponse);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, role }
    });

    if (authError) {
      res.status(400).json({
        success: false,
        error: authError.message
      } as ApiResponse);
      return;
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        username,
        email,
        role
      }])
      .select()
      .single();

    if (profileError) {
      res.status(400).json({
        success: false,
        error: profileError.message
      } as ApiResponse);
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: profile.id, role: profile.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: profile,
        token
      },
      message: 'User registered successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      res.status(401).json({
        success: false,
        error: 'User profile not found'
      } as ApiResponse);
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: profile.id, role: profile.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: profile,
        token
      },
      message: 'Login successful'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      res.status(404).json({
        success: false,
        error: 'Profile not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: profile
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { username, avatar_url } = req.body;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ username, avatar_url })
      .eq('id', userId)
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
      data: profile,
      message: 'Profile updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};