import { Model, model, Schema } from 'mongoose';
import { IUserRole } from '../types/System/Role';

interface IUserRoleMethod {}

type UserRoleModel = Model<IUserRole, {}, IUserRoleMethod>;

const schema = new Schema<IUserRole, UserRoleModel, IUserRoleMethod>(
    {
        roleId: { type: String, required: true },
        userId: { type: String, required: true },
    },
    { timestamps: true },
);

const UserRole = model<IUserRole, UserRoleModel>('UserRole', schema);

export default UserRole;
