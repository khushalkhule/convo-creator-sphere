
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

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

const CheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Fetch plan details
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plan-detail', planId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/subscription/plans/${planId}`);
        return response.data;
      } catch (err) {
        console.error('Error fetching plan details:', err);
        toast.error('Failed to load subscription plan');
        throw err;
      }
    },
    enabled: !!planId
  });

  // Load Razorpay script when component mounts
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to continue with subscription');
      navigate('/login', { state: { returnUrl: `/checkout/${planId}` } });
    }
  }, [planId, isAuthenticated, navigate]);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is still loading. Please try again.');
      return;
    }

    try {
      setLoading(true);
      // Create order on the server
      const orderResponse = await axios.post('/api/subscription/create-order', {
        plan_id: planId
      });

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_G4xk6OLU6NVkQj', // Replace with your test key
        amount: orderResponse.data.amount,
        currency: 'INR',
        name: 'AiReply',
        description: `Subscription to ${plan.name} Plan`,
        order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            // Verify payment and activate subscription
            const verifyResponse = await axios.post('/api/subscription/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan_id: planId
            });

            toast.success('Payment successful! Your subscription is now active.');
            navigate('/subscription');
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !plan) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load subscription plan details</p>
              <Button variant="outline" onClick={() => navigate('/pricing')}>
                Return to Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-6">Complete your subscription to the {plan.name} plan</p>
        
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Plan</CardTitle>
                <CardDescription>You're subscribing to the {plan.name} plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{plan.name} ({plan.interval === 'monthly' ? 'Monthly' : 'Annual'})</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <p className="font-semibold">${plan.price}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Plan Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      <span>{plan.chatbot_limit === 999 ? 'Unlimited' : plan.chatbot_limit} Chatbots</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      <span>{plan.api_calls_limit === 999999 ? 'Unlimited' : plan.api_calls_limit.toLocaleString()} API Calls</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      <span>{plan.storage_limit >= 999999 ? 'Unlimited' : `${plan.storage_limit >= 1000 ? `${plan.storage_limit / 1000}GB` : `${plan.storage_limit}MB`}`} Storage</span>
                    </li>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${plan.price}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${plan.price}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.interval === 'monthly'
                    ? 'You will be billed monthly'
                    : 'You will be billed annually'}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={loading || !razorpayLoaded}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;
