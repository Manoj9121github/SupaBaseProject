'use client';
import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function BillPage() {
  const { cart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const TAX_RATE = 0.11;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.selectedQty, 0);
  const taxAmount = Math.round(subtotal * TAX_RATE);
  const totalWithTax = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true); // start loader

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customerId: null, taxAmount }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      alert(`Checkout successful! Order ID: ${data.orderId}`);
      clearCart();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false); // stop loader
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Bill</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4 bg-white p-6 rounded shadow-md max-w-md mx-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.selectedQty}</span>
              <span>₹{item.price * item.selectedQty}</span>
            </div>
          ))}

          <div className="flex justify-between font-medium mt-4">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Tax (11%):</span>
            <span>₹{taxAmount}</span>
          </div>
          <div className="flex justify-between font-bold mt-2 text-lg">
            <span>Total:</span>
            <span>₹{totalWithTax}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`mt-4 w-full py-2 rounded transition ${
              isCheckingOut ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isCheckingOut ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}
