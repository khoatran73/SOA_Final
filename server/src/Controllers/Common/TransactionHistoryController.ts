import express from 'express';
import TransactionHistoryService from '../../Services/Common/TransactionHistoryService';



const router = express.Router();

/**
 * @openapi
 * '/api/history/get-all':
 *  get:
 *     tags:
 *     - History
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/get-all', TransactionHistoryService.getTransaction);




export default router;
