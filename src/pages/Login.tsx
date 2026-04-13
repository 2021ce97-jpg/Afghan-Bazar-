import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Store, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

type Tab = 'buyer' | 'seller' | 'admin';

export default function Login() {
  const [activeTab, setActiveTab] = useState<Tab>('buyer');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  
  const { loginAsBuyer, loginAsSeller, loginAsAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'buyer') {
      loginAsBuyer('Buyer User', phone);
      navigate('/profile');
    } else if (activeTab === 'seller') {
      loginAsSeller(phone, cnic || password);
      navigate('/seller/dashboard');
    } else if (activeTab === 'admin') {
      loginAsAdmin();
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Login" description="Login to Bazar.af" />
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0 ring-1 ring-gray-100">
        <CardHeader className="space-y-1 text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-bold text-gray-900">Login</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'buyer' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4" /> Buyer
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'seller' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store className="w-4 h-4" /> Seller
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input 
                type="tel" 
                placeholder="+93 7X XXX XXXX" 
                className="h-12 rounded-xl bg-white border-gray-200 focus-visible:ring-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {activeTab === 'seller' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">CNIC / Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot Password?</a>
                </div>
                <Input 
                  type="password" 
                  placeholder="Enter your CNIC or Password" 
                  className="h-12 rounded-xl bg-white border-gray-200 focus-visible:ring-primary"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot Password?</a>
                </div>
                <Input 
                  type="password" 
                  className="h-12 rounded-xl bg-white border-gray-200 focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={activeTab !== 'admin'} // Admin can login without password for demo
                />
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 mt-2">
              Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          </form>

          {activeTab === 'seller' && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have a seller account? <a href="/seller/signup" className="text-primary hover:underline font-medium">Register your shop</a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
