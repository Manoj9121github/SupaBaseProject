// src/app/data/products.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  { id: 1, name: 'Shoes', price: 1200, image: '/images/shoes.jpg' },
  { id: 2, name: 'Watch', price: 2500, image: '/images/watch.jpg' },
  { id: 3, name: 'Bag', price: 1800, image: '/images/bag.jpg' },
];
