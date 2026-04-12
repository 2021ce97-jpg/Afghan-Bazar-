import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Checkout() {
  const { t } = useTranslation();
  const { getTotal } = useCartStore();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input placeholder="Ahmad Khan" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input placeholder="+93 70 000 0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District (Kabul)</label>
              <Input placeholder="e.g. Wazir Akbar Khan" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Detailed Address</label>
              <Input placeholder="Street, House Number" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
              <span className="font-medium">Cash on Delivery (COD)</span>
              <div className="w-4 h-4 rounded-full border-4 border-primary bg-white"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Pay when you receive your order.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Order Total</h2>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total to Pay</span>
              <span>{getTotal()} AFN</span>
            </div>
            <Button className="w-full" size="lg">Place Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
