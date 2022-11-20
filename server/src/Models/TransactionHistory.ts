import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';

interface TransactionHistoryMethod {}
export enum PaymentMethod {
    Coin = 'Coin',
    PayPal = 'PayPal',
}
export enum PaymentAction {
    Coin = 'Coin',
    Purchase = 'Purchase',
}
export type ITransactionHistory = {
    id: string;
    userTransferId: string;
    userReceiveId?: string;
    paymentMethod: PaymentMethod;
    action: PaymentAction;
    title: string;
    description?: string;
    total?: number;
    currency?: string;
    totalVnd?: number;
    newsId?: string;
    note?: string;
    address?: string;
};

type TransactionHistoryModel = Model<ITransactionHistory, {}, TransactionHistoryMethod>;

const schema = new Schema<ITransactionHistory, TransactionHistoryModel, TransactionHistoryMethod>(
    {
        id: { type: String, required: true, unique: true, default: DefaultModelId },
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
        address: { type: String },
    },
    { timestamps: true },
);

const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', schema);

export default TransactionHistory;
