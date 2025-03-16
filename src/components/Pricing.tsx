
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WavesPattern } from "@/assets/patterns";
import { useIntersectionObserver } from "@/utils/animations";
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
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
}

const Pricing = () => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();
  
  // Fetch plans from the database
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['subscription-plans-public'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/subscription/plans');
        return response.data;
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        toast.error('Failed to load subscription plans');
        return [];
      }
    }
  });

  const handleSubscribe = (planId: string) => {
    navigate(`/checkout/${planId}`);
  };
  
  // Filter plans by interval
  const monthlyPlans = plans ? plans.filter(plan => plan.interval === 'monthly') : [];
  const yearlyPlans = plans ? plans.filter(plan => plan.interval === 'yearly') : [];
  const currentPlans = annual ? yearlyPlans : monthlyPlans;
  
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <WavesPattern />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 transition-opacity duration-1000 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="inline-block mb-4">
            <span className="chip bg-blue-100 text-blue-800 border border-blue-200">
              Pricing
            </span>
          </div>
          
          <h2 className="heading-lg mb-6">Simple, Transparent Pricing</h2>
          
          <p className="subheading mb-8">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
          
          <div className="flex items-center justify-center">
            <div className="bg-secondary rounded-full p-1 inline-flex">
              <button 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  !annual ? "bg-white shadow text-blue-600" : "text-gray-600"
                )}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  annual ? "bg-white shadow text-blue-600" : "text-gray-600"
                )}
                onClick={() => setAnnual(true)}
              >
                Annual <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Failed to load subscription plans</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <div 
                key={plan.id}
                className={cn(
                  "flex flex-col glass border rounded-xl transition-all duration-500 overflow-hidden",
                  plan.is_popular ? "shadow-xl ring-2 ring-blue-500" : "shadow-lg hover:shadow-xl",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${(index % 3) * 150 + 400}ms` }}
              >
                {plan.is_popular && (
                  <div className="bg-blue-600 text-white text-center py-1.5 text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={cn("p-6 flex-grow", plan.is_popular ? "pt-4" : "")}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <Button 
                    className={cn(
                      "w-full mb-6 transition-all duration-300",
                      plan.is_popular 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Enterprise Solutions</h3>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-6">
            Need a custom solution for your large business or special requirements?
            We offer tailored plans with custom features, dedicated support, and SLA guarantees.
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 transition-all duration-300 button-hover"
            onClick={() => navigate('/contact')}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
