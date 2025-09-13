'use client';

import Image from 'next/image';
import { useCart, Product } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();

  // Get current quantity from cart for this product
  const currentQty = cart.find((c) => c.id === product.id)?.selectedQty || 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition">
      {/* Product Image */}
      <div className="w-32 h-32 relative mb-4">
        <Image
          src={product.image || '/images/placeholder.png'}
          alt={product.name}
          fill
          className="object-contain rounded"
        />
      </div>

      {/* Product Info */}
      <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
      <p className="text-gray-600 font-medium mb-3">₹{product.price}</p>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => updateQuantity(product.id, -1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="px-3">{currentQty}</span>
        <button
          onClick={() => updateQuantity(product.id, 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full font-medium transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
