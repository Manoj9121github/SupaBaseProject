"use client";

import Link from "next/link";
import { Home, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.selectedQty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-200 via-blue-200 to-pink-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-800 hover:text-gray-900 font-semibold transition"
        >
          <Home className="w-6 h-6" />
          <span className="text-lg md:text-xl">E-Store</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-gray-800 hover:text-gray-900 transition"
        >
          <ShoppingCart className="w-6 h-6" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
