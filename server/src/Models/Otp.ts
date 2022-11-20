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
},{timestamps: true , expireAfterSeconds: 120});

const Otp = model<IOtp, OtpModel>('Otp', schema);

export default Otp;