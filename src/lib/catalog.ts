import { ExhaustProduct } from '../data/products';
import { supabase } from './supabase';
import { Product, ProductImage } from '../types/supabase';

export function toCatalogProducts(productData: Product[], imageData: ProductImage[]): ExhaustProduct[] {
  const imagesByProduct = imageData.reduce<Record<string, string[]>>((acc, image) => {
    acc[image.product_id] = [...(acc[image.product_id] || []), image.image_url];
    return acc;
  }, {});

  return productData.map((product) => {
    const images = imagesByProduct[product.id]?.length ? imagesByProduct[product.id] : [product.image_url];

    return {
      id: product.id,
      name: product.name,
      moto: product.category || 'Consultar',
      description: product.description,
      image: images[0] || product.image_url || '/branding/cris-metal-logo.png',
      images,
    };
  });
}

export async function loadCatalogProducts() {
  const [{ data: productData, error: productError }, { data: imageData, error: imageError }] = await Promise.all([
    supabase.from('products').select('*').order('category', { ascending: true }).order('name', { ascending: true }),
    supabase.from('product_images').select('*').order('created_at', { ascending: true }),
  ]);

  if (productError || imageError) {
    throw new Error(productError?.message || imageError?.message || 'No se pudo cargar el catalogo.');
  }

  return toCatalogProducts((productData || []) as Product[], (imageData || []) as ProductImage[]);
}
