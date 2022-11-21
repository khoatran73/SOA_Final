import express from 'express';
import ChatService from '../..//Services/Home/ChatService';

const router = express.Router();
/**
 * @openapi
 * '/api/chat/get-chat':
 *  get:
 *     tags:
 *     - Chat
 *     parameters:
 *      - name: users
 *        in: query
 *        schema:
 *          type: array
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/get-chat', ChatService.getChatData);
/**
 * @openapi
 * '/api/chat/get-chat-list':
 *  get:
 *     tags:
 *     - Chat
 *     parameters:
 *      - name: id
 *        in: query
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/get-chat-list', ChatService.getChatListUser);

export default router;