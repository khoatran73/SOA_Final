import { Schema, Model, model } from 'mongoose';

export interface IOtp{
    otpCode: Number;
    expiredAt: Date;
    transactionId: string;
}
type OtpModel = Model<IOtp, {}, {}>;

const schema = new Schema<IOtp>({
    otpCode: { type: Number, unique: true},
    transactionId: { type: String, required: true },
    expiredAt:{type: Date, required: true , default: new Date().setMinutes(new Date().getMinutes() + 1)}
},{timestamps: true});

const Otp = model<IOtp, OtpModel>('Otp', schema)

export default Otp;