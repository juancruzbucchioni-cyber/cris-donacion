import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, Instagram, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const INSTAGRAM_URL = 'https://www.instagram.com/elvio.monteiro_1_2_3?igsh=MW5qZnRiZ3hibWYwMg==';
const WHATSAPP_URL = 'https://wa.me/5493755745255?text=Hola%20Elvio%20Monteiro%2C%20quiero%20consultar%20por%20productos.';

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const displayName = profile?.username || user?.email?.split('@')[0] || 'Mi cuenta';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="container flex min-h-24 flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* LOGO NUEVO EN IMAGEN */}
        <Link to="/" className="flex items-center">
          <img 
            src="/logo-elvio.png" 
            alt="Logo Elvio Monteiro" 
            className="h-16 w-auto object-contain" 
          />
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full lg:order-none lg:max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="¿Qué estás buscando?"
              className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-5 pr-12 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400" />
          </div>
        </form>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition-colors">
            <Headphones className="h-7 w-7" />
            <span>Ayuda</span>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition-colors">
            <Instagram className="h-7 w-7" />
            <span>Instagram</span>
          </a>
          {user ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition-colors">
                <User className="h-7 w-7" />
                <span>{displayName}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-md border border-gray-200 bg-white py-1 text-gray-800 shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  <button onClick={handleSignOut} className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition-colors">
              <User className="h-7 w-7" />
              <span>Mi cuenta</span>
            </Link>
          )}
          <Link to="/cart" className="relative flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition-colors">
            <ShoppingCart className="h-8 w-8" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white shadow-sm">
                {itemCount}
              </span>
            )}
            <span>Mi carrito</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container flex flex-wrap items-center justify-center gap-6 py-4 text-base font-medium tracking-wide md:gap-10 md:text-lg">
          <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">Inicio</Link>
          <Link to="/products" className="text-gray-700 hover:text-red-600 transition-colors">Productos</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-red-600 transition-colors">Contacto</a>
          <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">Quiénes Somos</Link>
          <Link to="/shipping" className="text-gray-700 hover:text-red-600 transition-colors">Cómo Comprar</Link>
          <Link to="/faq" className="text-gray-700 hover:text-red-600 transition-colors">Preguntas Frecuentes</Link>
          <Link to="/products" className="text-gray-700 hover:text-red-600 transition-colors">Mayorista</Link>
        </div>
      </div>
    </nav>
  );
} 