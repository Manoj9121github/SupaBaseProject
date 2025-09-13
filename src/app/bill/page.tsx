"use client";
import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

// define a type for cart items
interface CartItem {
  id: number;
  name: string;
  price: number;
  selectedQty: number;
}

export default function BillPage() {
  const { cart, clearCart } = useCart();
  const TAX_RATE = 0.11; // 11% tax
  const [loading, setLoading] = useState(false);

  // type the cart correctly
  const subtotal = cart.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.selectedQty,
    0
  );
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, taxAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      alert(`Checkout successful! Order ID: ${data.orderId}`);
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Checkout failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
      <Link href="/cart" className="mb-6 text-blue-600">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">Your Bill</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.selectedQty}
              </span>
              <span>₹{item.price * item.selectedQty}</span>
            </div>
          ))}

          <div className="flex justify-between font-medium mt-4">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Tax (11%):</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}
