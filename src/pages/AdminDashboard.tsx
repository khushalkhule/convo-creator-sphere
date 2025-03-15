
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideUsers, LucideMessageCircle, LucidePieChart, LucideSettings, LucideLogOut } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LucideLogOut size={18} />
          Logout
        </Button>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Role: <span className="font-medium text-blue-600 capitalize">{user?.role}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideUsers className="text-blue-500" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage users and their permissions</p>
            <Button 
              onClick={() => navigate('/admin/users')}
              className="w-full"
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideMessageCircle className="text-green-500" />
              Chatbot Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Monitor and manage all chatbots</p>
            <Button 
              onClick={() => navigate('/admin/chatbots')}
              className="w-full"
            >
              View Chatbots
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucidePieChart className="text-purple-500" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">View platform analytics and reports</p>
            <Button 
              onClick={() => navigate('/admin/analytics')}
              className="w-full"
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideSettings className="text-orange-500" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Configure system-wide settings</p>
            <Button 
              onClick={() => navigate('/admin/settings')}
              className="w-full"
            >
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
