import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Catalogo', to: '/productos' },
  { label: 'Contacto', to: '/contacto' },
];

const INSTAGRAM_URL = 'https://www.instagram.com/cr.crismetal';

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" aria-label="Ir a Inicio" className="flex items-center gap-3">
          <img src="/branding/cris-metal-logo.png" alt="Cris Metal" className="h-14 w-auto object-contain" />
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-black uppercase tracking-wide text-white sm:justify-end">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition-colors hover:bg-red-600 hover:text-white ${
                  isActive ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/5 px-4 py-2 transition-colors hover:bg-red-600 hover:text-white"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
