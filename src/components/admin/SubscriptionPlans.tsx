
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface PlanFormData {
  id?: string;
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

const PlanCard: React.FC<{plan: Plan; onEdit: (plan: Plan) => void; onDelete: (id: string) => void}> = ({ plan, onEdit, onDelete }) => {
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
          <Button variant="outline" className="flex-1" onClick={() => onEdit(plan)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600" onClick={() => onDelete(plan.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlans = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [planFormData, setPlanFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    price: 0,
    interval: 'monthly',
    chatbot_limit: 1,
    api_calls_limit: 1000,
    storage_limit: 100,
    features: [],
    is_popular: false
  });
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Query for fetching plans
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

  // Mutation for creating/updating a plan
  const planMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      if (isEditMode && data.id) {
        return axios.put(`/api/subscription/plans/${data.id}`, data);
      } else {
        return axios.post('/api/subscription/plans', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success(isEditMode ? 'Plan updated successfully' : 'Plan created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Plan mutation error:', error);
      toast.error(isEditMode ? 'Failed to update plan' : 'Failed to create plan');
    }
  });

  // Mutation for deleting a plan
  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      return axios.delete(`/api/subscription/plans/${planId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success('Plan deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Plan deletion error:', error);
      toast.error('Failed to delete plan. Make sure no users are subscribed to this plan.');
    }
  });

  const handleCreatePlan = () => {
    setIsEditMode(false);
    setPlanFormData({
      name: "",
      description: "",
      price: 0,
      interval: 'monthly',
      chatbot_limit: 1,
      api_calls_limit: 1000,
      storage_limit: 100,
      features: [],
      is_popular: false
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setIsEditMode(true);
    setPlanFormData({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      interval: plan.interval,
      chatbot_limit: plan.chatbot_limit,
      api_calls_limit: plan.api_calls_limit,
      storage_limit: plan.storage_limit,
      features: plan.features,
      is_popular: plan.is_popular
    });
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePlan = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete);
    }
  };

  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    planMutation.mutate(planFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanFormData({
      ...planFormData,
      [name]: name === 'price' || name === 'chatbot_limit' || name === 'api_calls_limit' || name === 'storage_limit' 
        ? Number(value) 
        : value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setPlanFormData({
      ...planFormData,
      is_popular: checked
    });
  };

  const handleIntervalChange = (value: string) => {
    setPlanFormData({
      ...planFormData,
      interval: value as 'monthly' | 'yearly'
    });
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setPlanFormData({
        ...planFormData,
        features: [...planFormData.features, currentFeature.trim()]
      });
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setPlanFormData({
      ...planFormData,
      features: planFormData.features.filter((_, i) => i !== index)
    });
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
            <PlanCard key={plan.id} plan={plan} onEdit={handleEditPlan} onDelete={handleDeletePlan} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Yearly Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {yearlyPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} onEdit={handleEditPlan} onDelete={handleDeletePlan} />
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Plan</CardTitle>
          <p className="text-sm text-muted-foreground">Create a new subscription plan</p>
        </CardHeader>
        <CardContent>
          <Button 
            className="flex items-center gap-2" 
            onClick={handleCreatePlan}
          >
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </CardContent>
      </Card>

      {/* Plan Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Make changes to the subscription plan.' 
                : 'Create a new subscription plan to offer to your customers.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPlan}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={planFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input 
                      id="price" 
                      name="price"
                      type="number"
                      className="pl-7"
                      value={planFormData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={planFormData.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interval">Billing Interval</Label>
                  <Select 
                    value={planFormData.interval} 
                    onValueChange={handleIntervalChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_popular">Popular Plan</Label>
                  <div className="flex items-center pt-2">
                    <Switch 
                      id="is_popular"
                      checked={planFormData.is_popular}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span className="ml-2">Mark as popular</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chatbot_limit">Chatbot Limit</Label>
                  <Input 
                    id="chatbot_limit" 
                    name="chatbot_limit"
                    type="number"
                    value={planFormData.chatbot_limit}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Use 999 for unlimited</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_calls_limit">API Calls Limit</Label>
                  <Input 
                    id="api_calls_limit" 
                    name="api_calls_limit"
                    type="number"
                    value={planFormData.api_calls_limit}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Use 999999 for unlimited</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage_limit">Storage Limit (MB)</Label>
                  <Input 
                    id="storage_limit" 
                    name="storage_limit"
                    type="number"
                    value={planFormData.storage_limit}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Use 999999 for unlimited</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex">
                  <Input 
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="rounded-r-none"
                  />
                  <Button 
                    type="button"
                    onClick={addFeature}
                    className="rounded-l-none"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-3">
                  {planFormData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-2">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={planMutation.isPending}>
                {planMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Plan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plan? This action cannot be undone. 
              If users are subscribed to this plan, the deletion will fail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDeletePlan}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
