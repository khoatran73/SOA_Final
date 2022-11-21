import express from 'express';
import OrderService from './../../Services/Home/OrderService';

const router = express.Router();
/**
 * @openapi
 * '/api/home/order/get-orders':
 *  get:
 *     tags:
 *     - Order
 *     parameters:
 *      - name: action
 *        in: query
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/get-orders', OrderService.getOrders);
/**
 * @openapi
 * '/api/home/order/get-by-history/{id}':
 *  get:
 *     tags:
 *     - Order
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/get-by-history/:id', OrderService.getOrdersByHistoryId);
/**
 * @openapi
 * '/api/home/order/create':
 *  post:
 *     tags:
 *     - Order
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/Order'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', OrderService.addOrder);
/**
 * @openapi
 * components:
 *  types:
 *    Order:
 *      type: object
 *      properties:
 *        historyId:
 *          type: string
 *          default: string
 *        status:
 *          type: string
 *          default: string
 *        updatedBy:
 *          type: string
 *          default: string
 *        isNewest:
 *          type: boolean
 *          default: true
*/
export default router;
