import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/useDataStore';
import { Card, CardContent } from '../components/ui/card';
import { Star, MapPin, Clock, Truck, AlertCircle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';

export default function ShopList() {
  const { t } = useTranslation();
  const { shops } = useDataStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredShops = categoryFilter 
    ? shops.filter(s => s.category === categoryFilter)
    : shops;
  
  return (
    <div className="space-y-8">
      <SEO 
        title={categoryFilter ? `${categoryFilter} Shops in Kabul` : "All Shops in Kabul"} 
        description="Browse all verified shops in Kabul. Find the best local stores for carpets, groceries, dry fruits, fashion, and electronics."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {categoryFilter ? `${categoryFilter} Shops` : t('common.allShops')}
          </h1>
          <p className="text-muted-foreground">
            {categoryFilter 
              ? `Browse all verified ${categoryFilter.toLowerCase()} shops in Kabul.` 
              : "Browse all verified shops in Kabul."}
          </p>
        </div>
        
        {categoryFilter && (
          <Button 
            variant="outline" 
            onClick={() => setSearchParams({})}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Clear Filter
          </Button>
        )}
      </div>

      {filteredShops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500 text-lg">No shops found in this category.</p>
          <Button 
            variant="link" 
            onClick={() => setSearchParams({})}
            className="mt-2"
          >
            View all shops
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/seller/${shop.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col relative">
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                    {shop.isOpen === false ? (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" /> CLOSED
                      </span>
                    ) : (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3" /> OPEN
                      </span>
                    )}
                    {shop.deliveryAvailable !== false && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Truck className="w-3 h-3" /> DELIVERY
                      </span>
                    )}
                  </div>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img 
                      src={shop.image} 
                      alt={shop.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${shop.isOpen === false ? 'grayscale opacity-80' : 'group-hover:scale-105'}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <img src={shop.logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white object-cover bg-white" />
                      <div className="text-white">
                        <h3 className="font-bold text-lg leading-tight">{shop.name}</h3>
                        <p className="text-sm opacity-90">{shop.category}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shop.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{shop.rating}</span>
                        <span className="text-gray-400 font-normal">({shop.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.district}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

