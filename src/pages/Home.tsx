import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Product, Testimonial } from '../types/supabase';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';

const DEFAULT_REVIEW_AVATAR = '/branding/avatar-placeholder.svg';

type ClientReview = {
  nombre: string;
  mensaje: string;
  foto: string;
};

export default function Home() {
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadReviews() {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setClientReviews((data as Testimonial[]).map((item) => ({
            nombre: item.nombre,
            mensaje: item.mensaje,
            foto: item.foto_url || DEFAULT_REVIEW_AVATAR,
          })));
          return;
        }
      }

      try {
        const response = await fetch('/testimonials.json');
        if (!response.ok) throw new Error('No se pudo cargar testimonials.json');
        const data = await response.json();
        if (Array.isArray(data)) {
          setClientReviews(data);
          return;
        }
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }

      setClientReviews([
        {
          nombre: 'Cris Metal Escapes',
          mensaje: 'Fabricacion de escapes 4T en acero inoxidable.',
          foto: DEFAULT_REVIEW_AVATAR,
        },
      ]);
    }

    loadReviews();
  }, []);

  useEffect(() => {
    async function loadCatalog() {
      if (!isSupabaseConfigured) return;

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!productsError && productsData) {
        setAllProducts(productsData as Product[]);
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name')
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (!categoriesError && categoriesData) {
        setAllCategories(categoriesData.map((category: { name: string }) => category.name));
      }
    }

    loadCatalog();
  }, []);

  const groupedProducts = useMemo(() => {
    const group = new Map<string, Product[]>();
    allProducts.forEach((product) => {
      const list = group.get(product.category) || [];
      list.push(product);
      group.set(product.category, list);
    });

    const orderedCategories = allCategories.length > 0 ? allCategories : Array.from(group.keys());

    return orderedCategories
      .map((category) => ({
        category,
        products: [...(group.get(category) || [])].sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        ),
      }))
      .filter((block) => block.products.length > 0);
  }, [allProducts, allCategories]);

  const categoriesWithProducts = groupedProducts.map((block) => block.category);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="relative overflow-hidden rounded-md border border-white bg-black shadow-[0_0_36px_rgba(239,68,68,0.22)]">
        <div className="p-4 md:p-6">
          <Link
            to="/products"
            className="block overflow-hidden rounded-3xl border border-white bg-black"
            aria-label="Ver catalogo Cris Metal"
          >
            <img
              src="/branding/cris-metal-hero.svg"
              alt="Cris Metal escapes 4 tiempos de competicion"
              className="h-[260px] w-full object-cover md:h-[420px] lg:h-[520px]"
            />
          </Link>

          <div className="mt-8 overflow-hidden">
            <div className="reviews-ticker-track flex items-center py-2">
              {[...clientReviews, ...clientReviews].map((review, index) => (
                <article
                  key={`${review.nombre}-${index}`}
                  className="review-ribbon-card mx-3 flex min-h-24 w-64 shrink-0 items-center justify-center px-5 py-4 text-center md:w-72"
                >
                  <div>
                    <p className="text-sm font-black uppercase text-white">{review.nombre}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{review.mensaje}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand mb-8 text-3xl font-bold text-white">Categorias</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(categoriesWithProducts.length > 0
            ? categoriesWithProducts
            : ['Escapes 4T', 'Competicion', 'Acero inoxidable', 'A medida', 'Enduro', 'Calle', 'Tornado', 'XR']
          ).map((categoria) => (
            <Link
              key={categoria}
              to={`/products?category=${encodeURIComponent(categoria)}`}
              className="font-brand rounded-md border border-white/20 bg-zinc-950 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              {categoria}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand mb-8 text-3xl font-bold text-white">Catalogo por categoria</h2>
        <div className="space-y-10">
          {groupedProducts.map((block) => (
            <div key={block.category}>
              <h3 className="font-brand mb-4 text-xl text-white md:text-2xl">{block.category}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {block.products.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="block h-full">
                    <ProductCard product={product} onAddToCart={addItem} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-zinc-950 p-6 text-center shadow-sm md:p-8">
          <p className="text-2xl font-black tracking-wide text-white">@juan.bucchioni</p>
          <p className="mt-3 text-gray-200">Seguinos para ver trabajos, ingresos y escapes instalados.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://www.instagram.com/juan.bucchioni"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              Ir a Instagram
            </a>
            <a
              href="https://wa.me/5493534128474?text=Hola%20Cris%20Metal%2C%20quiero%20consultar%20por%20un%20escape%204T."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-gray-200"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
