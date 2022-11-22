import { Request, Response } from 'express';
import TransactionHistory, { PaymentAction, PaymentMethod, ITransactionHistory } from '../../Models/TransactionHistory';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import News from '../../Models/News';
import User from '../../Models/User';
import Order, { OrderStatus } from '../../Models/Order';

const payment = async (req: Request, res: Response) => {
    const { newsId, userPaymentId, address, note } = req.body;
    const userPayment = await User.findOne({ id: userPaymentId });
    const newsDetail = await News.findOne({ id: newsId });
    const newsPrice = newsDetail?.price ?? 0;
    const amount = userPayment?.amount ?? 0;
    if (amount < newsPrice) {
        return res.json(ResponseFail('Bạn không đủ tiền để mua sản phẩm này'));
    }

    const coinRemain = amount - newsPrice;
    await User.updateOne({ id: userPaymentId }, { amount: coinRemain });
    const history = new TransactionHistory({
        userTransferId: userPaymentId,
        userReceiveId: newsDetail?.userId,
        paymentMethod: PaymentMethod.Coin,
        action: PaymentAction.Purchase,
        title: newsDetail?.title ?? '',
        description: newsDetail?.description,
        total: '',
        currency: '',
        totalVnd: newsPrice,
        newsId,
        address: address,
        note: note,
    });
    history.setId(Math.random());
    await history.save(); 
    const order = new Order({
        historyId: history.id,
        status: OrderStatus.Waiting,
        updatedBy: userPaymentId,
    });
    order.setId(Math.random());
    await order.save();
    return res.json(ResponseOk());
};

const PaymentService = {
    payment,
};
export default PaymentService;
