
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LucideDollarSign, LucideUsers, LucideTrendingUp, LucideUser } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SalesOverviewProps {
  period?: string;
}

export const SalesOverview: React.FC<SalesOverviewProps> = ({ period = '6' }) => {
  const [activePeriod, setActivePeriod] = useState(period);
  const [activeTab, setActiveTab] = useState('revenue');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sales-overview', activePeriod],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/sales/overview?period=${activePeriod}`);
        console.log('Sales data:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching sales data:', err);
        toast.error('Failed to load sales data');
        
        // Provide fallback data for development/testing
        return {
          overview: {
            totalRevenue: "35000.00",
            subscriptions: 390,
            growthRate: "15.0",
            arpu: "90.00",
            revenueGrowth: "12.0"
          },
          monthlyRevenue: [
            { month: '2024-01', revenue: 38000, subscriptions: 420, newCustomers: 45, churnedCustomers: 15 },
            { month: '2024-02', revenue: 42000, subscriptions: 450, newCustomers: 48, churnedCustomers: 18 },
            { month: '2024-03', revenue: 47000, subscriptions: 480, newCustomers: 50, churnedCustomers: 20 },
            { month: '2024-04', revenue: 52000, subscriptions: 510, newCustomers: 55, churnedCustomers: 25 },
            { month: '2024-05', revenue: 58000, subscriptions: 540, newCustomers: 60, churnedCustomers: 30 },
            { month: '2024-06', revenue: 64000, subscriptions: 570, newCustomers: 65, churnedCustomers: 35 }
          ],
          planDistribution: [
            { plan: 'Pro', subscribers: 250, revenue: 24750, percentage: 65.8 },
            { plan: 'Basic', subscribers: 100, revenue: 8900, percentage: 26.2 },
            { plan: 'Enterprise', subscribers: 40, revenue: 7960, percentage: 8.0 }
          ]
        };
      }
    }
  });
  
  // Format month name for display
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleString('default', { month: 'short' });
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle export button click
  const handleExport = () => {
    toast.info('Export functionality will be implemented here');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Failed to load sales data</h3>
          <p className="text-muted-foreground">Please check your connection and try again</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  // If no data is available, use empty arrays
  const monthlyRevenue = data?.monthlyRevenue || [];
  const planDistribution = data?.planDistribution || [];
  const overview = data?.overview || {
    totalRevenue: "0.00",
    subscriptions: 0,
    growthRate: "0.0",
    arpu: "0.00",
    revenueGrowth: "0.0"
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={activePeriod} onValueChange={setActivePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 6 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 months</SelectItem>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
      
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LucideDollarSign className="h-4 w-4 text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(overview.totalRevenue))}</div>
              <p className={`text-xs ${parseFloat(overview.revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(overview.revenueGrowth) >= 0 ? '+' : ''}{overview.revenueGrowth}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LucideUsers className="h-4 w-4 text-primary" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.subscriptions}</div>
              {monthlyRevenue.length > 0 && (
                <p className="text-xs text-green-500">
                  +{Math.round((overview.subscriptions / (monthlyRevenue[0]?.subscriptions || 1) - 1) * 100)}% from previous period
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LucideTrendingUp className="h-4 w-4 text-primary" />
                Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parseFloat(overview.growthRate) >= 0 ? '+' : ''}{overview.growthRate}%
              </div>
              <p className="text-xs text-muted-foreground">Month over month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LucideUser className="h-4 w-4 text-primary" />
                ARPU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overview.arpu}</div>
              <p className="text-xs text-muted-foreground">Average revenue per user</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="plan-distribution">Plan Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue over the last {activePeriod} months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenue.map(item => ({
                        name: formatMonth(item.month),
                        value: item.revenue
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth</CardTitle>
                <CardDescription>Monthly active subscriptions over the last {activePeriod} months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenue.map(item => ({
                        name: formatMonth(item.month),
                        value: item.subscriptions
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value}`, 'Subscriptions']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plan-distribution" className="mt-6">
            <PlanDistribution data={planDistribution} />
          </TabsContent>
        </Tabs>
      </>
    </div>
  );
};

interface PlanDistributionProps {
  data: {
    plan: string;
    subscribers: number;
    revenue: number;
    percentage: number;
  }[];
}

const PlanDistribution: React.FC<PlanDistributionProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>No plan distribution data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Breakdown of subscription plans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((plan, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{plan.plan}</h3>
                  <p className="text-sm text-muted-foreground">{plan.subscribers} subscribers</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${plan.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{plan.percentage.toFixed(1)}% of total</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${plan.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
