import { Request, Response } from 'express';
import _ from 'lodash';
import News from '../../Models/News';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import Order, { IOrder } from '../../Models/Order';
import TransactionHistory, { ITransactionHistory, PaymentAction } from '../../Models/TransactionHistory';
import User, { IUser } from '../../Models/User';

enum OrderAction {
    Buy = 'Buy',
    Sell = 'Sell',
}

type OrderResponse = IOrder & {
    receiverUser: Partial<IUser>;
    history: ITransactionHistory;
};

type HistoryOrderResponse = ITransactionHistory & {
    orders: IOrder[];
};
// IOrder & ITransactionHistory & IUser;

const getOrders = async (req: Request<any, any, any, { action: OrderAction }>, res: Response) => {
    const { action } = req.query;
    const user = req.session.user;

    const historyFieldName = action === OrderAction.Buy ? 'userTransferId' : 'userReceiveId';

    const orders = await Order.find();
    const histories = await TransactionHistory.find();

    const ordersFiltered = orders.filter(order => {
        const history = histories.find(x => x.id === order.historyId);
        if (!history || history.action !== PaymentAction.Purchase || !history.userReceiveId) return false;

        if (user?.id !== _.get(history, historyFieldName)) return false;

        return true;
    });

    const users = await User.find();
    const listNews = await News.find();

    const result = ordersFiltered.map(order => {
        const history = histories.find(x => x.id === order.historyId);
        const receiverUser = users.find(x => x.id === history?.userReceiveId);
        // === doc
        const orderDoc = (_.get({ ...order }, '_doc') ?? {}) as IOrder;
        const historyDoc = (_.get({ ...history }, '_doc') ?? {}) as ITransactionHistory;
        const receiverUserDoc = (_.get({ ...receiverUser }, '_doc') ?? {}) as IUser;
        //
        const news = listNews.find(x => x.id === history?.newsId);
        const orderResponse: OrderResponse = {
            ...orderDoc,
            history: {
                ...historyDoc,
                newsUrl: news?.imageUrls?.[0],
            },
            receiverUser: receiverUserDoc,
        };

        return orderResponse;
    });

    return res.json(ResponseOk<OrderResponse[]>(result));
};

const getOrdersByHistoryId = async (req: Request<{ id: string }>, res: Response) => {
    const historyId = req.params.id;
    const history = await TransactionHistory.findOne({ id: historyId });
    if (!history) return res.json(ResponseFail('Không tìm thấy lịch sử'));

    const orders = await Order.find({ historyId: historyId });
    const historyDoc = (_.get({ ...history }, '_doc') ?? {}) as ITransactionHistory;

    const result: HistoryOrderResponse = {
        ...historyDoc,
        orders: orders,
    };

    return res.json(ResponseOk<HistoryOrderResponse>(result));
};

const OrderService = {
    getOrders,
    getOrdersByHistoryId,
};

export default OrderService;
