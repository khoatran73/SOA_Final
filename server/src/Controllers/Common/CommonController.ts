import express from 'express';
import CommonService from '../../Services/Common/CommonService';
import upload from '../../utils/multer';

const router = express.Router();
/**
 * @openapi
 * '/api/common/combo-user-with-key':
 *  get:
 *     tags:
 *     - Common
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/combo-user-with-key', CommonService.comboUserWithKey);
router.post('/upload-file', upload.single('image'), CommonService.uploadFile);


export default router;
