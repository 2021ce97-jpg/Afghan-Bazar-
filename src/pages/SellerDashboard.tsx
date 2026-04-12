import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore, Product } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, DollarSign, Users, Edit, Trash2, Plus } from 'lucide-react';
import SEO from '../components/SEO';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { products, updateProduct, deleteProduct, addProduct } = useDataStore();
  
  const shopProducts = products.filter(p => p.shopId === user?.shopId);
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (editingProduct.id.startsWith('new-')) {
        addProduct({ ...editingProduct, id: `p${Date.now()}` });
      } else {
        updateProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-8">
      <SEO title="Seller Dashboard" description="Manage your shop on Bazar.af" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('seller.dashboard')}</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>Overview</Button>
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Products</Button>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('seller.revenue')}</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,000 AFN</div>
                <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('seller.orders')}</CardTitle>
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+124</div>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('seller.products')}</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopProducts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">4 low in stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-green-500 mt-1">+201 since last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-7 gap-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Order #100{i}</p>
                          <p className="text-xs text-muted-foreground">2 items • Ahmad Khan</p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {(i * 1200).toLocaleString()} AFN
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Products</CardTitle>
            <Button size="sm" onClick={() => setEditingProduct({ id: 'new-' + Date.now(), shopId: user?.shopId || '1', title: '', price: 0, stock: 0, image: 'https://picsum.photos/seed/new/800/800', category: 'General', rating: 0, reviews: 0 })}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {editingProduct ? (
              <form onSubmit={handleSaveProduct} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">{editingProduct.id.startsWith('new-') ? 'Add New Product' : 'Edit Product'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (AFN)</label>
                    <Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} required />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price (AFN)</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopProducts.map(product => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <img src={product.image} alt="" className="w-8 h-8 rounded object-cover" />
                          <span className="line-clamp-1">{product.title}</span>
                        </td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock}</span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => setEditingProduct(product)}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shopProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No products found. Add your first product!</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

