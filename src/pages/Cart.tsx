import { useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { formatARS } from '../lib/currency';

type PaymentMethod = 'efectivo' | 'transferencia';

const WHATSAPP_PHONE = '5493534128474';

function paymentLabel(method: PaymentMethod) {
  switch (method) {
    case 'efectivo':
      return 'Efectivo';
    case 'transferencia':
      return 'Transferencia';
    default:
      return method;
  }
}

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia');

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const checkoutByWhatsApp = () => {
    if (cartItems.length === 0) return;

    const lines = cartItems.map((item, index) => {
      const colorText = item.color ? ` | Color: ${item.color}` : '';
      return `${index + 1}. ${item.name}${colorText} | Cantidad: ${item.quantity} | Unit: ${formatARS(Math.round(item.price))} | Subtotal: ${formatARS(Math.round(item.price * item.quantity))}`;
    });

    const message =
      `Hola Kazuty Parts, quiero comprar estos productos:\n\n` +
      `${lines.join('\n')}\n\n` +
      `Forma de pago: ${paymentLabel(paymentMethod)}\n` +
      `Total: ${formatARS(Math.round(total))}\n\n` +
      `Quedo atento/a para coordinar.`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Tu carrito</h1>

      {cartItems.length === 0 ? (
        <div className="bg-black/55 backdrop-blur-sm p-8 rounded-lg border border-primary/30 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300 text-lg mb-6">Tu carrito esta vacio.</p>
          <Link
            to="/products"
          className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black transition-colors btn-hover-scale btn-hover-shadow"
          >
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-black/55 backdrop-blur-sm p-4 rounded-lg border border-primary/30"
              >
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                    <p className="text-gray-300">{formatARS(Math.round(item.price))}</p>
                    {item.color ? <p className="text-sm text-gray-200">Color: {item.color}</p> : null}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 bg-gray-800 rounded-l-md hover:bg-gray-700"
                      >
                        <Minus className="h-4 w-4 text-gray-300" />
                      </button>
                      <span className="px-3 py-1 bg-gray-800 text-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 bg-gray-800 rounded-r-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4 text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-white mb-2">{formatARS(Math.round(item.price * item.quantity))}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-gray-300 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center text-white hover:text-gray-300 transition-colors link-hover">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>

          <div className="bg-black/55 backdrop-blur-sm p-6 rounded-lg border border-primary/30 h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>{formatARS(Math.round(subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envio</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg text-white">
                  <span>Total</span>
                  <span className="text-white">{formatARS(Math.round(total))}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="payment-method" className="block text-sm text-gray-300 mb-2">
                Forma de pago
              </label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 border border-white/30 rounded-md bg-black/60 text-white focus:border-white focus:ring-white"
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            <button
              onClick={checkoutByWhatsApp}
              className="w-full flex items-center justify-center bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors btn-hover-scale"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Comprar por WhatsApp
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-3 flex items-center justify-center bg-gray-800 text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
