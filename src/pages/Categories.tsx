import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
  name: string;
  count: number;
  image_url: string;
}

export default function Categorias() {
  const [categories, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      setLoading(true);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name, image_url, activo, orden, created_at')
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error(categoriesError);
        setLoading(false);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('category, image_url');

      if (productsError) {
        console.error(productsError);
      }

      const productCountByCategory = new Map<string, number>();
      const fallbackImageByCategory = new Map<string, string>();

      (productsData || []).forEach((product) => {
        productCountByCategory.set(product.category, (productCountByCategory.get(product.category) || 0) + 1);
        if (!fallbackImageByCategory.has(product.category) && product.image_url) {
          fallbackImageByCategory.set(product.category, product.image_url);
        }
      });

      const normalizedCategories: Category[] = (categoriesData || [])
        .map((category) => ({
          name: category.name,
          count: productCountByCategory.get(category.name) || 0,
          image_url: category.image_url || fallbackImageByCategory.get(category.name) || '/branding/logo-elvio.png',
        }))
        .filter((category) => category.count > 0);

      setCategorias(normalizedCategories);
      setLoading(false);
    }

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-brand text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] mb-8">
        Categorias de productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            to={`/products?category=${category.name}`}
            className="bg-black/55 backdrop-blur-sm border border-white/30 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl will-change-transform"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 hover:backdrop-blur-md">
                <h2 className="font-brand text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] transform transition-all duration-300 hover:scale-110">{category.name}</h2>
              </div>
            </div>
            <div className="p-4 transform transition-all duration-300 hover:translate-x-2">
              <p className="text-gray-200">
                {category.count} {category.count === 1 ? 'producto' : 'productos'}
              </p>
              <p className="mt-2 text-white transition-all duration-300 ease-in-out transform hover:translate-x-1">
                Ver categoria ?
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

