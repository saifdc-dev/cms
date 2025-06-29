import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Joi from 'joi';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
      return;
    }
    next();
  };
};

// Common validation schemas
export const schemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  user: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'editor', 'author', 'customer').default('customer')
  }),

  category: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#6B7280'),
    parent_id: Joi.string().uuid()
  }),

  product: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    slug: Joi.string().min(1).max(255).required(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string().uri()),
    price: Joi.number().positive().required(),
    category_id: Joi.string().uuid(),
    status: Joi.string().valid('active', 'inactive', 'archived').default('active')
  }),

  productVariation: Joi.object({
    product_id: Joi.string().uuid().required(),
    sku: Joi.string().min(1).max(100).required(),
    options: Joi.object().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().uuid().required(),
        variation_id: Joi.string().uuid(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().positive().required()
      })
    ).min(1).required(),
    shipping_info: Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      postal_code: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string()
    }).required()
  }),

  contentPage: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    html_name: Joi.string().min(1).max(255).required(),
    description: Joi.string(),
    background_image: Joi.string().uri(),
    background_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
    sections: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        order: Joi.number().integer().min(0).required(),
        data: Joi.object().required()
      })
    ),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft')
  }),

  setting: Joi.object({
    key: Joi.string().min(1).max(100).required(),
    value: Joi.any().required(),
    type: Joi.string().valid('string', 'number', 'boolean', 'json').required(),
    description: Joi.string().max(500)
  }),

  siteInfo: Joi.object({
    site_name: Joi.string().min(1).max(255).required(),
    logo_url: Joi.string().uri(),
    description: Joi.string(),
    contact_email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    social_icons: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        icon: Joi.string().required(),
        url: Joi.string().uri().required()
      })
    )
  })
};