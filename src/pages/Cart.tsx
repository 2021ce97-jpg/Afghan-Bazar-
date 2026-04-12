import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/button';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('common.cart')}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl shadow border items-center">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-primary font-medium">{item.price} AFN</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
              </div>
              <Button variant="ghost" className="text-red-500" onClick={() => removeItem(item.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-xl shadow border h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{getTotal()} AFN</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t pt-4 mb-6 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{getTotal()} AFN</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
