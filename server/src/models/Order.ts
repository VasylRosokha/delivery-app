import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  totalPrice: number;
  couponCode?: string;
  discount: number;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  couponCode: { type: String },
  discount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);