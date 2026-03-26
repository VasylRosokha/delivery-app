import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import shopsRouter from './routes/shops';
import ordersRouter from './routes/orders';
import couponsRouter from './routes/coupons';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery-app';

app.use(cors());
app.use(express.json());

app.use('/api/shops', shopsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);

// Serve static files from React build in production
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
