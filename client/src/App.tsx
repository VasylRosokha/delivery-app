import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import HistoryPage from './pages/HistoryPage';
import CouponsPage from './pages/CouponsPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
