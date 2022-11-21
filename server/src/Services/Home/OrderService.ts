import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import News from '../../Models/News';
import Order, { IOrder, OrderStatus } from '../../Models/Order';
import TransactionHistory, { ITransactionHistory, PaymentAction } from '../../Models/TransactionHistory';
import User, { IUser } from '../../Models/User';

export enum OrderAction {
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

    const orders = await Order.find({ isNewest: true });
    const histories = await TransactionHistory.find();

    const ordersFiltered = orders.filter(order => {
        const history = histories.find(x => x.id === order.historyId);
        if (!history || history.action !== PaymentAction.Purchase || !history.userReceiveId) return false;

        if (user?.id !== _.get(history, historyFieldName)) return false;

        return true;
    });

    const users = await User.find();
    const listNews = await News.find();

    const ordersResponse = ordersFiltered.map(order => {
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

    return res.json(ResponseOk<OrderResponse[]>(ordersResponse));
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

const addOrder = async (req: Request<any, any, Pick<IOrder, 'historyId' | 'status'>, any>, res: Response) => {
    const { historyId, status } = req.body;
    const user = req.session.user;
    const history = await TransactionHistory.findOne({ id: historyId });
    if (!status) return res.json(ResponseFail('Trạng thái không hợp lệ'));
    if (!history) return res.json(ResponseFail('Không tìm thấy lịch sử'));

    const order = new Order({
        historyId: historyId,
        status: status,
        isNewest: true,
        updatedBy: user?.id,
    });

    const oldOrderNewest = await Order.findOne({ isNewest: true, historyId: historyId });
    if (!!oldOrderNewest) {
        await Order.updateOne({ id: oldOrderNewest?.id }, { isNewest: false });
    }

    order.setId(Math.random());
    order.save();

    if (status === OrderStatus.Done) {
        const userReceive = await User.findOne({ id: history.userReceiveId });
        if (!!userReceive) {
            await TransactionHistory.updateOne(
                { id: historyId },
                {
                    isReceivedCoin: true,
                },
            );

            const newCoin = userReceive.amount + Number(history.totalVnd);
            await User.updateOne({ id: userReceive.id }, { amount: newCoin });
            newCoin;
        }
    }

    return res.json(ResponseOk());
};

const OrderService = {
    getOrders,
    getOrdersByHistoryId,
    addOrder,
};

export default OrderService;
