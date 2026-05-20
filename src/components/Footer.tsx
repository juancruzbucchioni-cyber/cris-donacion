import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/65 backdrop-blur-sm pt-12 pb-6 border-t border-[#C026FF]/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/branding/logo.png" alt="Kazuty Partz" className="h-12 w-auto mb-3" />
            <p className="text-gray-200 text-sm mb-4">Tienda especializada en repuestos y estetica para motos.</p>
            <div className="flex items-center gap-2 text-primary">
              <Instagram className="h-5 w-5" />
              <a href="https://instagram.com/kazuty_parts" target="_blank" rel="noreferrer" className="hover:underline">@kazuty_parts</a>
            </div>
          </div>

          <div>
            <h3 className="font-brand text-lg font-semibold text-[#C026FF] mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Accesorios" className="text-gray-200 hover:text-[#C026FF] transition-colors link-hover">Accesorios</Link></li>
              <li><Link to="/products?category=Escapes" className="text-gray-200 hover:text-[#C026FF] transition-colors link-hover">Escapes</Link></li>
              <li><Link to="/products?category=Plasticos" className="text-gray-200 hover:text-[#C026FF] transition-colors link-hover">Plasticos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-brand text-lg font-semibold text-[#C026FF] mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start"><MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" /><span className="text-gray-200">Argentina</span></li>
              <li className="flex items-center"><Phone className="h-5 w-5 text-primary mr-2" /><a href="tel:3534128474" className="text-gray-200 hover:underline">3534128474</a></li>
              <li className="flex items-center"><Mail className="h-5 w-5 text-primary mr-2" /><span className="text-gray-200">Instagram: kazuty_parts</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C026FF]/30 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Kazuty Partz. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 text-sm hover:text-[#C026FF] link-hover">Privacidad</Link>
            <Link to="/terms" className="text-gray-300 text-sm hover:text-[#C026FF] link-hover">Terminos</Link>
            <Link to="/sitemap" className="text-gray-300 text-sm hover:text-[#C026FF] link-hover">Mapa del sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
