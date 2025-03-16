
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  LucideUsers, 
  LucideMessageCircle, 
  LucideBarChart, 
  LucideSettings, 
  LucideLogOut,
  LucideBell,
  LucidePackage,
  LucideWrench,
  LucideCreditCard
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
import { Subscribers } from '@/components/admin/Subscribers';
import { PlatformUsage } from '@/components/admin/PlatformUsage';
import { PaymentGateways } from '@/components/admin/PaymentGateways';
import { SalesOverview } from '@/components/admin/SalesOverview';
import { toast } from 'sonner';

// Sample data for API usage chart
const apiUsageData = [
  { name: 'Jan', apiCalls: 2500, activeChatbots: 100, users: 50 },
  { name: 'Feb', apiCalls: 3300, activeChatbots: 120, users: 55 },
  { name: 'Mar', apiCalls: 4100, activeChatbots: 140, users: 60 },
  { name: 'Apr', apiCalls: 4800, activeChatbots: 160, users: 65 },
  { name: 'May', apiCalls: 5600, activeChatbots: 180, users: 70 },
  { name: 'Jun', apiCalls: 6500, activeChatbots: 200, users: 75 },
];

// Sample stats data
const statsData = {
  totalUsers: 128,
  userGrowth: '+12%',
  activeChatbots: 243,
  chatbotGrowth: '+18%',
  apiRequests: 12543,
  apiGrowth: '+7%',
  apiCallsUsed: 543210,
  apiCallsLimit: 1000000,
  storageUsed: 43.5,
  storageLimit: 100,
  chatbotsUsed: 124,
  chatbotsLimit: 250
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("subscription-plans");
  
  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      toast.error('You do not have access to the admin dashboard');
      navigate('/dashboard');
    } else if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Function to handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    // Reset sub-tab to default when main tab changes
    if (value === "subscription") {
      setActiveSubTab("subscription-plans");
    }
  };
  
  // Function to handle sub-tab change
  const handleSubTabChange = (value) => {
    setActiveSubTab(value);
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform settings, API keys, and user accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <LucideBell size={20} />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full justify-start border-b rounded-none p-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="subscription" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger 
            value="sales" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Sales
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.totalUsers}</div>
                <p className="text-xs text-green-500">{statsData.userGrowth} from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.activeChatbots}</div>
                <p className="text-xs text-green-500">{statsData.chatbotGrowth} from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.apiRequests.toLocaleString()}</div>
                <p className="text-xs text-green-500">{statsData.apiGrowth} from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>API Usage (Last 6 Months)</CardTitle>
              <CardDescription>Track API calls and platform growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="apiCalls" 
                      name="API Calls" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeChatbots" 
                      name="Active Chatbots" 
                      stroke="#82ca9d" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      name="Users" 
                      stroke="#ffc658" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
                <CardDescription>Percentage of API calls by model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">GPT-4o-mini</span>
                      <span className="text-sm">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">GPT-4</span>
                      <span className="text-sm">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Claude-3</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Usage Metrics</CardTitle>
                <CardDescription>Current month statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total API Calls</h3>
                    <p className="text-2xl font-bold">{statsData.apiRequests.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Average per User</h3>
                    <p className="text-2xl font-bold">98</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Subscription Tab Content */}
        <TabsContent value="subscription" className="space-y-6">
          <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="subscription-plans">Subscription Plans</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="platform-usage">Platform Usage</TabsTrigger>
              <TabsTrigger value="payment-gateways">Payment Gateways</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription-plans" className="mt-6">
              <SubscriptionPlans />
            </TabsContent>
            
            <TabsContent value="subscribers" className="mt-6">
              <Subscribers />
            </TabsContent>
            
            <TabsContent value="platform-usage" className="mt-6">
              <PlatformUsage 
                apiCallsUsed={statsData.apiCallsUsed}
                apiCallsLimit={statsData.apiCallsLimit}
                storageUsed={statsData.storageUsed}
                storageLimit={statsData.storageLimit}
                chatbotsUsed={statsData.chatbotsUsed}
                chatbotsLimit={statsData.chatbotsLimit}
              />
            </TabsContent>
            
            <TabsContent value="payment-gateways" className="mt-6">
              <PaymentGateways />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Sales Tab Content */}
        <TabsContent value="sales" className="space-y-6">
          <SalesOverview />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
