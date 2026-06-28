import { Instagram, MapPin, MessageCircle, Clock } from 'lucide-react';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export default function Contact() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <div className="mb-8">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.32em] text-red-500">Contacto</p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">Hablemos de tu escape</h1>
        <p className="mt-4 text-lg text-gray-300">Mandanos el modelo de tu moto y te asesoramos.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <a
          href={buildWhatsAppUrl('Hola Cris Metal, quiero consultar por un escape para mi moto.')}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-red-500"
        >
          <MessageCircle className="h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-2xl font-black text-white">WhatsApp</h2>
          <p className="mt-2 text-gray-300">3534093888</p>
        </a>

        <a
          href="https://www.instagram.com/cr.crismetal"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-red-500"
        >
          <Instagram className="h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-2xl font-black text-white">Instagram</h2>
          <p className="mt-2 text-gray-300">@cr.crismetal</p>
        </a>

        <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
          <MapPin className="h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-2xl font-black text-white">Direccion</h2>
          <p className="mt-2 text-gray-300">Villa Maria, Cordoba, Argentina</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
          <Clock className="h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-2xl font-black text-white">Horarios</h2>
          <p className="mt-2 text-gray-300">Lunes a sabados, coordinando por WhatsApp.</p>
        </div>
      </div>
    </section>
  );
}
