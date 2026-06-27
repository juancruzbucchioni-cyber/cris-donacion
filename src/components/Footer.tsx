import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/juan.bucchioni';
const WHATSAPP_URL = 'https://wa.me/5493534128474?text=Hola%20Kazuty%20Parts%2C%20quiero%20hacer%20una%20consulta.';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-12 pb-6 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-brand text-2xl font-black">KAZUTY PARTS</p>
            <p className="mt-3 max-w-sm text-sm text-gray-200">
              Tienda de repuestos, accesorios y soluciones para motos.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-white hover:text-gray-300 transition-colors">
              <Instagram className="h-5 w-5" />
              @juan.bucchioni
            </a>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold text-white">Categorías</h3>
            <ul className="space-y-2 text-gray-200">
              <li><Link to="/products?category=Accesorios" className="hover:text-white hover:underline">Accesorios</Link></li>
              <li><Link to="/products?category=Escapes" className="hover:text-white hover:underline">Escapes</Link></li>
              <li><Link to="/products?category=Plasticos" className="hover:text-white hover:underline">Plásticos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold text-white">Contacto</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start"><MapPin className="mr-2 mt-0.5 h-5 w-5 text-white" /><span>Argentina</span></li>
              <li className="flex items-center"><Phone className="mr-2 h-5 w-5 text-white" /><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">3534128474</a></li>
              <li className="flex items-center"><Instagram className="mr-2 h-5 w-5 text-white" /><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">@juan.bucchioni</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-6 md:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-200 md:justify-start">
            <span>© {new Date().getFullYear()} Kazuty Parts. Todos los derechos reservados.</span>
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-200 hover:text-white hover:underline">Privacidad</Link>
            <Link to="/terms" className="text-sm text-gray-200 hover:text-white hover:underline">Términos</Link>
            <Link to="/sitemap" className="text-sm text-gray-200 hover:text-white hover:underline">Mapa del sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
