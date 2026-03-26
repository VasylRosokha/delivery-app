import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import Coupon from '../models/Coupon';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, email, phone, address, items, couponCode } = req.body;

    if (!customerName || !email || !phone || !address || !items?.length) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ error: 'Invalid phone format' });
      return;
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        discount = coupon.discountPercent;
      } else {
        res.status(400).json({ error: 'Invalid coupon code' });
        return;
      }
    }

    const totalPrice = subtotal * (1 - discount / 100);

    const order = new Order({
      customerName,
      email,
      phone,
      address,
      items,
      totalPrice,
      couponCode: couponCode || undefined,
      discount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { email, phone, orderId } = req.query;

    if (!email && !phone && !orderId) {
      res.status(400).json({ error: 'Provide email, phone, or order ID to search' });
      return;
    }

    if (orderId) {
      const order = await Order.findById(orderId);
      res.json(order ? [order] : []);
      return;
    }

    const filter: Record<string, unknown> = {};
    if (email) filter.email = email;
    if (phone) filter.phone = phone;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
