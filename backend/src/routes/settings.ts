import { Router } from 'express';
import { param } from 'express-validator';
import {
  getSettings,
  getSetting,
  updateSetting,
  updateMultipleSettings,
  deleteSetting,
  getSiteInfo,
  updateSiteInfo
} from '../controllers/settingsController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { handleValidationErrors, validateSchema, schemas } from '../middleware/validation.js';

const router = Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 */
router.get('/', getSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Get setting by key
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting retrieved successfully
 *       404:
 *         description: Setting not found
 */
router.get('/:key', [
  param('key').isString().isLength({ min: 1 }),
  handleValidationErrors
], getSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   put:
 *     summary: Update setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - type
 *             properties:
 *               value:
 *                 oneOf:
 *                   - type: string
 *                   - type: number
 *                   - type: boolean
 *                   - type: object
 *               type:
 *                 type: string
 *                 enum: [string, number, boolean, json]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.put('/:key', authenticateToken, requireRole(['admin']), [
  param('key').isString().isLength({ min: 1 }),
  handleValidationErrors
], updateSetting);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update multiple settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                         - type: object
 *                     type:
 *                       type: string
 *                       enum: [string, number, boolean, json]
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.put('/', authenticateToken, requireRole(['admin']), updateMultipleSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   delete:
 *     summary: Delete setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:key', authenticateToken, requireRole(['admin']), [
  param('key').isString().isLength({ min: 1 }),
  handleValidationErrors
], deleteSetting);

// Site Info
/**
 * @swagger
 * /api/settings/site/info:
 *   get:
 *     summary: Get site information
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Site info retrieved successfully
 */
router.get('/site/info', getSiteInfo);

/**
 * @swagger
 * /api/settings/site/info:
 *   put:
 *     summary: Update site information
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - site_name
 *             properties:
 *               site_name:
 *                 type: string
 *               logo_url:
 *                 type: string
 *                 format: uri
 *               description:
 *                 type: string
 *               contact_email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               social_icons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     icon:
 *                       type: string
 *                     url:
 *                       type: string
 *                       format: uri
 *     responses:
 *       200:
 *         description: Site info updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.put('/site/info', authenticateToken, requireRole(['admin']), validateSchema(schemas.siteInfo), updateSiteInfo);

export default router;