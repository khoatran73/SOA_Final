import { DeliveryAddress } from '../ums/AuthUser';

export enum PaymentMethod {
    Coin = 'Coin',
    PayPal = 'PayPal',
}

export enum PaymentAction {
    Coin = 'Coin', // mua coin
    Purchase = 'Purchase', // mua hàng
    NewsPush = 'NewsPush' // đẩy tin
}

export type TransactionHistoryType = {
    id: string;
    userTransferId: string; // người mua (người chuyển)
    userReceiveId?: string; // người bán (người nhận)
    paymentMethod: PaymentMethod;
    action: PaymentAction;
    title: string;
    description?: string;
    total?: number;
    currency?: string;
    totalVnd?: number;
    newsId?: string;
    note?: string;
    address?: DeliveryAddress;
    createdAt?: Date;
    newsUrl?: string;
};
