import { Schema, Model, model } from 'mongoose';
import { IMenu } from '../types/System/Menu';
import { v4 as uuidv4 } from 'uuid';

interface IMenuMethod {
    setPath: (parentPath?: string) => void;
}

type MenuModel = Model<IMenu, {}, IMenuMethod>;

const schema = new Schema<IMenu, MenuModel, IMenuMethod>(
    {
        id: { type: String, unique: true, required: true, default: uuidv4() },
        name: { type: String, required: true },
        route: { type: String, unique: true, required: true },
        icon: { type: String, required: true },
        path: { type: String, default: '' },
        isDisplay: { type: Boolean, default: false },
        level: { type: Number, default: 1 },
        permissions: String,
        parentId: String,
        index: Number,
    },
    { timestamps: true },
);

schema.methods.setPath = function (parentPath?: string) {
    if (parentPath) {
        this.path = `${parentPath}.${this.id}`;
    } else {
        this.path = this.id;
    }
};

const Menu = model<IMenu, MenuModel>('Menu', schema);

export default Menu;
