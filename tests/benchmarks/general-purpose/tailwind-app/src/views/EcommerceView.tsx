import React, { useState } from 'react';
import {
  ECOMMERCE_PRODUCTS,
  Product,
  CartItem,
} from '../../../shared/domain-data';
import {
  Search,
  ShoppingBag,
  Star,
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export function EcommerceView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating'
  >('featured');
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: ECOMMERCE_PRODUCTS[0],
      quantity: 1,
      selectedColor: 'Space Gray',
    },
    {
      product: ECOMMERCE_PRODUCTS[1],
      quantity: 2,
      selectedColor: 'Matte Black',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState('Space Gray');
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const categories = ['All', 'Laptops', 'Audio', 'Wearables', 'Accessories'];

  const filteredProducts = ECOMMERCE_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const addToCart = (product: Product, color: string = 'Space Gray') => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    setCheckoutNotice(
      `Order placed successfully! Total: $${grandTotal.toFixed(2)}`
    );
    setCart([]);
    setTimeout(() => setCheckoutNotice(null), 5000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Store Header & Cart Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Hardware Storefront
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Precision Developer Workstations & Audio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Zero-compromise computing equipment, titanium wearables, and
            reference monitoring gear.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            {cartTotalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[10px] font-black flex items-center justify-center">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {checkoutNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{checkoutNotice}</span>
          </div>
          <button
            onClick={() => setCheckoutNotice(null)}
            aria-label="Dismiss notice"
            className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 min-h-[44px] lg:min-h-[36px]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Sort products by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs min-h-[44px] lg:min-h-[36px]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 8 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Product Image + Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                    {prod.badge}
                  </span>
                )}
                <button
                  onClick={() => setQuickViewProduct(prod)}
                  aria-label={`Quick view ${prod.title}`}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 shadow-md hover:bg-white dark:hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {prod.category}
                </div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                  {prod.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {prod.rating}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({prod.reviewsCount})
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-2">
              <div>
                <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  ${prod.price.toLocaleString()}
                </div>
                {prod.originalPrice > prod.price && (
                  <div className="text-[11px] text-slate-400 line-through">
                    ${prod.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>

              <button
                disabled={!prod.inStock}
                onClick={() => addToCart(prod)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] lg:min-h-[36px] ${
                  prod.inStock
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {prod.inStock ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {quickViewProduct.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {quickViewProduct.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {quickViewProduct.rating} ({quickViewProduct.reviewsCount}{' '}
                    verified reviews)
                  </span>
                </div>

                <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
                  ${quickViewProduct.price.toLocaleString()}
                </div>

                {/* Technical Specs Table */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Specifications:
                  </div>
                  {Object.entries(quickViewProduct.specs).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between text-slate-600 dark:text-slate-400"
                    >
                      <span>{k}:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Color Variants */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Color Finish:
                  </div>
                  <div className="flex items-center gap-2">
                    {['Space Gray', 'Silver', 'Matte Black'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center ${
                          selectedColor === col
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, selectedColor);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • ${quickViewProduct.price.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Shopping Bag ({cartTotalItems})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close shopping bag"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div
                tabIndex={0}
                role="region"
                aria-label="Shopping bag item list"
                className="mt-4 space-y-4 max-h-[55vh] overflow-y-auto pr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Your shopping bag is empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id + item.selectedColor}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {item.product.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.selectedColor}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                          ${item.product.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          aria-label={`Decrease quantity of ${item.product.title}`}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          aria-label={`Increase quantity of ${item.product.title}`}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Remove ${item.product.title} from shopping bag`}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>
                  $
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span>
                  ${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span>
                  $
                  {grandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
