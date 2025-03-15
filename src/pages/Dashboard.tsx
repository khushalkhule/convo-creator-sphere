
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideSettings, LucideMessageCircle, LucideUsers, LucideLogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LucideLogOut size={18} />
          Logout
        </Button>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Account type: <span className="font-medium capitalize">{user?.subscription_tier}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideMessageCircle className="text-blue-500" />
              Chatbot Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Create and manage your AI chatbots</p>
            <Button 
              onClick={() => navigate('/chatbots')}
              className="w-full"
            >
              Manage Chatbots
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideUsers className="text-green-500" />
              Lead Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">View and manage captured leads</p>
            <Button 
              onClick={() => navigate('/leads')}
              className="w-full"
            >
              View Leads
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LucideSettings className="text-purple-500" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage your account preferences</p>
            <Button 
              onClick={() => navigate('/account')}
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

export default Dashboard;
