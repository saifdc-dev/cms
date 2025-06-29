import { Request, Response } from 'express';
import { supabase } from '../config/database.js';
import { ApiResponse } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      user_id,
      sort = 'created_at',
      order = 'desc'
    } = req.query as any;

    const offset = (page - 1) * limit;
    const currentUser = (req as any).user;

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:profiles(username, email),
        order_items(
          id,
          quantity,
          unit_price,
          product:products(name, images),
          variation:product_variations(sku, options)
        )
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sort, { ascending: order === 'asc' });

    // Non-admin users can only see their own orders
    if (currentUser.role !== 'admin') {
      query = query.eq('user_id', currentUser.id);
    } else if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: orders,
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

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:profiles(username, email),
        order_items(
          id,
          quantity,
          unit_price,
          product:products(name, images, slug),
          variation:product_variations(sku, options)
        )
      `)
      .eq('id', id);

    // Non-admin users can only see their own orders
    if (currentUser.role !== 'admin') {
      query = query.eq('user_id', currentUser.id);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: order
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shipping_info } = req.body;
    const userId = (req as any).user.id;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Get product/variation price
      let unitPrice = item.unit_price;
      
      if (item.variation_id) {
        const { data: variation } = await supabase
          .from('product_variations')
          .select('price, stock')
          .eq('id', item.variation_id)
          .single();
        
        if (!variation || variation.stock < item.quantity) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for variation ${item.variation_id}`
          } as ApiResponse);
          return;
        }
        
        unitPrice = variation.price;
      } else {
        const { data: product } = await supabase
          .from('products')
          .select('price')
          .eq('id', item.product_id)
          .single();
        
        if (!product) {
          res.status(400).json({
            success: false,
            error: `Product ${item.product_id} not found`
          } as ApiResponse);
          return;
        }
        
        unitPrice = product.price;
      }

      totalAmount += unitPrice * item.quantity;
      orderItems.push({
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        unit_price: unitPrice
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_number: orderNumber,
        items: orderItems,
        shipping_info,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      res.status(400).json({
        success: false,
        error: orderError.message
      } as ApiResponse);
      return;
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id);
      
      res.status(400).json({
        success: false,
        error: itemsError.message
      } as ApiResponse);
      return;
    }

    // Update stock for variations
    for (const item of items) {
      if (item.variation_id) {
        await supabase.rpc('decrement_variation_stock', {
          variation_id: item.variation_id,
          quantity: item.quantity
        });
      }
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;

    const { data: order, error } = await supabase
      .from('orders')
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
      data: order,
      message: 'Order status updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Get order details
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id);

    if (currentUser.role !== 'admin') {
      query = query.eq('user_id', currentUser.id);
    }

    const { data: order, error: fetchError } = await query.single();

    if (fetchError || !order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      } as ApiResponse);
      return;
    }

    if (order.status === 'cancelled') {
      res.status(400).json({
        success: false,
        error: 'Order is already cancelled'
      } as ApiResponse);
      return;
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      res.status(400).json({
        success: false,
        error: 'Cannot cancel shipped or delivered orders'
      } as ApiResponse);
      return;
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      res.status(400).json({
        success: false,
        error: updateError.message
      } as ApiResponse);
      return;
    }

    // Restore stock for variations
    for (const item of order.order_items) {
      if (item.variation_id) {
        await supabase.rpc('increment_variation_stock', {
          variation_id: item.variation_id,
          quantity: item.quantity
        });
      }
    }

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};