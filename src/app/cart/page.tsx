'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, clearCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.selectedQty, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/user" className="mb-6 text-blue-600">← Back </Link>
      <h1 className="text-3xl font-bold text-center mb-10">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white rounded-xl shadow-md p-4 gap-4">
              <div className="w-24 h-24 relative">
                <Image 
                  src={item.image.startsWith('images/') ? `/${item.image}` : item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain rounded" 
                />
              </div>
              <div className="flex-1">
                <h2 className="font-bold">{item.name}</h2>
                <p className="text-gray-500">Price: ₹{item.price}</p>
                <p className="text-gray-500">Stock: {item.stock}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)} 
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >−</button>
                  <span>{item.selectedQty}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)} 
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >+</button>
                </div>
              </div>
              <p className="font-semibold">₹{item.price * item.selectedQty}</p>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (11%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Link 
                href="/bill" 
                className="text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Generate Bill
              </Link>
              <button 
                onClick={clearCart} 
                className="text-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
