import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/SupaBaseClient';

interface CartItem {
  id: number;
  price: number;
  selectedQty: number;
  quantity: number;
}

interface SupabaseOrder {
  id: number;
  customer_id: string | null;
  order_date: string;
  status: string;
  total_price: number;
  tax_amount: number;
}

export async function POST(req: NextRequest) {
  try {
    // Parse & type input
    const body: {
      cart: CartItem[];
      customerId?: string;
      taxAmount?: number;
    } = await req.json();

    const { cart, customerId, taxAmount } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1️⃣ Calculate subtotal
    const subtotal = cart.reduce<number>(
      (acc, item) => acc + item.price * item.selectedQty,
      0
    );

    // 2️⃣ Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: customerId || null,
          order_date: new Date().toISOString(),
          status: 'pending',
          total_price: subtotal,
          tax_amount: taxAmount ?? 0,
        },
      ])
      .select()
      .single<SupabaseOrder>();

    if (orderError || !orderData)
      throw orderError ?? new Error('Failed to create order');

    const orderId = orderData.id;

    // 3️⃣ Prepare order_items for insert
    const orderItems = cart.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.selectedQty,
      price: item.price,
      total_price: item.price * item.selectedQty,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4️⃣ Bulk update stock
    const stockUpdates = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity - item.selectedQty,
    }));

    const { error: stockError } = await supabase
      .from('products')
      .upsert(stockUpdates, { onConflict: 'id' });

    if (stockError) throw stockError;

    // 5️⃣ Respond with order summary
    return NextResponse.json({
      order: orderData,
      items: orderItems,
      subtotal,
      taxAmount: taxAmount ?? 0,
    });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
