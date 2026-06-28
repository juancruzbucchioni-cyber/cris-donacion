import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.32em] text-red-500">Cris Metal Escapes</p>
          <h1 className="max-w-3xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
            Fabricamos escapes 4 tiempos
          </h1>
          <p className="mt-6 text-2xl font-bold text-gray-300 sm:text-3xl">
            Calidad, potencia y sonido
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWhatsAppUrl('Hola Cris Metal, quiero consultar por el catalogo de escapes 4 tiempos.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-red-500"
            >
              Hacer consulta
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/productos"
              className="inline-flex items-center justify-center rounded-md border border-red-600/70 px-7 py-4 text-sm font-black uppercase text-white transition hover:border-red-500 hover:bg-red-600 hover:text-white"
            >
              Ver catalogo
            </Link>
          </div>
        </div>

        <div className="order-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(239,27,45,0.18)] lg:order-2">
          <img
            src="/branding/cris-metal-main-hero.png"
            alt="Escapes Cris Metal Exhaust"
            className="h-auto w-full object-contain sm:h-[430px] sm:object-cover lg:h-[560px]"
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>

      <div className="mt-14 rounded-lg border border-red-600/40 bg-red-950/20 p-6 text-center shadow-[0_20px_60px_rgba(220,38,38,0.12)]">
        <p className="text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
          Fabricantes de escapes de competicion de acero inoxidable para motos 4t
        </p>
      </div>
    </section>
  );
}
