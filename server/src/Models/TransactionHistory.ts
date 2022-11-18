import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';

interface TransactionHistoryMethod {}
export type IContent = {
    method: string;
    title: string;
    description?: string;
    total?: number;
    currency?: string;
};
export type ITransactionHistory = {
    id: string;
    userId: string;
    content:IContent;
};
type TransactionHistoryModel = Model<ITransactionHistory, {}, TransactionHistoryMethod>;

const schema = new Schema<ITransactionHistory, TransactionHistoryModel, TransactionHistoryMethod>(
    {
        id: { type: String, unique: true, required: true, default: DefaultModelId },
        userId: { type: String, required: true },
        content: { type: Object, required: true },
    },
    { timestamps: true },
); 

const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', schema);
 
export default TransactionHistory;
