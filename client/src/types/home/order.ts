import { User } from '../ums/AuthUser';
import { TransactionHistoryType } from './history';

export enum OrderStatus {
    Waiting = 'Waiting',
    Confirm = 'Confirm',
    Shipping = 'Shipping',
    Done = 'Done',
}

export const OrderStatusToString = {
    [OrderStatus.Waiting]: 'Chờ xác nhận',
};

export enum OrderAction {
    Buy = 'Buy',
    Sell = 'Sell',
}

export type OrderResponse = Order & {
    receiverUser: Partial<User>;
    history: TransactionHistoryType;
};

export type HistoryOrderResponse = TransactionHistoryType & {
    orders: Order[];
};

export interface Order {
    id: string;
    historyId: string;
    status: OrderStatus;
    updatedBy: string;
    createdAt: Date;
}
