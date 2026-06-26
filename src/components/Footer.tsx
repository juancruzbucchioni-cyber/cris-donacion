import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/elvio.monteiro_1_2_3?igsh=MW5qZnRiZ3hibWYwMg==';
const WHATSAPP_URL = 'https://wa.me/5493755745255?text=Hola%20Elvio%20Monteiro%2C%20quiero%20hacer%20una%20consulta.';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-12 pb-6 text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-brand text-2xl font-black">ELVIO MONTEIRO</p>
            <p className="mt-3 max-w-sm text-sm text-gray-700">
              Tienda de repuestos, accesorios y soluciones para motos.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold hover:text-red-600 transition-colors">
              <Instagram className="h-5 w-5" />
              @elvio.monteiro_1_2_3
            </a>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold">Categorías</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/products?category=Accesorios" className="hover:text-black hover:underline">Accesorios</Link></li>
              <li><Link to="/products?category=Escapes" className="hover:text-black hover:underline">Escapes</Link></li>
              <li><Link to="/products?category=Plasticos" className="hover:text-black hover:underline">Plásticos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold">Contacto</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start"><MapPin className="mr-2 mt-0.5 h-5 w-5 text-black" /><span>Argentina</span></li>
              <li className="flex items-center"><Phone className="mr-2 h-5 w-5 text-black" /><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-black hover:underline">+54 9 3755 74-5255</a></li>
              <li className="flex items-center"><Instagram className="mr-2 h-5 w-5 text-black" /><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-black hover:underline">@elvio.monteiro_1_2_3</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-6 md:flex-row">
          <p className="text-sm text-gray-700">© {new Date().getFullYear()} Elvio Monteiro. Todos los derechos reservados. Desarrollado por Juan.bucchioni</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-700 hover:text-black hover:underline">Privacidad</Link>
            <Link to="/terms" className="text-sm text-gray-700 hover:text-black hover:underline">Términos</Link>
            <Link to="/sitemap" className="text-sm text-gray-700 hover:text-black hover:underline">Mapa del sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}