import { useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Store, ShoppingBag, DollarSign, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const { products, shops } = useDataStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'products'>('overview');

  const totalProducts = products.length;
  const totalShops = shops.length;
  // Mock stats
  const totalUsers = 1250;
  const totalRevenue = 450000;

  return (
    <div className="space-y-8">
      <SEO title="Admin Dashboard" description="Bazar.af Admin Control Panel" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage users, shops, and platform data.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border">
          <Button variant={activeTab === 'overview' ? 'default' : 'ghost'} onClick={() => setActiveTab('overview')}>Overview</Button>
          <Button variant={activeTab === 'shops' ? 'default' : 'ghost'} onClick={() => setActiveTab('shops')}>Shops</Button>
          <Button variant={activeTab === 'products' ? 'default' : 'ghost'} onClick={() => setActiveTab('products')}>Products</Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} AFN</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Shops</CardTitle>
              <Store className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShops}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <ShoppingBag className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'shops' && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Shop Name</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map(shop => (
                    <tr key={shop.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <img src={shop.logo} alt="" className="w-8 h-8 rounded-full" />
                        {shop.name}
                      </td>
                      <td className="px-4 py-3">{shop.district}</td>
                      <td className="px-4 py-3">{shop.category}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center w-max gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Shop ID</th>
                    <th className="px-4 py-3">Price (AFN)</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <img src={product.image} alt="" className="w-8 h-8 rounded" />
                        <span className="line-clamp-1">{product.title}</span>
                      </td>
                      <td className="px-4 py-3">{product.shopId}</td>
                      <td className="px-4 py-3">{product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
