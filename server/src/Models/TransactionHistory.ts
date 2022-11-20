import { DeliveryAddress } from '../types/Auth/Identity';
import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';


export enum PaymentMethod {
    Coin = 'Coin',
    PayPal = 'PayPal',
}
export enum PaymentAction {
    Coin = 'Coin',  // mua coin
    Purchase = 'Purchase', // mua hàng
}
export type ITransactionHistory = {
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
    newsUrl?: string;
};

type TransactionHistoryModel = Model<ITransactionHistory, {}, {}>;

const schema = new Schema<ITransactionHistory>(
    {
        id: { type: String, required: true, unique: true, default: DefaultModelId + Math.random().toString(36).substr(2, 4) },
        userTransferId: { type: String, required: true },
        userReceiveId: { type: String },
        paymentMethod: { type: String, required: true },
        action: { type: String, required: true },
        title: { type: String },
        note: { type: String },
        description: { type: String },
        total: { type: Number },
        currency: { type: String },
        totalVnd: { type: Number },
        newsId: { type: String },
        address: { type: Object },
    },
    { timestamps: true },
);

const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', schema);

export default TransactionHistory;
