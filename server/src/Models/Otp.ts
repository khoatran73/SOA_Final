import { Schema, Model, model } from 'mongoose';

export interface IOtp{
    otpCode: Number;
    expiredAt: Date;
    transactionId: string;
}
type OtpModel = Model<IOtp, {}, {}>;

const schema = new Schema<IOtp>({
    otpCode: { type: Number, unique: true},
    expiredAt: { type: Date, default: new Date((new Date()).getTime() + 2*60000) },
    transactionId: { type: String, required: true },
},{timestamps: true});

const Otp = model<IOtp, OtpModel>('Otp', schema);

export default Otp;