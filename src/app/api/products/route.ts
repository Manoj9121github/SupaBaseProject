// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { products } from '@/app/data/products'; // adjust path if needed

// Handle GET requests to /api/products
export async function GET() {
  try {
    // You can fetch from DB or Supabase here instead of static data
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Optionally handle POST to add a new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // insert into DB or supabase here...
    return NextResponse.json({ message: 'Product added', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
