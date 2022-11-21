import express from 'express';
import StatisticService from '../../Services/Home/StatisticService';
const router = express.Router();

router.get('/coin', StatisticService.getCoinPayChart);

export default router;
