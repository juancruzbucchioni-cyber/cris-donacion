import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Product, Testimonial } from '../types/supabase';
import { formatARS } from '../lib/currency';

type ClientReview = {
  nombre: string;
  mensaje: string;
  foto: string;
};

export default function Home() {
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

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
          const normalized = (data as Testimonial[]).map((item) => ({
            nombre: item.nombre,
            mensaje: item.mensaje,
            foto: item.foto_url || '/branding/logo.png',
          }));
          setClientReviews(normalized);
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
        console.error('Error cargando reseñas de clientes:', error);
      }

      setClientReviews([
        {
          nombre: 'Cliente Kazuty',
          mensaje: 'Excelente atencion, me ayudaron a elegir justo lo que necesitaba.',
          foto: '/branding/logo.png',
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
        .eq('activo', true)
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (!categoriesError && categoriesData) {
        setAllCategories(categoriesData.map((c: { name: string }) => c.name));
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

    const orderedCategories = allCategories.length > 0
      ? allCategories
      : Array.from(group.keys());

    return orderedCategories
      .map((category) => ({
        category,
        products: [...(group.get(category) || [])].sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        ),
      }))
      .filter((block) => block.products.length > 0);
  }, [allProducts, allCategories]);

  return (
    <section className="container py-10">
      <div className="relative min-h-[72vh] w-full rounded-lg border border-primary/20 bg-black/35 backdrop-blur-sm">
        <div className="relative z-10 min-h-[72vh] flex flex-col items-center justify-start pt-20 md:pt-16 text-center px-4">
          <h1 className="font-brand text-4xl md:text-6xl font-bold text-white">
            KAZUTY <span className="text-primary">PARTZ</span>
          </h1>
          <p className="text-gray-100 mt-4 max-w-2xl text-lg md:text-xl font-medium">
            Estilo, potencia y pasion para tu moto.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/products" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-violet-700 transition-colors">Ver productos</Link>
            <Link to="/categories" className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-md hover:bg-white/20 transition-colors">Categorias</Link>
          </div>

          <div className="mt-8 w-full max-w-5xl overflow-hidden rounded-md border border-[#C026FF]/40 bg-black/45 backdrop-blur-sm">
            <div className="reviews-ticker-track flex items-center py-3">
              {[...clientReviews, ...clientReviews].map((review, index) => (
                <div key={`${review.nombre}-${index}`} className="mx-3 shrink-0 rounded-md border border-[#C026FF]/35 bg-[#C026FF]/10 px-4 py-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.foto || '/branding/logo.png'}
                      alt={review.nombre}
                      className="h-10 w-10 rounded-full object-cover border border-[#C026FF]/50"
                    />
                    <p className="text-sm md:text-base text-[#F5E8FF]">
                      <span className="font-bold text-[#C026FF]">{review.nombre}:</span> {review.mensaje}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand text-3xl font-bold text-[#C026FF] drop-shadow-[0_0_10px_rgba(192,38,255,0.55)] mb-8">Todas las categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(allCategories.length > 0
            ? allCategories
            : ['Accesorios', 'Escapes', 'Plasticos', 'Transmision', 'Electronica', 'Frenos', 'Iluminacion', 'Indumentaria']
          ).map((categoria) => (
            <Link
              key={categoria}
              to={`/products?category=${encodeURIComponent(categoria)}`}
              className="font-brand text-center px-4 py-3 rounded-md border border-[#C026FF]/45 bg-[#C026FF]/10 text-[#C026FF] drop-shadow-[0_0_8px_rgba(192,38,255,0.5)] hover:bg-[#C026FF]/20 transition-colors font-semibold"
            >
              {categoria}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand text-3xl font-bold text-[#C026FF] drop-shadow-[0_0_10px_rgba(192,38,255,0.55)] mb-8">Productos por categoria</h2>
        <div className="space-y-10">
          {groupedProducts.map((block) => (
            <div key={block.category}>
              <h3 className="font-brand text-xl md:text-2xl text-[#C026FF] mb-4">{block.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {block.products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-black/55 backdrop-blur-sm border border-[#C026FF]/30 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform"
                  >
                    <img src={product.image_url} alt={product.name} className="w-full h-44 object-cover" />
                    <div className="p-3">
                      <p className="text-xs text-gray-300 uppercase tracking-wider">{product.category}</p>
                      <h4 className="text-white font-semibold mt-1 line-clamp-2">{product.name}</h4>
                      <p className="text-[#C026FF] font-extrabold mt-2">{formatARS(Math.round(product.price))}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <div className="bg-black/55 border border-[#C026FF]/35 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center max-w-3xl mx-auto">
          <p className="text-[#C026FF] text-2xl font-black tracking-wide">@kazuty_parts</p>
          <p className="text-gray-200 mt-3">Seguinos para novedades, ingresos y promos.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://instagram.com/kazuty_parts"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md border border-[#C026FF] bg-[#C026FF]/20 text-white hover:bg-[#C026FF]/30 transition-colors font-bold"
            >
              Ir a Instagram
            </a>
            <a
              href="https://wa.me/543534128474?text=Hola%20Kazuty%20Partz%2C%20quiero%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md border border-[#C026FF] bg-[#C026FF]/20 text-white hover:bg-[#C026FF]/30 transition-colors font-bold"
            >
              Enviar mensaje directo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
