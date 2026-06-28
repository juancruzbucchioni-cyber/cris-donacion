import { useEffect, useMemo, useState } from 'react';
import ProductCardBasic from '../components/ProductCardBasic';
import ProductFilters from '../components/ProductFilters';
import { ExhaustProduct } from '../data/products';
import { loadCatalogProducts } from '../lib/catalog';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Products() {
  const [search, setSearch] = useState('');
  const [selectedMoto, setSelectedMoto] = useState('Todas');
  const [catalogProducts, setCatalogProducts] = useState<ExhaustProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const motos = useMemo(
    () => ['Todas', ...Array.from(new Set(catalogProducts.map((product) => product.moto))).filter(Boolean)],
    [catalogProducts]
  );

  useEffect(() => {
    async function loadCatalog() {
      if (!isSupabaseConfigured) {
        setCatalogProducts([]);
        setLoadingCatalog(false);
        return;
      }

      const loadedProducts = await loadCatalogProducts();
      setCatalogProducts(loadedProducts);

      setLoadingCatalog(false);
    }

    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return catalogProducts.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(normalizedSearch);
      const matchesMoto = selectedMoto === 'Todas' || product.moto === selectedMoto;
      return matchesName && matchesMoto;
    });
  }, [catalogProducts, search, selectedMoto]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.32em] text-red-500">Productos</p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">Escapes para motos</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-300">
          Elegi el modelo y consultanos por compatibilidad, medidas y disponibilidad.
        </p>
      </div>

      <ProductFilters
        search={search}
        selectedMoto={selectedMoto}
        motos={motos}
        onSearchChange={setSearch}
        onMotoChange={setSelectedMoto}
      />

      {loadingCatalog ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          Cargando catalogo...
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCardBasic key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-300">
          No encontramos escapes con esos filtros.
        </div>
      ) : null}
    </section>
  );
}
