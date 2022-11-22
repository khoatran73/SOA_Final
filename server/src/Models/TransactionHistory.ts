import { Model, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryAddress } from '../types/Auth/Identity';

export enum PaymentMethod {
    Coin = 'Coin',
    PayPal = 'PayPal',
}
export enum PaymentAction {
    Coin = 'Coin', // mua coin
    Purchase = 'Purchase', // mua hàng
    NewsPush = 'NewsPush' // đẩy tin
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
    isReceivedCoin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

type TransactionHistoryModel = Model<
    ITransactionHistory,
    {},
    {
        setId: (num: number) => void;
    }
>;

const schema = new Schema<ITransactionHistory>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
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
        isReceivedCoin: { type: Boolean, default: false },
    },
    { timestamps: true },
);

schema.methods.setId = function (num: number) {
    this.id = uuidv4() + '-' + (Math.random() * 10000000).toString().substring(0, 7);
};

const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', schema);

export default TransactionHistory;
