type ProductFiltersProps = {
  search: string;
  selectedMoto: string;
  motos: string[];
  onSearchChange: (value: string) => void;
  onMotoChange: (value: string) => void;
};

export default function ProductFilters({
  search,
  selectedMoto,
  motos,
  onSearchChange,
  onMotoChange,
}: ProductFiltersProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_220px]">
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-400">Buscar por nombre</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ej: Tornado, silenciador..."
          className="h-11 w-full rounded-md border border-white/15 bg-black px-4 text-white outline-none transition placeholder:text-gray-500 focus:border-red-500"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-400">Filtrar por moto</span>
        <select
          value={selectedMoto}
          onChange={(event) => onMotoChange(event.target.value)}
          className="h-11 w-full rounded-md border border-white/15 bg-black px-4 text-white outline-none transition focus:border-red-500"
        >
          {motos.map((moto) => (
            <option key={moto} value={moto}>
              {moto}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
