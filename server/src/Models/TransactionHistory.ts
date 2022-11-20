import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';

interface TransactionHistoryMethod {}
export enum IPaymentMethod {
    coin = 'coin',
    paypal = 'paypal',
}

export type ITransactionHistory = {
    id: string;
    userTransferId: string;
    userReceiveId?: string;
    method: IPaymentMethod;
    title: string;
    description?: string;
    total?: number;
    currency?: string;
    totalVND?: number;
    newId?: string;
    address?: string;
};

type TransactionHistoryModel = Model<ITransactionHistory, {}, TransactionHistoryMethod>;

const schema = new Schema<ITransactionHistory, TransactionHistoryModel, TransactionHistoryMethod>(
    {
        id: { type: String, required: true, unique: true, default: DefaultModelId },
        userTransferId: { type: String, required: true },
        userReceiveId: { type: String },
        method: { type: String },
        title: { type: String },
        description: { type: String },
        total: { type: Number },
        currency: { type: String },
        totalVND: { type: Number },
        newId: { type: String },
        address: { type: String },
    },
    { timestamps: true },
);

const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', schema);

export default TransactionHistory;
