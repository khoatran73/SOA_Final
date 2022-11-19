import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';
import { IRole } from '../types/System/Role';

interface IRoleMethod {}

type RoleModel = Model<IRole, {}, IRoleMethod>;

const schema = new Schema<IRole, RoleModel, IRoleMethod>(
    {
        id: { type: String, unique: true, required: true, default: DefaultModelId },
        code: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true },
);

const Role = model<IRole, RoleModel>('Role', schema);

export default Role;
