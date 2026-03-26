import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="product-category">{product.category}</span>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button className="btn btn-primary" onClick={() => addItem(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}