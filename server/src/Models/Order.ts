import { Schema, Model, model } from 'mongoose';
import { DefaultModelId } from '../configs';
export enum OrderStatus {
    Waiting = 'Waiting',
}
export interface IOrder {
    id: string;
    historyId: string;
    status: OrderStatus;
    updatedBy: string;
}
type OrderModel = Model<IOrder, {}, {}>;

const schema = new Schema<IOrder>(
    {
        id: { type: String, unique: true, required: true, default: DefaultModelId },
        historyId: { type: String, required: true },
        status: { type: String, required: true },
        updatedBy: { type: String, required: true },
    },
    { timestamps: true },
);

const Order = model<IOrder, OrderModel>('Order', schema);

export default Order;
