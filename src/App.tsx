/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import './i18n/config';

import Home from './pages/Home';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import SellerDashboard from './pages/SellerDashboard';
import SellerSignup from './pages/SellerSignup';
import SellerLogin from './pages/SellerLogin';
import AdminDashboard from './pages/AdminDashboard';
import BuyerProfile from './pages/BuyerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { role } = useAuthStore();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shops" element={<ShopList />} />
              <Route path="/seller/:shopId" element={<ShopDetail />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              
              {/* Seller Routes */}
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/signup" element={<SellerSignup />} />
              <Route path="/seller/dashboard/*" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Buyer Routes */}
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                  <BuyerProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Bazar.af - Kabul's Trusted Local Marketplace
            </div>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
}




