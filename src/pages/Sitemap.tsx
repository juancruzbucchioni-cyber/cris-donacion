import { Link } from 'react-router-dom';
import { FileText, HelpCircle, Home, Info, ShoppingCart, User } from 'lucide-react';

export default function Sitemap() {
  const sitemapSections = [
    {
      title: 'Paginas principales',
      icon: <Home className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Inicio', path: '/' },
        { name: 'Catalogo', path: '/products' },
        { name: 'Categorias', path: '/categories' },
        { name: 'Nosotros', path: '/about' },
        { name: 'Contacto', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
      ],
    },
    {
      title: 'Escapes',
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Todos los productos', path: '/products' },
        { name: 'Escapes 4T', path: '/products?category=Escapes 4T' },
        { name: 'Competicion', path: '/products?category=Competicion' },
        { name: 'Acero inoxidable', path: '/products?category=Acero inoxidable' },
      ],
    },
    {
      title: 'Cuenta',
      icon: <User className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Iniciar sesion / Registro', path: '/auth' },
        { name: 'Mi perfil', path: '/profile' },
        { name: 'Historial', path: '/orders' },
        { name: 'Carrito', path: '/cart' },
      ],
    },
    {
      title: 'Atencion al cliente',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Contacto', path: '/contact' },
        { name: 'Preguntas frecuentes', path: '/faq' },
        { name: 'Coordinacion', path: '/shipping' },
        { name: 'Consultas', path: '/returns' },
        { name: 'Seguimiento', path: '/orders' },
      ],
    },
    {
      title: 'Informacion legal',
      icon: <Info className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Nosotros', path: '/about' },
        { name: 'Politica de privacidad', path: '/privacy' },
        { name: 'Terminos del servicio', path: '/terms' },
      ],
    },
  ];

  return (
    <section className="container py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Mapa del sitio</h1>
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Usa esta pagina para acceder rapidamente a cualquier seccion del sitio.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section) => (
            <div key={section.title} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-4 flex items-center">
                {section.icon}
                <h2 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="flex items-center text-gray-600 transition-colors hover:text-primary dark:text-gray-300">
                      <span className="mr-2 h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Catalogo</h2>
          </div>
          <ul className="space-y-2">
            <li><Link to="/products" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Ver todos los productos</Link></li>
            <li><Link to="/categories" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Categorias de productos</Link></li>
            <li><Link to="/cart" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Carrito</Link></li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center">
            <HelpCircle className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Consultas</h2>
          </div>
          <ul className="space-y-2">
            <li><Link to="/shipping" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Coordinacion</Link></li>
            <li><Link to="/returns" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Consultas sobre productos</Link></li>
            <li><Link to="/orders" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Seguimiento</Link></li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Legal</h2>
          </div>
          <ul className="space-y-2">
            <li><Link to="/terms" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Terminos del servicio</Link></li>
            <li><Link to="/privacy" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-300">Politica de privacidad</Link></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
