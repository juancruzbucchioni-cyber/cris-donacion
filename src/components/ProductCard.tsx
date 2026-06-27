import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types/supabase';
import { useEffect, memo, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { CartState } from '../types/cart';
import { formatProductPrice } from '../lib/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const cartItems = useCartStore((state: CartState) => state.items);
  const [isInCart, setIsInCart] = useState(false);
  const isOnRequest = product.price <= 0;

  useEffect(() => {
    const cartItem = cartItems.find((item: { product_id: string }) => item.product_id === product.id);
    setIsInCart(Boolean(cartItem));
  }, [cartItems, product.id]);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOnRequest) {
      const message = `Hola Kazuty Parts, quiero consultar por ${product.name}. Modelo de moto: _____. Color: _____.`;
      window.open(`https://wa.me/5493534128474?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    const existingItem = cartItems.find((item: { product_id: string }) => item.product_id === product.id);
    if (existingItem) {
      useCartStore.getState().updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }

    onAddToCart(product);
  };

  const handleQuickView = (event: React.MouseEvent) => {
    if (!onQuickView) return;
    event.preventDefault();
    event.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      onClick={handleQuickView}
      className="product-sale-card group flex h-full cursor-pointer flex-col will-change-transform"
    >
      <div className="relative overflow-hidden rounded-t-[28px] bg-[#f1f1f1]">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-64 w-full object-contain p-4 transition-transform duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute left-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-center text-[11px] font-black uppercase leading-tight text-black">
          {isOnRequest ? 'Encargo' : 'Stock'}
        </div>
        {!isOnRequest && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute left-4 top-20 rounded-full bg-emerald-400 px-3 py-2 text-xs font-black uppercase text-black">
            Quedan {product.stock}
          </div>
        )}
        {!isOnRequest && product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white">
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col border-t border-white/15 p-5 text-center">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
          {product.category}
        </p>
        <h3 className="min-h-14 text-xl font-bold leading-tight text-white">
          {product.name}
        </h3>
        <p className="mt-3 line-clamp-2 flex-grow text-sm text-gray-300">
          {product.description}
        </p>
        <div className="mt-4">
          <p className="text-3xl font-black leading-none text-white">
            {formatProductPrice(Math.round(product.price))}
          </p>
          <p className="mt-2 text-sm font-black uppercase leading-tight text-emerald-400">
            {isOnRequest ? 'Producto por encargo' : 'Precio especial por transferencia'}
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button
            onClick={handleAddToCart}
            disabled={!isOnRequest && product.stock === 0}
            className={`flex items-center justify-center gap-2 rounded-full py-3 text-sm font-black uppercase transition-all duration-300 active:scale-95 ${
              product.stock > 0 || isOnRequest
                ? 'bg-white text-black hover:bg-gray-200'
                : 'cursor-not-allowed bg-gray-500/60 text-gray-300'
            }`}
            aria-label={isOnRequest ? 'Consultar por WhatsApp' : product.stock > 0 ? (isInCart ? 'Actualizar carrito' : 'Agregar al carrito') : 'Sin stock'}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{isOnRequest ? 'Consultar' : product.stock > 0 ? (isInCart ? 'Listo' : 'Comprar') : 'Sin stock'}</span>
          </button>
          <button
            onClick={handleQuickView}
            className="flex items-center justify-center gap-2 rounded-full border border-white/70 py-3 text-sm font-black uppercase text-white transition-all duration-300 hover:bg-white hover:text-black"
            aria-label="Ver producto"
          >
            <Eye className="h-4 w-4" />
            Ver
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
