import { Request, Response } from 'express';
import TransactionHistory, { IAction, IPaymentMethod, ITransactionHistory } from '../../Models/TransactionHistory';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import News from '../../Models/News';
import User from '../../Models/User';
import Order from '../../Models/Order';

const payment = async (req: Request, res: Response) => {
    const { newsId, userPaymentId, address ,note} = req.body;
    const userPayment = await User.findOne({ id: userPaymentId });
    const newDetail = await News.findOne({ id: newsId });
    const newPrice = newDetail?.price ?? 0;
    const amount = userPayment?.amount ?? 0;
    if (amount < newPrice) {
        return res.json(ResponseFail('Bạn không đủ tiền để mua sản phẩm này'));
    }
    const newAmount = amount - newPrice;
    await User.updateOne({ id: userPaymentId }, { amount: newAmount });
    const history = new TransactionHistory({
        userTransferId: userPaymentId,
        userReceiveId: newDetail?.userId,
        paymentMethod: IPaymentMethod.Coin,
        action: IAction.Purchase,
        title: newDetail?.title ?? '',
        description: newDetail?.description,
        total: '', 
        currency: '',
        totalVND: newPrice,
        newId: newsId,
        address: address,
        note: note,
    });
    const order = new Order({
        historyId: history.id,
        status:'waiting',
        updatedBy: userPaymentId,
    })
    await history.save();
    await order.save();
    return res.json(ResponseOk());
};

const PaymentService = {
    payment,
};
export default PaymentService;
