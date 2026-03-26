import { Router, Request, Response } from 'express';
import Shop from '../models/Shop';
import Product from '../models/Product';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { minRating, maxRating } = req.query;
    const filter: Record<string, unknown> = {};

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) (filter.rating as Record<string, number>).$gte = parseFloat(minRating as string);
      if (maxRating) (filter.rating as Record<string, number>).$lte = parseFloat(maxRating as string);
    }

    const shops = await Shop.find(filter).sort({ name: 1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

router.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const { category, sort, page, limit } = req.query;
    const filter: Record<string, unknown> = { shop: req.params.id };

    if (category) {
      filter.category = { $in: (category as string).split(',') };
    }

    let sortOption: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'name_asc': sortOption = { name: 1 }; break;
      default: sortOption = { name: 1 };
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const categories = await Product.distinct('category', { shop: req.params.id });

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      categories,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
