import { Schema, Model, model } from 'mongoose';
import { DefaultModelId } from '../configs';
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    Waiting = 'Waiting',
    Confirm = 'Confirm',
    Shipping = 'Shipping',
    Done = 'Done',
}

export interface IOrder {
    id: string;
    historyId: string;
    status: OrderStatus;
    updatedBy: string;
    isNewest: boolean;
}
type OrderModel = Model<
    IOrder,
    {},
    {
        setId: (num: number) => void;
    }
>;

const schema = new Schema<IOrder>(
    {
        id: { type: String, unique: true, required: true },
        historyId: { type: String, required: true },
        status: { type: String, required: true },
        updatedBy: { type: String, required: true },
        isNewest: { type: Boolean, default: true },
    },
    { timestamps: true },
);

schema.methods.setId = function (num: number) {
    this.id = uuidv4() + '-' + (Math.random() * 10000000).toString().substring(0, 7);
};

const Order = model<IOrder, OrderModel>('Order', schema);

export default Order;
