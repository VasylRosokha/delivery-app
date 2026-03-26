import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  name: string;
  code: string;
  discountPercent: number;
  image: string;
}

const CouponSchema = new Schema<ICoupon>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  image: { type: String, required: true },
});

export default mongoose.model<ICoupon>('Coupon', CouponSchema);