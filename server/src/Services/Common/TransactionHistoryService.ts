import { Request, Response } from 'express';
import { ResponseOk } from '../../common/ApiResponse';
import TransactionHistory from '../../Models/TransactionHistory';

const getTransaction  = async(req:Request, res:Response) =>{
    const {id} = req.query;
    console.log(id);
    const transaction = await TransactionHistory.find({userId: id}).sort({createdAt:-1});
    return res.json(ResponseOk(transaction));
}

const TransactionHistoryService = {
    getTransaction
}
export default TransactionHistoryService;