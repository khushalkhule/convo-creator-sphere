
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeDollarSign, Calendar, CheckCircle2, CreditCard, Download, Loader2 } from "lucide-react";
import axios from 'axios';

interface Plan {
  id: string;
  name: string;
  price: number;
  chatbot_limit: number;
  api_call_limit: number;
  storage_limit: number;
  features: Record<string, boolean>;
}

interface Subscription {
  id: string;
  status: string;
  next_billing_date: string;
  plan: Plan;
}

interface Usage {
  api_calls_used: number;
  storage_used: number;
  chatbots_created: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  billing_date: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SubscriptionsPage = () => {
  const { toast } = useToast();
  const token = localStorage.getItem('token');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Fetch subscription data
  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  // Fetch available plans
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/subscription/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  const handleUpgradePlan = async (planId: string) => {
    setIsUpgrading(true);
    try {
      await axios.post(
        `${API_URL}/api/subscription/upgrade`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Plan Upgraded",
        description: "Your subscription has been successfully upgraded."
      });
      
      // Refresh subscription data
      window.location.reload();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? This will downgrade you to the Free plan at the end of your billing period.")) {
      return;
    }
    
    try {
      await axios.post(
        `${API_URL}/api/subscription/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You will be downgraded at the end of your billing period."
      });
      
      // Refresh subscription data
      window.location.reload();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: "Your invoice is being downloaded."
    });
  };

  if (isSubscriptionLoading || isPlansLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing.</p>
        </div>

        {subscription && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Plan Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your current subscription details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{subscription.plan.name}</h3>
                    <p className="text-muted-foreground">
                      ${subscription.plan.price}/month
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                      subscription.status === 'cancelled' ? 'bg-orange-100 text-orange-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                    {subscription.status === 'active' && (
                      <span className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Renews {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </span>
                    )}
                    {subscription.status === 'cancelled' && (
                      <span className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Ends {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Chatbots</span>
                      <span>{subscription.usage?.chatbots_created || 0} of {subscription.plan.chatbot_limit}</span>
                    </div>
                    <Progress value={(subscription.usage?.chatbots_created || 0) / subscription.plan.chatbot_limit * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>API Calls</span>
                      <span>{subscription.usage?.api_calls_used.toLocaleString() || 0} of {subscription.plan.api_call_limit.toLocaleString()}</span>
                    </div>
                    <Progress value={(subscription.usage?.api_calls_used || 0) / subscription.plan.api_call_limit * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Storage</span>
                      <span>{(subscription.usage?.storage_used || 0).toFixed(1)} GB of {subscription.plan.storage_limit} GB</span>
                    </div>
                    <Progress value={(subscription.usage?.storage_used || 0) / subscription.plan.storage_limit * 100} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleCancelSubscription} disabled={subscription.status !== 'active'}>
                  {subscription.status === 'cancelled' ? 'Subscription Cancelled' : 'Cancel Subscription'}
                </Button>
                <Button>Manage Payment Methods</Button>
              </CardFooter>
            </Card>

            {/* Payment Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md flex items-center gap-4">
                    <div className="h-8 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Billing Address:</p>
                    <p className="text-muted-foreground">123 Business St</p>
                    <p className="text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" className="w-full">Update Payment Info</Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Available Plans */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans && plans.map((plan: Plan) => (
              <Card key={plan.id} className={subscription?.plan.id === plan.id ? "border-primary" : ""}>
                {subscription?.plan.id === plan.id && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Current Plan
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">${plan.price}</span>/month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{plan.chatbot_limit} {plan.chatbot_limit === 1 ? 'chatbot' : 'chatbots'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{plan.api_call_limit.toLocaleString()} API calls per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{plan.storage_limit} GB storage</span>
                    </li>
                    {plan.features && Object.entries(plan.features).map(([feature, isEnabled]) => (
                      isEnabled && (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature.split('_').join(' ')}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={subscription?.plan.id === plan.id ? "outline" : "default"}
                    className="w-full"
                    disabled={subscription?.plan.id === plan.id || isUpgrading}
                    onClick={() => handleUpgradePlan(plan.id)}
                  >
                    {subscription?.plan.id === plan.id ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Billing History</h2>
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Invoice</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Amount</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-right font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription?.invoices && subscription.invoices.length > 0 ? (
                      subscription.invoices.map((invoice: Invoice) => (
                        <tr key={invoice.id} className="border-b">
                          <td className="py-3 px-4">{invoice.invoice_number}</td>
                          <td className="py-3 px-4">{new Date(invoice.billing_date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">${invoice.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="flex items-center gap-1 text-sm"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          No invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;
