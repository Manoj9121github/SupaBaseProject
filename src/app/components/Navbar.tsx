'use client';

import Link from 'next/link';
import { Home, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.selectedQty, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <Home className="w-6 h-6" />
          <span className="font-bold text-lg">Home</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-gray-700 hover:text-blue-800 transition"
        >
          <ShoppingCart className="w-6 h-6" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
