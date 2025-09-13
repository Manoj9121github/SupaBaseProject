import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'My Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Wrap entire app with CartProvider */}
        <CartProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
