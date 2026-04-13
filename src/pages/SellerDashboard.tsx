import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore, Product, Shop } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Package, ShoppingBag, DollarSign, Users, Edit, Trash2, Plus, Settings, UploadCloud, X, Star, AlertTriangle, Filter } from 'lucide-react';
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

const mockOrders = [
  { id: 'ORD-1001', customer: 'Ahmad Khan', items: 2, total: 2400, status: 'pending', date: '2023-10-25' },
  { id: 'ORD-1002', customer: 'Zahra Ali', items: 1, total: 1500, status: 'delivering', date: '2023-10-24' },
  { id: 'ORD-1003', customer: 'Mohammad Omar', items: 3, total: 4500, status: 'completed', date: '2023-10-23' },
  { id: 'ORD-1004', customer: 'Fatima Noor', items: 1, total: 800, status: 'cancelled', date: '2023-10-22' },
];

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { products, shops, updateProduct, deleteProduct, addProduct, updateShop } = useDataStore();
  
  const shopProducts = products.filter(p => p.shopId === user?.shopId);
  const currentShop = shops.find(s => s.id === user?.shopId);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'settings'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [shopSettings, setShopSettings] = useState<Partial<Shop>>(currentShop || {});
  const [orderFilter, setOrderFilter] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  
  const productImagesRef = useRef<HTMLInputElement>(null);
  const bannerImageRef = useRef<HTMLInputElement>(null);

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

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentShop) {
      updateShop(currentShop.id, shopSettings);
      alert('Shop settings updated successfully!');
    }
  };

  const processFiles = (files: FileList | File[]) => {
    if (!editingProduct) return;
    
    const currentImages = editingProduct.images || [editingProduct.image].filter(Boolean);
    const remainingSlots = 40 - currentImages.length;
    
    if (remainingSlots <= 0) {
      alert('Maximum of 40 images allowed.');
      return;
    }

    const filesArray = Array.from(files).slice(0, remainingSlots);
    const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
    
    setEditingProduct({
      ...editingProduct,
      images: [...currentImages, ...newImageUrls],
      image: currentImages.length === 0 && newImageUrls.length > 0 ? newImageUrls[0] : editingProduct.image
    });
  };

  const handleAddProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [editingProduct]);

  const handleRemoveProductImage = (index: number) => {
    if (editingProduct && editingProduct.images) {
      const newImages = [...editingProduct.images];
      newImages.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      });
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      setShopSettings({ ...shopSettings, image: newImageUrl });
    }
  };

  const toggleFeatured = (product: Product) => {
    updateProduct(product.id, { isFeatured: !product.isFeatured });
  };

  const filteredOrders = orderFilter === 'all' ? mockOrders : mockOrders.filter(o => o.status === orderFilter);

  return (
    <div className="space-y-8">
      <SEO title="Seller Dashboard" description="Manage your shop on Bazar.af" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('seller.dashboard')}</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>Overview</Button>
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Products</Button>
          <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>Orders</Button>
          <Button variant={activeTab === 'analytics' ? 'default' : 'outline'} onClick={() => setActiveTab('analytics')}>Analytics</Button>
          <Button variant={activeTab === 'settings' ? 'default' : 'outline'} onClick={() => setActiveTab('settings')}>Shop Settings</Button>
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
                <p className="text-xs text-muted-foreground mt-1">{shopProducts.filter(p => p.stock <= 5).length} low in stock</p>
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
                  {mockOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items • {order.customer}</p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {order.total.toLocaleString()} AFN
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
            <Button size="sm" onClick={() => setEditingProduct({ id: 'new-' + Date.now(), shopId: user?.shopId || '1', title: '', price: 0, stock: 0, image: '', images: [], category: 'General', rating: 0, reviews: 0 })}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {editingProduct ? (
              <form onSubmit={handleSaveProduct} className="space-y-6 bg-gray-50 p-6 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">{editingProduct.id.startsWith('new-') ? 'Add New Product' : 'Edit Product'}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Product Images (Max 40)</label>
                    <span className="text-xs text-muted-foreground">{(editingProduct.images || []).length} / 40</span>
                  </div>
                  
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    <div className="flex flex-wrap gap-4 mb-4">
                      {(editingProduct.images || []).map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden border group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveProductImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Cover</span>}
                        </div>
                      ))}
                      
                      {(editingProduct.images || []).length < 40 && (
                        <div 
                          className="w-24 h-24 rounded-md border-2 border-dashed flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => productImagesRef.current?.click()}
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs text-center px-1">Add Image</span>
                          <input 
                            type="file" 
                            ref={productImagesRef} 
                            className="hidden" 
                            accept="image/*" 
                            multiple
                            onChange={handleAddProductImage} 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Drag and drop images here, or click the + button to select files.
                    </div>
                  </div>
                </div>

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
                      <th className="px-4 py-3">Featured</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopProducts.map(product => (
                      <tr key={product.id} className={`border-b hover:bg-gray-50 ${product.stock <= 5 ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'} alt="" className="w-8 h-8 rounded object-cover" />
                          <span className="line-clamp-1">{product.title}</span>
                          {product.stock <= 5 && (
                            <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full ml-2 whitespace-nowrap">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={product.stock > 5 ? "text-green-600" : "text-red-600 font-bold"}>{product.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => toggleFeatured(product)}
                            className={`p-1.5 rounded-full transition-colors ${product.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                            <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                          </button>
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
                  <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500 mb-6 max-w-sm text-sm">
                      You haven't added any products to your shop yet. Add your first product to start selling.
                    </p>
                    <Button onClick={() => setEditingProduct({ id: 'new-' + Date.now(), shopId: user?.shopId || '1', title: '', price: 0, stock: 0, image: '', images: [], category: 'General', rating: 0, reviews: 0 })}>
                      <Plus className="w-4 h-4 mr-2" /> Add Your First Product
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'orders' && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Orders Management</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-50 border rounded-md px-2 py-1">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  className="text-sm bg-transparent outline-none"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="delivering">Delivering</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border rounded-md px-2 py-1">
                <select className="text-sm bg-transparent outline-none">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total (AFN)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{order.id}</td>
                      <td className="px-4 py-3">{order.date}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3">{order.items}</td>
                      <td className="px-4 py-3">{order.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500 max-w-sm text-sm">
                    {orderFilter === 'all' 
                      ? "You don't have any orders yet. When customers buy your products, they will appear here."
                      : `You don't have any orders with the status "${orderFilter}".`}
                  </p>
                  {orderFilter !== 'all' && (
                    <Button variant="outline" className="mt-6" onClick={() => setOrderFilter('all')}>
                      View All Orders
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">128,500 AFN</div>
                <p className="text-xs text-green-500 mt-1">+15% vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342</div>
                <p className="text-xs text-green-500 mt-1">+8% vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">375 AFN</div>
                <p className="text-xs text-muted-foreground mt-1">Steady</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shopProducts.slice(0, 5).map((product, idx) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-400 w-4">{idx + 1}</span>
                        <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'} alt="" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                          <p className="text-xs text-muted-foreground">{product.price} AFN</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {Math.floor(Math.random() * 50) + 10} sold
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Shop Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveShopSettings} className="space-y-8 max-w-2xl">
              
              <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                <h3 className="font-semibold text-lg">Operational Status</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Shop Open</p>
                    <p className="text-sm text-muted-foreground">Turn off to temporarily hide your shop from customers.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={shopSettings.isOpen !== false}
                      onChange={(e) => setShopSettings({...shopSettings, isOpen: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-medium">Delivery Available</p>
                    <p className="text-sm text-muted-foreground">Can you currently fulfill delivery orders?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={shopSettings.deliveryAvailable !== false}
                      onChange={(e) => setShopSettings({...shopSettings, deliveryAvailable: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Shop Banner Image</label>
                <div 
                  className="w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer overflow-hidden relative"
                  onClick={() => bannerImageRef.current?.click()}
                >
                  {shopSettings.image ? (
                    <>
                      <img src={shopSettings.image} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <span>Change Banner</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span>Upload Banner Image</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={bannerImageRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleBannerUpload} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 1200x400px. Will be stored in Firebase Storage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shop Name</label>
                  <Input 
                    value={shopSettings.name || ''} 
                    onChange={e => setShopSettings({...shopSettings, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input 
                    value={shopSettings.category || ''} 
                    onChange={e => setShopSettings({...shopSettings, category: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  value={shopSettings.description || ''}
                  onChange={e => setShopSettings({...shopSettings, description: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">District / Location</label>
                <Input 
                  value={shopSettings.district || ''} 
                  onChange={e => setShopSettings({...shopSettings, district: e.target.value})} 
                  required 
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">Save Shop Details</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

