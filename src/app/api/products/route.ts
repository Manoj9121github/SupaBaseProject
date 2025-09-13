import { NextResponse } from 'next/server';
import { products } from '@/app/data/products';

// Handle GET requests to /api/products
export async function GET() {
  try {
    return NextResponse.json(products);
  } catch {
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
    // Insert into DB or supabase here...
    return NextResponse.json({ message: 'Product added', data: body });
  } catch {
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
