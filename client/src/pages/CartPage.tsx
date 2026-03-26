import { useState, FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder, validateCoupon } from '../api';
import CartItemCard from '../components/CartItemCard';

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ name: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (items.length === 0) errs.items = 'Cart is empty';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    const result = await validateCoupon(couponCode.trim());
    if (result.valid) {
      setCouponApplied({ name: result.name!, discountPercent: result.discountPercent! });
      setCouponError('');
    } else {
      setCouponApplied(null);
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  const discountedTotal = couponApplied
    ? totalPrice * (1 - couponApplied.discountPercent / 100)
    : totalPrice;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createOrder({
        ...form,
        items: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        couponCode: couponApplied ? couponCode : undefined,
      });
      setSuccess(true);
      clearCart();
      setForm({ customerName: '', email: '', phone: '', address: '' });
      setCouponApplied(null);
      setCouponCode('');
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="cart-page">
        <div className="success-message">
          <h2>Order placed successfully!</h2>
          <p>Thank you for your order. You can check your order history for details.</p>
          <button className="btn btn-primary" onClick={() => setSuccess(false)}>
            Place another order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <div className="cart-form-section">
          <h2>Delivery Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Name:</label>
              <input
                id="customerName"
                type="text"
                value={form.customerName}
                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              />
              {errors.customerName && <span className="error">{errors.customerName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="coupon-section">
              <label>Coupon Code:</label>
              <div className="coupon-input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={!!couponApplied}
                />
                {couponApplied ? (
                  <button type="button" className="btn btn-danger" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button type="button" className="btn" onClick={handleApplyCoupon}>
                    Apply
                  </button>
                )}
              </div>
              {couponApplied && (
                <span className="coupon-success">
                  {couponApplied.name}: {couponApplied.discountPercent}% off
                </span>
              )}
              {couponError && <span className="error">{couponError}</span>}
            </div>

            {errors.items && <span className="error">{errors.items}</span>}
            {errors.submit && <span className="error">{errors.submit}</span>}

            <div className="cart-total">
              {couponApplied && (
                <p className="original-price">Subtotal: ${totalPrice.toFixed(2)}</p>
              )}
              <p className="total-price">Total: ${discountedTotal.toFixed(2)}</p>
              <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        <div className="cart-items-section">
          <h2>Cart Items</h2>
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <div className="cart-items-list">
              {items.map(item => (
                <CartItemCard key={item.product._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}