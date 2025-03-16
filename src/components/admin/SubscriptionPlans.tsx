
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface PlanFeature {
  feature: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  chatbot_limit: number;
  api_calls_limit: number;
  storage_limit: number;
  features: string[];
  is_popular: boolean;
}

const PlanCard: React.FC<{plan: Plan}> = ({ plan }) => {
  const handleEditPlan = () => {
    toast.info(`Edit plan feature will be implemented for plan: ${plan.name}`);
  };

  const handleDeletePlan = () => {
    toast.info(`Delete plan feature will be implemented for plan: ${plan.name}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{plan.name} {plan.is_popular && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">Popular</span>}</CardTitle>
        {plan.price === 0 ? (
          <div className="text-2xl font-bold">Free</div>
        ) : (
          <div className="text-2xl font-bold">
            ${plan.price}<span className="text-sm font-normal text-muted-foreground">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chatbots
            </span>
            <span className="text-sm font-medium">{plan.chatbot_limit === 999 ? 'Unlimited' : plan.chatbot_limit}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
              </svg>
              API Calls
            </span>
            <span className="text-sm font-medium">{plan.api_calls_limit === 999999 ? 'Unlimited' : plan.api_calls_limit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Storage
            </span>
            <span className="text-sm font-medium">{plan.storage_limit >= 999999 ? 'Unlimited' : `${plan.storage_limit >= 1000 ? `${plan.storage_limit / 1000}GB` : `${plan.storage_limit}MB`}`}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleEditPlan}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600" onClick={handleDeletePlan}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlans = () => {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['subscription-plans'],
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

  const handleCreatePlan = () => {
    toast.info('Create new plan feature will be implemented here');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">Failed to load subscription plans</h3>
          <p className="text-muted-foreground mb-4">Please check your connection and try again</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Filter plans by interval
  const monthlyPlans = plans ? plans.filter(plan => plan.interval === 'monthly') : [];
  const yearlyPlans = plans ? plans.filter(plan => plan.interval === 'yearly') : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Monthly Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {monthlyPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Yearly Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {yearlyPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Plan</CardTitle>
          <p className="text-sm text-muted-foreground">Create a new subscription plan</p>
        </CardHeader>
        <CardContent>
          <Button className="flex items-center gap-2" onClick={handleCreatePlan}>
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
