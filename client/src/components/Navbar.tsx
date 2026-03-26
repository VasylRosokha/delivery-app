import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Shop' },
    { to: '/cart', label: `Shopping Cart${totalItems > 0 ? ` (${totalItems})` : ''}` },
    { to: '/history', label: 'History' },
    { to: '/coupons', label: 'Coupons' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Food Delivery</Link>
      </div>
      <div className="navbar-links">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}