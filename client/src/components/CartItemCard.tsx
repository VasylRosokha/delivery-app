import { CartItem } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  item: CartItem;
}

export default function CartItemCard({ item }: Props) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.product.image} alt={item.product.name} />
      </div>
      <div className="cart-item-info">
        <h3>{item.product.name}</h3>
        <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-controls">
        <button
          className="btn btn-sm"
          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="cart-item-qty">{item.quantity}</span>
        <button
          className="btn btn-sm"
          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <p className="cart-item-subtotal">
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
      <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.product._id)}>
        Remove
      </button>
    </div>
  );
}