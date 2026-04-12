import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useDataStore } from '../store/useDataStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Wishlist() {
  const { t } = useTranslation();
  const { items, toggleItem } = useWishlistStore();
  const { products } = useDataStore();
  
  const wishlistProducts = products.filter(p => items.includes(p.id));

  return (
    <div className="space-y-8">
      <SEO title="My Wishlist" description="View your saved products on Bazar.af" />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-muted-foreground">{items.length} items</span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you like to view them later.</p>
          <Link to="/shops">
            <Button>Explore Shops</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(product.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary">{product.price.toLocaleString()} AFN</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
