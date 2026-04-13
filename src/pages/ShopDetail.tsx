import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { MapPin, Star, Phone, MessageCircle, Heart, Clock, Truck, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useWishlistStore } from '../store/useWishlistStore';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ShopDetail() {
  const { shopId } = useParams();
  const { products, shops } = useDataStore();
  const shop = shops.find(s => s.id === shopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const featuredProducts = shopProducts.filter(p => p.isFeatured);
  const regularProducts = shopProducts.filter(p => !p.isFeatured);
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  
  const breadcrumbItems = [
    { label: 'Shops', href: '/shops' },
    { label: shop.name }
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <SEO 
        title={shop.name} 
        description={shop.description}
        image={shop.image}
      />
      {/* Shop Header */}
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border">

        <div className="h-48 md:h-64 w-full relative">
          <img src={shop.image} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 mb-4">
            <img 
              src={shop.logo} 
              alt={shop.name} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-md object-cover bg-white relative z-10" 
            />
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">{shop.name}</h1>
                {shop.isOpen === false ? (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Temporarily Closed
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Open Now
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {shop.district}, Kabul</span>
                <span className="flex items-center gap-1 text-amber-500 font-medium"><Star className="w-4 h-4 fill-current" /> {shop.rating} ({shop.reviews} reviews)</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium text-xs">Verified Seller</span>
                {shop.deliveryAvailable !== false && (
                  <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                    <Truck className="w-3 h-3" /> Delivery Available
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none gap-2" disabled={shop.isOpen === false}>
                <Phone className="w-4 h-4" /> Call
              </Button>
              <Button className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white" disabled={shop.isOpen === false}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </div>
          <p className="text-gray-700 max-w-3xl">{shop.description}</p>
        </div>
      </div>

      {shop.isOpen === false && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold">This shop is currently closed</h3>
            <p className="text-sm mt-1">The seller is not accepting new orders at this time. You can still browse their products, but contacting them or placing orders may be delayed.</p>
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-amber-500 fill-current" />
            <h2 className="text-2xl font-bold">Featured Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => {
              const isWishlisted = wishlistItems.includes(product.id);
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group relative border-amber-200 shadow-sm">
                  <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Featured
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                  </Button>
                  <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img src={product.images?.[0] || product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">{product.price.toLocaleString()} AFN</span>
                        <span className="text-xs text-gray-500">{product.stock} in stock</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{featuredProducts.length > 0 ? 'All Products' : 'Products'}</h2>
        {regularProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {regularProducts.map(product => {
              const isWishlisted = wishlistItems.includes(product.id);
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                  </Button>
                  <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img src={product.images?.[0] || product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">{product.price.toLocaleString()} AFN</span>
                        <span className="text-xs text-gray-500">{product.stock} in stock</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">No products available.</p>
          </div>
        )}
      </div>
    </div>
  );
}


