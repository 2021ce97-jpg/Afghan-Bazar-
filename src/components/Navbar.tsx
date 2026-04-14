import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Search, Menu, Store, Heart, User, X, LogOut, Filter } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, role, loginAsBuyer, loginAsAdmin, logout } = useAuthStore();
  const { products, shops } = useDataStore();
  const { currency, setCurrency } = useCurrencyStore();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<'all' | 'products' | 'shops'>('all');
  const searchRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = {
    products: products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),
    shops: shops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Bazar.af</span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden md:flex items-center space-x-2 relative" ref={searchRef}>
            <div className="relative w-full flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="w-full pl-9 pr-24 bg-gray-100 border-transparent focus-visible:bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              <div className="absolute right-1 top-1 bottom-1 flex items-center bg-gray-200 rounded text-xs px-2">
                <select 
                  className="bg-transparent outline-none cursor-pointer text-gray-600"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value as any)}
                >
                  <option value="all">All</option>
                  <option value="products">Products</option>
                  <option value="shops">Shops</option>
                </select>
              </div>
            </div>
            {isSearchOpen && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                {(searchFilter === 'all' || searchFilter === 'products') && searchResults.products.length > 0 && (
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1 flex items-center justify-between">
                      <span>Products</span>
                      <Link to={`/shops`} className="text-[10px] text-primary hover:underline" onClick={() => setIsSearchOpen(false)}>View all</Link>
                    </h4>
                    {searchResults.products.map(product => (
                      <div 
                        key={product.id} 
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                          <p className="text-xs text-primary">{product.price} AFN</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(searchFilter === 'all' || searchFilter === 'shops') && searchResults.shops.length > 0 && (
                  <div className={`p-2 ${searchFilter === 'all' && searchResults.products.length > 0 ? 'border-t' : ''}`}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1 flex items-center justify-between">
                      <span>Shops</span>
                      <Link to={`/shops`} className="text-[10px] text-primary hover:underline" onClick={() => setIsSearchOpen(false)}>View all</Link>
                    </h4>
                    {searchResults.shops.map(shop => (
                      <div 
                        key={shop.id} 
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => {
                          navigate(`/seller/${shop.id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={shop.logo} alt={shop.name} className="w-8 h-8 object-cover rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{shop.name}</p>
                          <p className="text-xs text-gray-500">{shop.category}</p>
                        </div>
                        {shop.isOpen === false && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Closed</span>}
                      </div>
                    ))}
                  </div>
                )}
                {((searchFilter === 'all' || searchFilter === 'products') && searchResults.products.length === 0) && 
                 ((searchFilter === 'all' || searchFilter === 'shops') && searchResults.shops.length === 0) && (
                  <div className="p-4 text-center text-sm text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-1">
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('fa')} className={`px-2 ${i18n.language === 'fa' ? 'font-bold text-primary' : ''}`}>FA</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('ps')} className={`px-2 ${i18n.language === 'ps' ? 'font-bold text-primary' : ''}`}>PS</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('en')} className={`px-2 ${i18n.language === 'en' ? 'font-bold text-primary' : ''}`}>EN</Button>
            </div>
            
            {role === 'guest' && (
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  Login / Register
                </Button>
              </Link>
            )}

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={role === 'admin' ? '/admin/dashboard' : role === 'seller' ? '/seller/dashboard' : '/profile'}>
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                    <User className="w-4 h-4" />
                    {user.name.split(' ')[0]}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }} title="Logout">
                  <LogOut className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button size="sm" className="hidden sm:flex">
                    {t('common.login')}
                  </Button>
                </Link>
                {/* Hidden admin login for testing */}
                <button className="w-2 h-2 opacity-0" onClick={loginAsAdmin}></button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            <div className="px-2">
              <Input
                type="search"
                placeholder={t('common.search')}
                className="w-full bg-gray-100 border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4 border-b pb-2">
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('fa')} className={i18n.language === 'fa' ? 'font-bold text-primary' : ''}>FA</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('ps')} className={i18n.language === 'ps' ? 'font-bold text-primary' : ''}>PS</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'font-bold text-primary' : ''}>EN</Button>
            </div>
            <div className="flex flex-col gap-2 px-2">
              {user ? (
                <>
                  <Link to={role === 'admin' ? '/admin/dashboard' : role === 'seller' ? '/seller/dashboard' : '/profile'} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" /> My Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">
                      {t('common.login')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


