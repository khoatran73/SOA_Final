import { AppUser } from 'Auth/Identity';
import crypto from 'crypto';
import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';
import { Identifier } from '../types/shared';

export interface IUser
    extends Pick< AppUser, 'province' | 'district' | 'ward' | 'province' | 'district' | 'ward' | 'address' | 'avatar' | 'createdAt'> {
    id?: Identifier;
    username: string;
    passwordHash: string;
    salt: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    isAdmin: boolean;
    amount: number;
}

interface IUserMethod {
    hasRoleAdminSystem: () => boolean;
    setPassword: (password: string) => void;
    validPassword: (password: string) => boolean;
}
type UserModel = Model<IUser, {}, IUserMethod>;

const schema = new Schema<IUser, UserModel, IUserMethod>({
    id: { type: String, unique: true, required: true, default: DefaultModelId },
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    fullName: { type: String, default: '' },
    emailAddress: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    // address
    province: String,
    district: String,
    ward: String,
    address: String,
    avatar: { type: String },
});

schema.methods.hasRoleAdminSystem = function () {
    return this.isAdmin;
};

schema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return {
        salt: this.salt,
        passwordHash: this.passwordHash,
    };
};

schema.methods.validPassword = function (password: string) {
    let passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return this.passwordHash === passwordHash;
};

const User = model<IUser, UserModel>('User', schema);

export default User;
