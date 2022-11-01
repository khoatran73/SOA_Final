import { Schema, Model, model } from 'mongoose';
import { IRole } from '../types/System/Role';
import { v4 as uuidv4 } from 'uuid';


interface IRoleMethod {}

type RoleModel = Model<IRole, {}, IRoleMethod>;

const schema = new Schema<IRole, RoleModel, IRoleMethod>({
    id: { type: String, unique: true, required: true, default: uuidv4() },
    code: { type: String, required: true },
    name: { type: String, required: true },
});

const Role = model<IRole, RoleModel>('Role', schema);

export default Role;
