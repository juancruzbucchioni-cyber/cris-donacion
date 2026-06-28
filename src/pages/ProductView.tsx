import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ExhaustProduct } from '../data/products';
import { loadCatalogProducts } from '../lib/catalog';
import { isSupabaseConfigured } from '../lib/supabase';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export default function ProductView() {
  const { productId } = useParams();
  const [products, setProducts] = useState<ExhaustProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const loadedProducts = await loadCatalogProducts();
        setProducts(loadedProducts);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, []);

  const product = useMemo(() => products.find((item) => item.id === productId), [productId, products]);
  const images = product?.images && product.images.length > 0 ? product.images : product ? [product.image] : [];

  useEffect(() => {
    setActiveImage(images[0] || '');
  }, [images]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-gray-300">Cargando producto...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <Link to="/productos" className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase text-red-400 hover:text-red-200">
          <ArrowLeft className="h-4 w-4" />
          Volver al catalogo
        </Link>
        <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-6 text-red-100">{error}</div>
      </section>
    );
  }

  if (!product) {
    return <Navigate to="/productos" replace />;
  }

  const message = `Hola Cris Metal, quiero consultar por el ${product.name}. Moto compatible: ${product.moto}.`;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16">
      <Link to="/productos" className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase text-red-400 hover:text-red-200">
        <ArrowLeft className="h-4 w-4" />
        Volver al catalogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
            <img src={activeImage || product.image} alt={product.name} className="max-h-[720px] w-full object-contain" />
          </div>

          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`aspect-square overflow-hidden rounded-md border transition ${
                    activeImage === image ? 'border-red-500' : 'border-white/10 hover:border-red-400'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-white/10 bg-zinc-950 p-6 lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-red-500">{product.moto}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-300">{product.description}</p>
          <div className="mt-6 rounded-md border border-white/10 bg-black p-4 text-sm text-gray-300">
            <p className="font-bold text-white">Fotos disponibles: {images.length}</p>
            <p className="mt-1">Toca una miniatura para verla grande.</p>
          </div>
          <a
            href={buildWhatsAppUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-red-500"
          >
            <MessageCircle className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
