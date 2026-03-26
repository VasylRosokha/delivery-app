import { Router, Request, Response } from 'express';
import Coupon from '../models/Coupon';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

router.get('/validate/:code', async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (coupon) {
      res.json({ valid: true, discountPercent: coupon.discountPercent, name: coupon.name });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

export default router;
