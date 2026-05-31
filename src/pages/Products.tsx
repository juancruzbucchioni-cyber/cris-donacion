import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Product } from '../types/supabase';
import { Filter } from 'lucide-react';
import { formatARS } from '../lib/currency';

export default function ProductosPage() {
  const [products, setProductos] = useState<Product[]>([]);
  const [categories, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showFiltros, setShowFiltros] = useState(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchProductos = async () => {
    if (!isSupabaseConfigured) {
      setProductos([]);
      setLoading(false);
      return;
    }

    // Don't set loading to true if we're just sorting
    if (!sortBy) {
      setLoading(true);
    }
    
    // Build the query
    let query = supabase.from('products').select('*');
    
    // Apply category filter
    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }
    
    // Apply price range filter
    query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
    
    // Apply search filter
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    // Apply sorting
    if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('category', { ascending: true }).order('name', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(error);
    } else {
      setProductos(data || []);
    }
    
    setLoading(false);
  };

  const fetchCategorias = async () => {
    if (!isSupabaseConfigured) {
      setCategorias([]);
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .eq('activo', true)
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('category');
      
    if (error || productsError) {
      console.error(error || productsError);
    } else {
      const categoriesWithProducts = new Set((productsData || []).map((item) => item.category));
      const uniqueCategorias = [...new Set(data.map(item => item.name))]
        .filter((category) => categoriesWithProducts.has(category));
      setCategorias(uniqueCategorias);
    }
  };

  const fetchMaxPrice = async () => {
    if (!isSupabaseConfigured) {
      setMaxPrice(1000);
      setPriceRange([0, 1000]);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('price')
      .order('price', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error(error);
    } else if (data && data.length > 0) {
      const maxPriceValue = Math.ceil(data[0].price);
      setMaxPrice(maxPriceValue);
      setPriceRange([0, maxPriceValue]);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchMaxPrice();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProductos();
    }, 300); // Add a small delay to prevent rapid re-fetching

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const resetFiltros = () => {
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setSortBy('');
  };

  const groupedProducts = useMemo(() => {
    const group = new Map<string, Product[]>();

    products.forEach((product) => {
      const list = group.get(product.category) || [];
      list.push(product);
      group.set(product.category, list);
    });

    const orderedCategories = [
      ...categories.filter((category) => group.has(category)),
      ...Array.from(group.keys())
        .filter((category) => !categories.includes(category))
        .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })),
    ];

    return orderedCategories.map((category) => ({
      category,
      products: [...(group.get(category) || [])].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      ),
    }));
  }, [products, categories]);

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 border border-primary/30 bg-black/45 backdrop-blur-sm rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-wide text-white uppercase">
            {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory ? `Productos por categoria: ${selectedCategory}` : 'Productos por categoria'}
          </h1>
        </div>
        <p className="text-gray-300 text-sm md:text-base">
          Selecciona tu repuesto ideal con el estilo de <span className="text-primary font-bold">Kazuty Partz</span>.
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-brand text-xl font-bold text-primary uppercase tracking-widest">
          {selectedCategory || 'Todos los productos'}
        </h2>
        <button
          onClick={() => setShowFiltros(!showFiltros)}
          className="flex items-center space-x-2 bg-black/60 text-white border border-primary/40 px-4 py-2 rounded-lg md:hidden"
        >
          <Filter className="h-5 w-5" />
          <span>Filtros</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtros Sidebar */}
        <aside className={`md:w-1/4 ${showFiltros ? 'block' : 'hidden md:block'} transition-all duration-300`}>
          <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-primary/30 shadow-md sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white uppercase tracking-wider">
                Filtros
              </h2>
              <button
                onClick={resetFiltros}
                className="text-sm text-primary hover:underline"
              >
                Reiniciar
              </button>
            </div>
            
            {/* Categorias */}
            <div className="mb-6">
              <h3 className="font-brand text-lg font-medium text-[#C026FF] drop-shadow-[0_0_8px_rgba(192,38,255,0.5)] mb-3">
                Categorias
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="h-4 w-4 text-primary accent-primary"
                  />
                  <label
                    htmlFor="all-categories"
                    className="font-brand ml-2 text-gray-200"
                  >
                    Todas las categorias
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <label
                      htmlFor={category}
                      className="font-brand ml-2 text-gray-200"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rango de precio */}
            <div className="mb-6">
              <h3 className="font-brand text-lg font-medium text-[#C026FF] drop-shadow-[0_0_8px_rgba(192,38,255,0.5)] mb-3">
                Rango de precio
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-200">{formatARS(priceRange[0])}</span>
                  <span className="text-gray-200">{formatARS(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
              </div>
            </div>
            
            {/* Ordenar por */}
            <div>
              <h3 className="font-brand text-lg font-medium text-[#C026FF] drop-shadow-[0_0_8px_rgba(192,38,255,0.5)] mb-3">
                Ordenar por
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-primary/40 rounded-md bg-black/60 text-white focus:border-primary focus:ring-primary"
              >
                <option value="">Tendencias</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="newest">Mas recientes primero</option>
              </select>
            </div>
          </div>
        </aside>
        
        {/* Productos Grid */}
        <div className="md:w-3/4">
          {!isSupabaseConfigured ? (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900">
              Agrega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en <code>.env</code> para cargar productos desde tu base.
            </div>
          ) : null}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : groupedProducts.length > 0 ? (
            <div className="space-y-10">
              {groupedProducts.map((block) => (
                <section key={block.category}>
                  <h3 className="font-brand mb-4 text-2xl font-bold text-[#C026FF] drop-shadow-[0_0_8px_rgba(192,38,255,0.55)]">
                    {block.category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {block.products.map((product) => (
                      <div key={product.id} className="transform-gpu">
                        <ProductCard
                          product={product}
                          onAddToCart={addItem}
                          onQuickView={(product) => {
                            setQuickViewProduct(product);
                            setIsQuickViewOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-200">No se encontraron productos.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* QuickView Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </div>
  );
}


