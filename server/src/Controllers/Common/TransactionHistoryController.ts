import express from 'express';
import TransactionHistoryService from '../../Services/Common/TransactionHistoryService';



const router = express.Router();


router.get('/get-all', TransactionHistoryService.getTransaction);




export default router;
