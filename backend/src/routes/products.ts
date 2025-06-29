import { Router } from 'express';
import { query, param } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariations,
  createProductVariation,
  updateProductVariation,
  deleteProductVariation
} from '../controllers/productController.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { handleValidationErrors, validateSchema, schemas } from '../middleware/validation.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, archived, all]
 *           default: active
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive', 'archived', 'all']),
  query('sort').optional().isString(),
  query('order').optional().isIn(['asc', 'desc']),
  handleValidationErrors
], optionalAuth, getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', [
  param('id').isUUID(),
  handleValidationErrors
], optionalAuth, getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category_id:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [active, inactive, archived]
 *                 default: active
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authenticateToken, requireRole(['admin', 'editor']), validateSchema(schemas.product), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category_id:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [active, inactive, archived]
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Product not found
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), [
  param('id').isUUID(),
  handleValidationErrors
], updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authenticateToken, requireRole(['admin', 'editor']), [
  param('id').isUUID(),
  handleValidationErrors
], deleteProduct);

// Product Variations
router.get('/:productId/variations', [
  param('productId').isUUID(),
  handleValidationErrors
], getProductVariations);

router.post('/variations', authenticateToken, requireRole(['admin', 'editor']), validateSchema(schemas.productVariation), createProductVariation);

router.put('/variations/:id', authenticateToken, requireRole(['admin', 'editor']), [
  param('id').isUUID(),
  handleValidationErrors
], updateProductVariation);

router.delete('/variations/:id', authenticateToken, requireRole(['admin', 'editor']), [
  param('id').isUUID(),
  handleValidationErrors
], deleteProductVariation);

export default router;