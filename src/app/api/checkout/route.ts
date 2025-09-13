import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/SupaBaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart, customerId, taxAmount } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.selectedQty, 0);

    // 1️⃣ Insert into orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customerId || null,
        order_date: new Date().toISOString(),
        status: 'pending',
        total_price: subtotal,
        tax_amount: taxAmount || 0
      }])
      .select()
      .single();

    if (orderError || !orderData) throw orderError || new Error('Failed to create order');

    const orderId = orderData.id;

    // 2️⃣ Insert into order_items
    const orderItems = cart.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.selectedQty,
      price: item.price,
      total_price: item.price * item.selectedQty
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 3️⃣ Update stock
    for (const item of cart) {
      await supabase
        .from('products')
        .update({ quantity: item.quantity - item.selectedQty })
        .eq('id', item.id);
    }

    return NextResponse.json({ orderId });

  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
