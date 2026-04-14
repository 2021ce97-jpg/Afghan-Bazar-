import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useDataStore } from '../store/useDataStore';
import { CloudSun, DollarSign, Heart, Shirt, Laptop, ShoppingBasket, HeartPulse, Sparkles, Home as HomeIcon, Gem, Footprints, Smartphone, Sofa, Baby, Dumbbell, Coffee, Wrench } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import SEO from '../components/SEO';

const CATEGORIES = [
  { name: 'Fashion & Clothing', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Electronics & Gadgets', icon: Laptop, color: 'bg-blue-100 text-blue-600' },
  { name: 'Groceries & Essentials', icon: ShoppingBasket, color: 'bg-green-100 text-green-600' },
  { name: 'Pharmacy & Health', icon: HeartPulse, color: 'bg-red-100 text-red-600' },
  { name: 'Beauty & Personal Care', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  { name: 'Home & Kitchen', icon: HomeIcon, color: 'bg-orange-100 text-orange-600' },
  { name: 'Jewelry & Accessories', icon: Gem, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Footwear', icon: Footprints, color: 'bg-teal-100 text-teal-600' },
  { name: 'Mobile & Accessories', icon: Smartphone, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Furniture & Home Decor', icon: Sofa, color: 'bg-amber-100 text-amber-600' },
  { name: 'Toys, Kids & Baby', icon: Baby, color: 'bg-rose-100 text-rose-600' },
  { name: 'Sports & Outdoors', icon: Dumbbell, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Afghan Specialties', icon: Coffee, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Tools & Hardware', icon: Wrench, color: 'bg-slate-100 text-slate-600' },
];

export default function Home() {
  const { t } = useTranslation();
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  const { products, shops } = useDataStore();

  return (
    <div className="space-y-16">
      <SEO 
        title="Bazar.af - Kabul's Trusted Local Marketplace" 
        description="Shop from your favorite local stores in Kabul, delivered to your door. The best local marketplace for groceries, clothing, electronics, and more."
      />
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-xl">

        <img 
          src="https://picsum.photos/seed/kabulmarket/1200/600" 
          alt="Kabul Market" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 px-6 py-24 sm:py-32 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 drop-shadow-lg"
          >
            {t('home.heroTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg leading-8 text-gray-200 max-w-2xl mx-auto mb-10 drop-shadow-md"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/shops">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 h-12 rounded-full">
                {t('common.allShops')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">Kabul Weather</p>
            <p className="text-xl font-bold text-blue-900">24°C, Sunny</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-green-800 font-medium">Exchange Rate (USD to AFN)</p>
            <p className="text-xl font-bold text-green-900">1 USD = 71.50 AFN</p>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/shops?category=${encodeURIComponent(category.name)}`}>
                  <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full border-transparent hover:border-gray-200">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                      <div className={`p-4 rounded-full ${category.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{category.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">{t('home.featuredProducts')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product, i) => {
            const isWishlisted = wishlistItems.includes(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group border-transparent hover:border-gray-200 relative">
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> FEATURED
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full h-8 w-8"
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
                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                      <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      <span className="font-bold text-primary">{product.price.toLocaleString()} AFN</span>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top Shops */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">{t('home.topShops')}</h2>
          <Link to="/shops" className="text-primary hover:underline text-sm font-medium">
            {t('home.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.slice(0, 4).map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/seller/${shop.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={shop.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                      <h3 className="font-semibold text-base truncate">{shop.name}</h3>
                      <p className="text-xs text-muted-foreground">{shop.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}


