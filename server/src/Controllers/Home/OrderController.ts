import express from 'express';
import OrderService from './../../Services/Home/OrderService';

const router = express.Router();

router.get('/get-orders', OrderService.getOrders);
router.get('/get-by-history/:id', OrderService.getOrdersByHistoryId);
router.post('/create', OrderService.addOrder);

export default router;
