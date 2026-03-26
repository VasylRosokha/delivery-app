import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
  name: string;
  image: string;
  rating: number;
}

const ShopSchema = new Schema<IShop>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

export default mongoose.model<IShop>('Shop', ShopSchema);