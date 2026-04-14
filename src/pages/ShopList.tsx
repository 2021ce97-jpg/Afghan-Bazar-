import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/useDataStore';
import { Card, CardContent } from '../components/ui/card';
import { Star, MapPin, Clock, Truck, AlertCircle, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';
import { useState, useMemo } from 'react';

export default function ShopList() {
  const { t } = useTranslation();
  const { shops } = useDataStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category') || '';
  const districtFilter = searchParams.get('district') || '';
  const statusFilter = searchParams.get('status') || '';
  const sortBy = searchParams.get('sort') || 'rating-desc';

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(shops.map(s => s.category)));
  const districts = Array.from(new Set(shops.map(s => s.district)));

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filteredShops = useMemo(() => {
    let result = shops;

    if (categoryFilter) {
      result = result.filter(s => s.category === categoryFilter);
    }
    if (districtFilter) {
      result = result.filter(s => s.district === districtFilter);
    }
    if (statusFilter) {
      result = result.filter(s => s.verificationStatus === statusFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [shops, categoryFilter, districtFilter, statusFilter, sortBy]);

  const activeFilterCount = (categoryFilter ? 1 : 0) + (districtFilter ? 1 : 0) + (statusFilter ? 1 : 0);

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
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> 
            Filters {activeFilterCount > 0 && <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">{activeFilterCount}</span>}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-4 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              className="w-full p-2 border rounded-md bg-transparent"
              value={categoryFilter}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <select 
              className="w-full p-2 border rounded-md bg-transparent"
              value={districtFilter}
              onChange={(e) => updateFilter('district', e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border rounded-md bg-transparent"
              value={statusFilter}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select 
              className="w-full p-2 border rounded-md bg-transparent"
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      )}

      {filteredShops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500 text-lg">No shops found matching your filters.</p>
          <Button 
            variant="link" 
            onClick={clearFilters}
            className="mt-2"
          >
            Clear all filters
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

