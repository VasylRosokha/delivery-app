import { useState, useEffect, useCallback } from 'react';
import { fetchShops, fetchProducts } from '../api';
import { Shop, Product } from '../types';
import ProductCard from '../components/ProductCard';

const RATING_RANGES = [
  { label: 'All Ratings', min: undefined, max: undefined },
  { label: '4.0 - 5.0', min: 4.0, max: 5.0 },
  { label: '3.0 - 4.0', min: 3.0, max: 4.0 },
  { label: '2.0 - 3.0', min: 2.0, max: 3.0 },
];

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
];

const PRODUCTS_PER_PAGE = 8;

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('name_asc');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadShops = useCallback(async () => {
    const range = RATING_RANGES[ratingFilter];
    const data = await fetchShops(range.min, range.max);
    setShops(data);
    if (data.length > 0 && (!selectedShop || !data.find(s => s._id === selectedShop._id))) {
      setSelectedShop(data[0]);
    }
  }, [ratingFilter, selectedShop]);

  const loadProducts = useCallback(async () => {
    if (!selectedShop) return;
    setLoading(true);
    const data = await fetchProducts(selectedShop._id, {
      category: selectedCategories.join(',') || undefined,
      sort: sortOption,
      page,
      limit: PRODUCTS_PER_PAGE,
    });
    setProducts(data.products);
    setTotalPages(data.totalPages);
    setCategories(data.categories);
    setLoading(false);
  }, [selectedShop, selectedCategories, sortOption, page]);

  useEffect(() => { loadShops(); }, [ratingFilter]);

  useEffect(() => {
    setPage(1);
  }, [selectedShop, selectedCategories, sortOption]);

  useEffect(() => { loadProducts(); }, [selectedShop, selectedCategories, sortOption, page]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="shop-page">
      <aside className="shop-sidebar">
        <h2>Shops</h2>
        <div className="filter-group">
          <label>Filter by Rating:</label>
          <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))}>
            {RATING_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="shop-list">
          {shops.map(shop => (
            <button
              key={shop._id}
              className={`shop-item ${selectedShop?._id === shop._id ? 'active' : ''}`}
              onClick={() => { setSelectedShop(shop); setSelectedCategories([]); }}
            >
              <span className="shop-name">{shop.name}</span>
              <span className="shop-rating">{'★'.repeat(Math.round(shop.rating))} {shop.rating}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="shop-content">
        {selectedShop && (
          <>
            <div className="shop-header">
              <h1>{selectedShop.name}</h1>
              <div className="shop-controls">
                <div className="category-filters">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`btn btn-filter ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  className="sort-select"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                  {products.length === 0 && (
                    <p className="no-results">No products found.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn"
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </button>
                    <span className="page-info">Page {page} of {totalPages}</span>
                    <button
                      className="btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
