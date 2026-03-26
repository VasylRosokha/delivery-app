import { useState, useEffect } from 'react';
import { fetchCoupons } from '../api';
import { Coupon } from '../types';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons().then(setCoupons);
  }, []);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="coupons-page">
      <h1>Coupons</h1>
      <div className="coupons-grid">
        {coupons.map(coupon => (
          <div key={coupon._id} className="coupon-card">
            <div className="coupon-image">
              <img src={coupon.image} alt={coupon.name} loading="lazy" />
            </div>
            <div className="coupon-info">
              <h3>{coupon.name}</h3>
              <p className="coupon-discount">{coupon.discountPercent}% OFF</p>
              <p className="coupon-code">{coupon.code}</p>
              <button
                className={`btn ${copiedCode === coupon.code ? 'btn-success' : 'btn-primary'}`}
                onClick={() => handleCopy(coupon.code)}
              >
                {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}