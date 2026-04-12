import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { MapPin, Star, Phone, MessageCircle, Heart } from 'lucide-react';
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
              <h1 className="text-2xl md:text-3xl font-bold">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {shop.district}, Kabul</span>
                <span className="flex items-center gap-1 text-amber-500 font-medium"><Star className="w-4 h-4 fill-current" /> {shop.rating} ({shop.reviews} reviews)</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium text-xs">Verified Seller</span>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none gap-2">
                <Phone className="w-4 h-4" /> Call
              </Button>
              <Button className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </div>
          <p className="text-gray-700 max-w-3xl">{shop.description}</p>
        </div>
      </div>

      {/* Shop Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        {shopProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {shopProducts.map(product => {
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
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
            <p className="text-gray-500">This shop hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}


