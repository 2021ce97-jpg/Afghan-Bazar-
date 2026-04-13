import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, MapPin, CreditCard, Settings, ShoppingBag, User, Heart, Bell, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function BuyerProfile() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <SEO title="My Account" description="Manage your Bazar.af account" />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b bg-gray-50/50 text-center">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
              </div>
              <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.phone || '+93 7XX XXX XXX'}</p>
            </div>
            <nav className="p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {tab.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white/70' : 'text-gray-300'}`} />
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t px-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
              
              <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>Update your personal information and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input defaultValue={user.name} className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input defaultValue={user.phone || ''} className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input placeholder="Enter your email" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <Input type="date" className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                <CardContent className="p-0">
                  <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-50 p-6 rounded-full mb-4 ring-8 ring-gray-50/50">
                      <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm text-center">
                      You haven't placed any orders yet. Start exploring our marketplace to find great products from local sellers.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                      <Link to="/">Start Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
                <Button>Add New Address</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary bg-primary/5 shadow-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">DEFAULT</div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Home</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {user.name}<br />
                          House 42, Street 5, Wazir Akbar Khan<br />
                          Kabul, Afghanistan<br />
                          {user.phone}
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button className="text-sm text-primary font-medium hover:underline">Edit</button>
                          <button className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['wishlist', 'payment', 'notifications', 'settings'].includes(activeTab) && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                <CardContent className="py-20 text-center text-gray-500">
                  This section is currently under development.
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
