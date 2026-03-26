import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  category: string;
  shop: Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);