import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useDataStore } from '../store/useDataStore';
import { Button } from '../components/ui/button';
import { ShoppingCart, Store, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ProductDetail() {
  const { productId } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  const { products, shops } = useDataStore();
  
  const product = products.find(p => p.id === productId) || products[0];
  const shop = shops.find(s => s.id === product.shopId);

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isWishlisted = wishlistItems.includes(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem({
        productId: product.id,
        shopId: product.shopId,
        title: product.title,
        price: currentPrice,
        quantity: quantity,
        image: product.image,
        variant: selectedVariant ? { size: selectedVariant.size, color: selectedVariant.color } : undefined
      });
      setIsAdding(false);
    }, 600); // Simulate network delay
  };

  const breadcrumbItems = [
    { label: 'Shops', href: '/shops' },
    { label: shop?.name || 'Shop', href: `/seller/${shop?.id}` },
    { label: product.title }
  ];

  // Group variants by size and color for UI
  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size).filter(Boolean)));
  const colors = Array.from(new Set(product.variants?.map((v: any) => v.color).filter(Boolean)));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <SEO 
          title={product.title} 
          description={`Buy ${product.title} for ${currentPrice.toLocaleString()} AFN from ${shop?.name || 'Bazar.af'}. High-quality product sourced directly from Kabul's local markets.`}
          image={product.image}
        />
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border relative group">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full shadow-md bg-white/90 hover:bg-white"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </Button>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">{currentPrice.toLocaleString()} AFN</p>
          </div>
          
          <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="w-5 h-5" />
            Authentic product from verified local seller
          </div>

          <p className="text-gray-600 leading-relaxed">
            This is a high-quality product sourced directly from Kabul's local markets. 
            Support local businesses by purchasing authentic goods. Fast delivery within Kabul.
          </p>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              {sizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => {
                      const isSelected = (selectedVariant as any)?.size === size;
                      const isAvailable = product.variants?.some((v: any) => v.size === size && v.stock > 0);
                      return (
                        <Button
                          key={size}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          disabled={!isAvailable}
                          onClick={() => {
                            const newVariant = product.variants?.find((v: any) => v.size === size && (v.color === (selectedVariant as any)?.color || !(selectedVariant as any)?.color));
                            if (newVariant) setSelectedVariant(newVariant);
                          }}
                        >
                          {size}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => {
                      const isSelected = (selectedVariant as any)?.color === color;
                      const isAvailable = product.variants?.some((v: any) => v.color === color && v.stock > 0);
                      return (
                        <Button
                          key={color}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          disabled={!isAvailable}
                          onClick={() => {
                            const newVariant = product.variants?.find((v: any) => v.color === color && (v.size === (selectedVariant as any)?.size || !(selectedVariant as any)?.size));
                            if (newVariant) setSelectedVariant(newVariant);
                          }}
                        >
                          {color}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Availability:</span>
              <span className={currentStock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-lg bg-gray-50">
                <button 
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || currentStock === 0}
                >-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || currentStock === 0}
                >+</button>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              className="w-full gap-2 text-lg h-14" 
              disabled={currentStock === 0 || isAdding}
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>

          {shop && (
            <div className="pt-6 border-t mt-8">
              <h3 className="font-semibold mb-4">Sold by</h3>
              <Link to={`/seller/${shop.id}`} className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                <img src={shop.logo} alt={shop.name} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <h4 className="font-bold text-lg">{shop.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Store className="w-4 h-4" /> {shop.district}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


