import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Package, MapPin, CreditCard, Settings, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function BuyerProfile() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SEO title="My Profile" description="Manage your Bazar.af account" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || '+93 7XX XXX XXX'}</p>
            </div>
            <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <Package className="w-8 h-8 text-primary" />
                <h3 className="font-medium">My Orders</h3>
                <p className="text-sm text-gray-500">Track & view history</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <MapPin className="w-8 h-8 text-primary" />
                <h3 className="font-medium">Addresses</h3>
                <p className="text-sm text-gray-500">Manage delivery spots</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm text-sm">
                  You haven't placed any orders yet. Start exploring our marketplace to find great products from local sellers.
                </p>
                <Button asChild>
                  <Link to="/">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
