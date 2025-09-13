'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/SupaBaseClient';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number; // renamed from quantity
  image: string; // relative path
};

export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // loader state
  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true); // start loader
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        const prods = (data as any[]).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.quantity,
          image: p.image,
        }));
        setProducts(prods);
      }
      setIsLoading(false); // stop loader
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/" className="mb-6 text-blue-600">← Back to Home</Link>
      <h1 className="text-3xl font-bold text-center mb-10">Our Products</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(p => {
          const selectedQty = cart.find(c => c.id === p.id)?.selectedQty || 0;
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Image 
                src={p.image.startsWith('images/') ? `/${p.image}` : p.image} 
                alt={p.name} 
                width={200} 
                height={200} 
                className="h-48 w-full object-contain mt-4" 
              />
              <div className="p-5">
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-gray-500 mb-2">Stock: {p.stock}</p>
                <p className="text-lg font-semibold text-blue-600 mb-2">₹{p.price}</p>
                
                <div className="flex gap-2 items-center mt-2">
                  <button 
                    onClick={() => updateQuantity(p.id, -1)} 
                    className="bg-gray-300 px-2 rounded"
                  >-</button>
                  <span>{selectedQty}</span>
                  <button 
                    onClick={() => updateQuantity(p.id, 1)} 
                    className="bg-gray-300 px-2 rounded"
                  >+</button>
                  <button 
                    onClick={() => addToCart(p)} 
                    className="ml-auto bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700 transition"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="mt-10 max-w-md mx-auto bg-white p-6 rounded-xl shadow-md text-center">
          <Link href="/cart" className="text-lg font-bold text-blue-600 underline">
            View Cart ({cart.reduce((acc, i) => acc + i.selectedQty, 0)} items) →
          </Link>
        </div>
      )}
    </div>
  );
}
