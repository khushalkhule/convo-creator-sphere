
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle, ChevronRight, Loader2, RefreshCw, CreditCard, Calendar } from 'lucide-react';
import axios from 'axios';

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'expired';
  plan_name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  features: string[];
  limits: {
    chatbot_limit: number;
    api_calls_limit: number;
    storage_limit: number;
  };
  usage: {
    chatbots_used: number;
    api_calls_used: number;
    storage_used: number;
  };
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  is_popular: boolean;
  chatbot_limit: number;
  api_calls_limit: number;
  storage_limit: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/subscription/current`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSubscription(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription data');
        // Set a default free subscription for demo purposes
        setSubscription({
          id: 'free-plan',
          status: 'active',
          plan_name: 'Free',
          price: 0,
          interval: 'monthly',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false,
          features: ['1 Chatbot', '1,000 API calls/month', '100MB storage'],
          limits: {
            chatbot_limit: 1,
            api_calls_limit: 1000,
            storage_limit: 100
          },
          usage: {
            chatbots_used: 0,
            api_calls_used: 0,
            storage_used: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgradeClick = () => {
    navigate('/subscription/upgrade');
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate usage percentage
  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  // Get display for billing interval
  const getBillingInterval = (interval: string) => {
    return interval === 'monthly' ? 'Monthly' : 'Yearly';
  };

  if (loading) {
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
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Your Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing details</p>
        </div>

        {error && !subscription && (
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {subscription && (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {subscription.plan_name} Plan
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
                        {subscription.status === 'active' ? 'Active' : 
                         subscription.status === 'canceled' ? 'Canceled' : 'Expired'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {subscription.price === 0 
                        ? 'Free Plan' 
                        : `$${subscription.price}/${subscription.interval === 'monthly' ? 'mo' : 'yr'}`}
                    </CardDescription>
                  </div>
                  <Button onClick={handleUpgradeClick}>
                    Upgrade Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Billing Cycle:</div>
                      <div className="font-medium">{getBillingInterval(subscription.interval)}</div>
                      
                      <div className="text-muted-foreground">Current Period:</div>
                      <div className="font-medium">
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </div>
                      
                      {subscription.price > 0 && (
                        <>
                          <div className="text-muted-foreground">Auto Renewal:</div>
                          <div className="font-medium">
                            {subscription.cancel_at_period_end ? 'Off' : 'On'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Plan Limits & Usage</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Chatbots</span>
                          <span className="font-medium">{subscription.usage.chatbots_used} / {subscription.limits.chatbot_limit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${calculateUsagePercentage(subscription.usage.chatbots_used, subscription.limits.chatbot_limit)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">API Calls</span>
                          <span className="font-medium">{subscription.usage.api_calls_used.toLocaleString()} / {subscription.limits.api_calls_limit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${calculateUsagePercentage(subscription.usage.api_calls_used, subscription.limits.api_calls_limit)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Storage</span>
                          <span className="font-medium">{subscription.usage.storage_used.toFixed(1)}MB / {subscription.limits.storage_limit}MB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${calculateUsagePercentage(subscription.usage.storage_used, subscription.limits.storage_limit)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Plan Features</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                {subscription.price > 0 ? (
                  <>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/subscription/history')}>
                      <Calendar className="h-4 w-4" />
                      Billing History
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/subscription/payment')}>
                      <CreditCard className="h-4 w-4" />
                      Update Payment Method
                    </Button>
                  </>
                ) : (
                  <div className="w-full">
                    <Button className="w-full" onClick={handleUpgradeClick}>
                      Upgrade to Pro for More Features
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;
