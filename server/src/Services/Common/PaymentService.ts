import { Request, Response } from 'express';
import TransactionHistory, { IPaymentMethod, ITransactionHistory } from '../../Models/TransactionHistory';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import News from '../../Models/News';
import User from '../../Models/User';

const payment = async (req: Request, res: Response) => {
    const { newId, userPaymentId, address } = req.body;
    const userPayment = await User.findOne({ id: userPaymentId });
    const newDetail = await News.findOne({ id: newId });
    const newPrice = newDetail?.price ?? 0;
    const amount = userPayment?.amount ?? 0;
    if (amount < newPrice) {
        return res.json(ResponseFail('Bạn không đủ tiền để mua sản phẩm này'));
    }
    const newAmount = amount - newPrice;
    await User.updateOne({ id: userPaymentId }, { amount: newAmount });
    await News.updateOne({ id: newId }, { status: 'Sold' });
    const History = {
        userTransferId: userPaymentId,
        userReceiveId: newDetail?.userId,
        method: IPaymentMethod.coin,
        title: newDetail?.title,
        description: newDetail?.description,
        total: '', 
        currency: '',
        totalVND: newPrice,
        newId: newId,
        address: address
    };
    await TransactionHistory.create(History);
    return res.json(ResponseOk());
};

const PaymentService = {
    payment,
};
export default PaymentService;
