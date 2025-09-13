// /api/add-product/route.ts
import { supabaseAdmin } from '@/app/lib/SupaBaseAdmins';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const quantity = Number(formData.get('quantity'));
    const price = Number(formData.get('price'));
    const file = formData.get('image') as File;

    if (!name || !quantity || !price || !file) 
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });

    // Save file to public/images
    const buffer = Buffer.from(await file.arrayBuffer());
    const imagesPath = path.join(process.cwd(), 'public/images');
    if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);
    const filePath = `images/${file.name}`;
    fs.writeFileSync(path.join(process.cwd(), filePath), buffer);

    // Insert into Supabase
    const { data, error } = await supabaseAdmin.from('products').insert([{
      name,
      quantity,
      price,
      image: filePath,
      date: new Date().toISOString().split('T')[0]
    }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: unknown) {
    let msg = 'Something went wrong';
    if (err instanceof Error) msg = err.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
