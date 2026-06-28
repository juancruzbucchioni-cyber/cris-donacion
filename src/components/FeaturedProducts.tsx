import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Product } from '../types/supabase';
import { useCartStore } from '../store/cartStore';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      if (!isSupabaseConfigured) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="mt-16 w-full">
        <h2 className="text-3xl font-bold text-white mb-8">Escapes destacados</h2>
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 w-full">
      <h2 className="text-3xl font-bold text-white mb-8">Escapes destacados</h2>
      {!isSupabaseConfigured ? (
        <div className="rounded-lg border border-white/35 bg-black/55 p-4 text-left text-gray-200 backdrop-blur-sm">
          Configura <code className="text-white">VITE_SUPABASE_URL</code> y{' '}
          <code className="text-white">VITE_SUPABASE_ANON_KEY</code> en <code>.env</code> para cargar el catalogo real.
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="block h-full">
            <ProductCard product={product} onAddToCart={addItem} />
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/products"
          className="inline-block rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-white hover:text-black btn-hover-scale btn-hover-shadow"
        >
          Ver catalogo completo
        </Link>
      </div>
    </div>
  );
}
