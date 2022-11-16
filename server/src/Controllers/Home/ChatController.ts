import express from 'express';
import ChatService from '../..//Services/Home/ChatService';

const router = express.Router();

router.get('/get-chat', ChatService.getChatData);
router.get('/get-chat-list', ChatService.getChatListUser);

export default router;