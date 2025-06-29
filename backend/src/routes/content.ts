import { Router } from 'express';
import { query, param } from 'express-validator';
import {
  getContentPages,
  getContentPage,
  getContentPageByHtmlName,
  createContentPage,
  updateContentPage,
  deleteContentPage
} from '../controllers/contentController.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { handleValidationErrors, validateSchema, schemas } from '../middleware/validation.js';

const router = Router();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all content pages
 *     tags: [Content]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived, all]
 *           default: published
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content pages retrieved successfully
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'published', 'archived', 'all']),
  handleValidationErrors
], optionalAuth, getContentPages);

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content page by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Content page retrieved successfully
 *       404:
 *         description: Content page not found
 */
router.get('/:id', [
  param('id').isUUID(),
  handleValidationErrors
], optionalAuth, getContentPage);

/**
 * @swagger
 * /api/content/page/{htmlName}:
 *   get:
 *     summary: Get content page by HTML name
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: htmlName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content page retrieved successfully
 *       404:
 *         description: Content page not found
 */
router.get('/page/:htmlName', [
  param('htmlName').isString().isLength({ min: 1 }),
  handleValidationErrors
], getContentPageByHtmlName);

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create a new content page
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - html_name
 *             properties:
 *               title:
 *                 type: string
 *               html_name:
 *                 type: string
 *               description:
 *                 type: string
 *               background_image:
 *                 type: string
 *                 format: uri
 *               background_color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - order
 *                     - data
 *                   properties:
 *                     type:
 *                       type: string
 *                     order:
 *                       type: integer
 *                       minimum: 0
 *                     data:
 *                       type: object
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 default: draft
 *     responses:
 *       201:
 *         description: Content page created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authenticateToken, requireRole(['admin', 'editor', 'author']), validateSchema(schemas.contentPage), createContentPage);

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update content page
 *     tags: [Content]
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
 *               title:
 *                 type: string
 *               html_name:
 *                 type: string
 *               description:
 *                 type: string
 *               background_image:
 *                 type: string
 *                 format: uri
 *               background_color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Content page updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Content page not found
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'editor', 'author']), [
  param('id').isUUID(),
  handleValidationErrors
], updateContentPage);

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Delete content page
 *     tags: [Content]
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
 *         description: Content page deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Content page not found
 */
router.delete('/:id', authenticateToken, requireRole(['admin', 'editor']), [
  param('id').isUUID(),
  handleValidationErrors
], deleteContentPage);

export default router;