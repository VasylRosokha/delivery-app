import { useState, FormEvent } from 'react';
import { searchOrders } from '../api';
import { Order } from '../types';
import { useCart } from '../context/CartContext';

export default function HistoryPage() {
  const { addItem } = useCart();
  const [searchType, setSearchType] = useState<'email' | 'phone' | 'orderId'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      params[searchType] = searchValue.trim();
      const data = await searchOrders(params);
      setOrders(data);
      setSearched(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          _id: item.product,
          name: item.name,
          price: item.price,
          image: '',
          category: '',
          shop: '',
        });
      }
    }
    alert('Items added to cart!');
  };

  return (
    <div className="history-page">
      <h1>Order History</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-controls">
          <select value={searchType} onChange={e => setSearchType(e.target.value as 'email' | 'phone' | 'orderId')}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="orderId">Order ID</option>
          </select>
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder={`Enter your ${searchType === 'orderId' ? 'order ID' : searchType}`}
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <span className="error">{error}</span>}
      </form>

      {searched && (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="no-results">No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8)}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleReorder(order)}>
                    Reorder
                  </button>
                </div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  {order.discount > 0 && (
                    <span className="order-discount">Coupon: {order.couponCode} (-{order.discount}%)</span>
                  )}
                  <span className="order-total">Total: ${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
