import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Store, ShieldCheck, ArrowRight, Lock, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

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
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50/50">
      <SEO title="Login" description="Login to Bazar.af" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
      >
        {/* Left Side - Branding/Image */}
        <div className="md:w-5/12 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-white mb-12">
              <Store className="h-8 w-8" />
              <span className="font-bold text-2xl tracking-tight">Bazar.af</span>
            </Link>
            
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Your gateway to <br/> Afghan commerce.
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Connect with thousands of buyers and sellers across the country in one unified marketplace.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm font-medium text-primary-foreground/80">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Join 10,000+ users today</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'buyer' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <User className="w-4 h-4" /> Buyer
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'seller' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <Store className="w-4 h-4" /> Seller
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'admin' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="tel" 
                    placeholder="+93 7X XXX XXXX" 
                    className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:bg-white transition-all text-base"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {activeTab === 'seller' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-semibold text-gray-700">CNIC / Password</label>
                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="Enter your CNIC or Password" 
                      className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:bg-white transition-all text-base"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:bg-white transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={activeTab !== 'admin'}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-14 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 mt-4 shadow-lg shadow-primary/20 group">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {activeTab === 'seller' && (
              <div className="mt-8 text-center text-gray-500">
                Don't have a seller account?{' '}
                <Link to="/seller/signup" className="text-primary hover:underline font-bold">
                  Register your shop
                </Link>
              </div>
            )}
            {activeTab === 'buyer' && (
              <div className="mt-8 text-center text-gray-500">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:underline font-bold">
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
