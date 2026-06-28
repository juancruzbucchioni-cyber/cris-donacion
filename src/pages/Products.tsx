import { useMemo, useState } from 'react';
import ProductCardBasic from '../components/ProductCardBasic';
import ProductFilters from '../components/ProductFilters';
import { products } from '../data/products';

export default function Products() {
  const [search, setSearch] = useState('');
  const [selectedMoto, setSelectedMoto] = useState('Todas');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(normalizedSearch);
      const matchesMoto = selectedMoto === 'Todas' || product.moto === selectedMoto;
      return matchesName && matchesMoto;
    });
  }, [search, selectedMoto]);

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
        onSearchChange={setSearch}
        onMotoChange={setSelectedMoto}
      />

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
