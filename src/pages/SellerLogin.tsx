import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Store, Phone, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';

export default function SellerLogin() {
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const loginAsSeller = useAuthStore(state => state.loginAsSeller);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && cnic) {
      loginAsSeller(phone, cnic);
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Seller Login" description="Login to your Bazar.af seller account" />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Store className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Seller Portal Login</CardTitle>
          <CardDescription>
            Enter your registered mobile number and Afghan CNIC (Tazkira) to access your shop dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="tel" 
                  placeholder="+93 7XX XXX XXX" 
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CNIC / Tazkira Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Enter 13-digit Tazkira number" 
                  className="pl-10"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg mt-6">
              Login to Dashboard
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have a seller account? <a href="/seller/signup" className="text-primary hover:underline font-medium">Register your shop</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
