
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, LineChartIcon, PieChartIcon, Loader2 } from "lucide-react";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [period, setPeriod] = useState('week');
  const token = localStorage.getItem('token');
  
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/api/analytics/${period}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching analytics:", error);
        
        // Return sample data for UI development
        const today = new Date();
        const sampleData = {
          visitors: {
            total: 1245,
            growth: 12.5,
            data: Array.from({ length: period === 'day' ? 24 : period === 'week' ? 7 : 30 }, (_, i) => {
              const date = new Date(today);
              date.setDate(date.getDate() - (period === 'day' ? 0 : i));
              return {
                date: period === 'day' ? `${i}:00` : date.toLocaleDateString(),
                value: Math.floor(Math.random() * 100) + 50
              };
            }).reverse()
          },
          interactions: {
            total: 867,
            growth: 8.3,
            data: Array.from({ length: period === 'day' ? 24 : period === 'week' ? 7 : 30 }, (_, i) => {
              const date = new Date(today);
              date.setDate(date.getDate() - (period === 'day' ? 0 : i));
              return {
                date: period === 'day' ? `${i}:00` : date.toLocaleDateString(),
                value: Math.floor(Math.random() * 80) + 30
              };
            }).reverse()
          },
          leads: {
            total: 124,
            growth: 24.2,
            data: Array.from({ length: period === 'day' ? 24 : period === 'week' ? 7 : 30 }, (_, i) => {
              const date = new Date(today);
              date.setDate(date.getDate() - (period === 'day' ? 0 : i));
              return {
                date: period === 'day' ? `${i}:00` : date.toLocaleDateString(),
                value: Math.floor(Math.random() * 15) + 2
              };
            }).reverse()
          },
          chatbotPerformance: [
            { name: "Sales Bot", value: 45 },
            { name: "Support Bot", value: 30 },
            { name: "FAQ Bot", value: 15 },
            { name: "Lead Gen Bot", value: 10 }
          ]
        };
        
        return sampleData;
      }
    }
  });
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Monitor and analyze your chatbot performance.</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <TabsList>
                <TabsTrigger value="day" onClick={() => setPeriod('day')}>Day</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setPeriod('week')}>Week</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setPeriod('month')}>Month</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Visitors
                  </CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.visitors.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {data?.visitors.growth > 0 ? '+' : ''}{data?.visitors.growth}% from last period
                  </p>
                  <div className="h-[80px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.visitors.data}>
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Chatbot Interactions
                  </CardTitle>
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.interactions.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {data?.interactions.growth > 0 ? '+' : ''}{data?.interactions.growth}% from last period
                  </p>
                  <div className="h-[80px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data?.interactions.data}>
                        <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Leads Generated
                  </CardTitle>
                  <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.leads.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {data?.leads.growth > 0 ? '+' : ''}{data?.leads.growth}% from last period
                  </p>
                  <div className="h-[80px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.leads.data}>
                        <Bar dataKey="value" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Visitor Trends</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data?.visitors.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Chatbot Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.chatbotPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data?.chatbotPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="chatbots" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Performance</CardTitle>
                <CardDescription>See how your chatbots are performing over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.interactions.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Interactions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation</CardTitle>
                <CardDescription>Track leads collected through your chatbots.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.leads.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" name="Leads" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
