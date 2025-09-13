'use client';

import { useState } from 'react';
import { CheckCircle, PackagePlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    price: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.quantity || !file) {
      setMsg('❌ All fields including image are required.');
      return;
    }

    // Upload file to public/images folder via API
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('quantity', form.quantity);
    formData.append('price', form.price);
    formData.append('image', file);

    const res = await fetch('/api/add-product', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.error) setMsg('❌ ' + data.error);
    else {
      setMsg('✅ Product added successfully!');
      setForm({ name: '', quantity: '', price: '' });
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
      <Link href="/" className="mb-6 text-blue-600 self-start ml-4">← Back to Home</Link>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <PackagePlus className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        {msg && (
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <CheckCircle className="w-5 h-5" /> <span>{msg}</span>
          </div>
        )}

        <div className="space-y-4">
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange}
            className="border rounded-lg p-3 w-full" />
          <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange}
            className="border rounded-lg p-3 w-full" />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange}
            className="border rounded-lg p-3 w-full" />
          <input type="file" accept="image/*" onChange={handleFileChange} 
            className="border rounded-lg p-3 w-full" />
        </div>

        <button onClick={handleSubmit}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full">
          Add Product
        </button>
      </div>
    </div>
  );
}
