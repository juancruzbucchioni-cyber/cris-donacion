import { Search } from 'lucide-react';
import { useState } from 'react';
import { ExhaustProduct } from '../data/products';
import { buildWhatsAppUrl } from '../lib/whatsapp';

type ProductCardBasicProps = {
  product: ExhaustProduct;
};

export default function ProductCardBasic({ product }: ProductCardBasicProps) {
  const message = `Hola Cris Metal, quiero consultar por el ${product.name} del catalogo. Moto compatible: ${product.moto}.`;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-red-500/70">
      <div className="aspect-[4/3] bg-zinc-900">
        <img src={activeImage} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="space-y-4 p-5">
        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`h-14 w-16 shrink-0 overflow-hidden rounded border transition ${
                  activeImage === image ? 'border-red-500' : 'border-white/10 hover:border-red-400'
                }`}
                aria-label={`Ver imagen de ${product.name}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{product.moto}</p>
          <h3 className="mt-2 text-2xl font-black text-white">{product.name}</h3>
        </div>
        <p className="min-h-12 text-sm leading-relaxed text-gray-300">{product.description}</p>
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-red-500"
        >
          <Search className="h-4 w-4" />
          Consultar
        </a>
      </div>
    </article>
  );
}
