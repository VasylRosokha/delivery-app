import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Shop from './models/Shop';
import Product from './models/Product';
import Coupon from './models/Coupon';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery-app';

const shops = [
  { name: "McDonald's", image: 'https://images.unsplash.com/photo-1552526881-721ce8509abb?w=400', rating: 4.2 },
  { name: 'KFC', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', rating: 3.8 },
  { name: 'Pizza Palace', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', rating: 4.5 },
  { name: 'Sushi House', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', rating: 4.7 },
  { name: 'Burger King', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', rating: 3.5 },
  { name: 'Taco Bell', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', rating: 3.9 },
];

const productsByShop: Record<string, Array<{ name: string; price: number; category: string; image: string }>> = {
  "McDonald's": [
    { name: 'Big Mac', price: 5.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
    { name: 'Quarter Pounder', price: 6.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
    { name: 'McChicken', price: 4.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
    { name: 'Chicken McNuggets (10pc)', price: 5.49, category: 'Chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { name: 'French Fries (Large)', price: 3.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
    { name: 'Coca-Cola', price: 1.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300' },
    { name: 'McFlurry Oreo', price: 3.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300' },
    { name: 'Apple Pie', price: 2.49, category: 'Desserts', image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=300' },
    { name: 'Filet-O-Fish', price: 5.29, category: 'Burgers', image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300' },
    { name: 'Iced Coffee', price: 2.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300' },
    { name: 'Hash Browns', price: 1.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300' },
    { name: 'Double Cheeseburger', price: 4.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=300' },
  ],
  'KFC': [
    { name: 'Original Recipe Bucket', price: 19.99, category: 'Chicken', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300' },
    { name: 'Crispy Strips (5pc)', price: 7.99, category: 'Chicken', image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=300' },
    { name: 'Zinger Burger', price: 6.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300' },
    { name: 'Coleslaw', price: 2.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1625938145744-e380515399bf?w=300' },
    { name: 'Mashed Potatoes', price: 3.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300' },
    { name: 'Pepsi', price: 1.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300' },
    { name: 'Chicken Wings (6pc)', price: 8.49, category: 'Chicken', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300' },
    { name: 'Popcorn Chicken', price: 5.99, category: 'Chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { name: 'Corn on the Cob', price: 2.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300' },
    { name: 'KFC Twister', price: 6.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300' },
    { name: 'Chocolate Cake', price: 3.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
    { name: 'Lemonade', price: 2.29, category: 'Drinks', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300' },
  ],
  'Pizza Palace': [
    { name: 'Margherita', price: 10.99, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
    { name: 'Pepperoni', price: 12.99, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
    { name: 'Hawaiian', price: 13.49, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' },
    { name: 'BBQ Chicken Pizza', price: 14.99, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300' },
    { name: 'Caesar Salad', price: 7.99, category: 'Salads', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300' },
    { name: 'Greek Salad', price: 8.49, category: 'Salads', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
    { name: 'Garlic Bread', price: 4.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300' },
    { name: 'Sparkling Water', price: 2.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300' },
    { name: 'Four Cheese', price: 13.99, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300' },
    { name: 'Veggie Supreme', price: 11.99, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
    { name: 'Tiramisu', price: 6.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300' },
    { name: 'Fresh Orange Juice', price: 3.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300' },
  ],
  'Sushi House': [
    { name: 'California Roll (8pc)', price: 9.99, category: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300' },
    { name: 'Salmon Nigiri (4pc)', price: 8.99, category: 'Sushi', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=300' },
    { name: 'Dragon Roll (8pc)', price: 13.99, category: 'Sushi', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300' },
    { name: 'Tonkotsu Ramen', price: 12.99, category: 'Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300' },
    { name: 'Miso Ramen', price: 11.49, category: 'Ramen', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=300' },
    { name: 'Edamame', price: 4.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=300' },
    { name: 'Green Tea', price: 2.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300' },
    { name: 'Spicy Tuna Roll (8pc)', price: 11.99, category: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300' },
    { name: 'Tempura Udon', price: 10.99, category: 'Ramen', image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=300' },
    { name: 'Mochi Ice Cream (3pc)', price: 5.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300' },
    { name: 'Sake', price: 7.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300' },
    { name: 'Gyoza (6pc)', price: 6.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300' },
  ],
  'Burger King': [
    { name: 'Whopper', price: 6.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
    { name: 'Whopper Jr.', price: 4.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
    { name: 'Chicken Royale', price: 5.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
    { name: 'Onion Rings', price: 3.29, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300' },
    { name: 'Chicken Fries', price: 4.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { name: 'Coca-Cola', price: 1.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300' },
    { name: 'Sundae', price: 2.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300' },
    { name: 'Double Whopper', price: 8.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=300' },
    { name: 'BK Veggie', price: 5.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=300' },
    { name: 'Milkshake', price: 3.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' },
    { name: 'Mozzarella Sticks', price: 4.29, category: 'Sides', image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=300' },
    { name: 'Brownie', price: 2.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300' },
  ],
  'Taco Bell': [
    { name: 'Crunchy Taco', price: 2.49, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300' },
    { name: 'Soft Taco', price: 2.99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300' },
    { name: 'Beef Burrito', price: 5.99, category: 'Burritos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300' },
    { name: 'Chicken Burrito', price: 6.49, category: 'Burritos', image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=300' },
    { name: 'Quesadilla', price: 4.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300' },
    { name: 'Nachos Supreme', price: 5.49, category: 'Sides', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300' },
    { name: 'Mountain Dew', price: 1.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300' },
    { name: 'Cinnamon Twists', price: 1.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300' },
    { name: 'Supreme Taco', price: 3.49, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300' },
    { name: 'Bean Burrito', price: 3.99, category: 'Burritos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300' },
    { name: 'Churros', price: 2.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624371414361-e670246e6859?w=300' },
    { name: 'Freeze', price: 2.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' },
  ],
};

const coupons = [
  { name: 'Welcome Discount', code: 'WELCOME10', discountPercent: 10, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300' },
  { name: 'Summer Sale', code: 'SUMMER20', discountPercent: 20, image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300' },
  { name: 'Free Delivery Special', code: 'FREEDEL15', discountPercent: 15, image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=300' },
  { name: 'Weekend Treat', code: 'WEEKEND25', discountPercent: 25, image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300' },
  { name: 'Student Offer', code: 'STUDENT30', discountPercent: 30, image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300' },
  { name: 'Holiday Bonus', code: 'HOLIDAY5', discountPercent: 5, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    const createdShops = await Shop.insertMany(shops);
    console.log(`Seeded ${createdShops.length} shops`);

    const allProducts = [];
    for (const shop of createdShops) {
      const shopProducts = productsByShop[shop.name];
      if (shopProducts) {
        for (const product of shopProducts) {
          allProducts.push({ ...product, shop: shop._id });
        }
      }
    }

    const createdProducts = await Product.insertMany(allProducts);
    console.log(`Seeded ${createdProducts.length} products`);

    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`Seeded ${createdCoupons.length} coupons`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();