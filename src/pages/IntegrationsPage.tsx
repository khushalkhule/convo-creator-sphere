import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Grid2X2, Instagram, Plug, Trash2, Zap } from "lucide-react";
import axios from 'axios';

interface Integration {
  id: string;
  type: string;
  name: string;
  status: string;
  config: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const IntegrationsPage = () => {
  const { toast } = useToast();
  const token = localStorage.getItem('token');
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [zapierActive, setZapierActive] = useState(false);
  const [instagramAccount, setInstagramAccount] = useState('');
  const [instagramDmAutomation, setInstagramDmAutomation] = useState(false);
  const [aiModel, setAiModel] = useState('gpt-4o-mini');
  const [hubspotApiKey, setHubspotApiKey] = useState('');
  const [hubspotActive, setHubspotActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: integrations, isLoading, refetch } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/integrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  if (integrations && integrations.length > 0) {
    integrations.forEach((integration: Integration) => {
      if (integration.type === 'zapier' && zapierWebhook === '') {
        setZapierWebhook(integration.config.webhook_url || '');
        setZapierActive(integration.status === 'active');
      } else if (integration.type === 'instagram' && instagramAccount === '') {
        setInstagramAccount(integration.config.business_account || '');
        setInstagramDmAutomation(integration.status === 'active');
        setAiModel(integration.config.ai_model || 'gpt-4o-mini');
      } else if (integration.type === 'hubspot' && hubspotApiKey === '') {
        setHubspotApiKey(integration.config.api_key || '');
        setHubspotActive(integration.status === 'active');
      }
    });
  }

  const handleSaveZapier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${API_URL}/api/integrations/zapier`, 
        { 
          webhook_url: zapierWebhook,
          active: zapierActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Integration Saved",
        description: "Your Zapier integration has been saved successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to save integration:', error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your Zapier integration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${API_URL}/api/integrations/instagram`, 
        { 
          business_account: instagramAccount,
          dm_automation: instagramDmAutomation,
          ai_model: aiModel
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Integration Saved",
        description: "Your Instagram integration has been saved successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to save integration:', error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your Instagram integration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveHubspot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${API_URL}/api/integrations/hubspot`, 
        { 
          api_key: hubspotApiKey,
          active: hubspotActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Integration Saved",
        description: "Your HubSpot integration has been saved successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to save integration:', error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your HubSpot integration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIntegration = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the ${name} integration?`)) return;
    
    try {
      await axios.delete(`${API_URL}/api/integrations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast({
        title: "Integration Deleted",
        description: `The ${name} integration has been deleted successfully.`
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to delete integration:', error);
      toast({
        title: "Failed to Delete",
        description: `There was an error deleting the ${name} integration. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect your chatbots with other services.</p>
        </div>

        <Tabs defaultValue="zapier" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="zapier" className="flex items-center gap-2">
              <Zap size={16} />
              <span>Zapier</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram size={16} />
              <span>Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="hubspot" className="flex items-center gap-2">
              <Grid2X2 size={16} />
              <span>HubSpot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="zapier" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>
                  Connect your chatbots with Zapier to automate workflows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveZapier}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook_url">Webhook URL</Label>
                      <Input
                        id="webhook_url"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        value={zapierWebhook}
                        onChange={(e) => setZapierWebhook(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter your Zapier webhook URL to receive data from your chatbots.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="zapier-active"
                        checked={zapierActive}
                        onCheckedChange={setZapierActive}
                      />
                      <Label htmlFor="zapier-active">Enable Integration</Label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      Save Configuration
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    zapierActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  {zapierActive ? 'Integration is active' : 'Integration is inactive'}
                </div>
                {integrations?.some((int: Integration) => int.type === 'zapier') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      const integration = integrations.find((int: Integration) => int.type === 'zapier');
                      if (integration) handleDeleteIntegration(integration.id, 'Zapier');
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Instagram Integration
                </CardTitle>
                <CardDescription>
                  Automate your Instagram DMs with AI responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveInstagram}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_account">Business Account Username</Label>
                      <Input
                        id="business_account"
                        placeholder="@yourbusiness"
                        value={instagramAccount}
                        onChange={(e) => setInstagramAccount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ai_model">AI Model for Responses</Label>
                      <select
                        id="ai_model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                      >
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dm-automation"
                        checked={instagramDmAutomation}
                        onCheckedChange={setInstagramDmAutomation}
                      />
                      <Label htmlFor="dm-automation">Enable DM Automation</Label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      Save Configuration
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    instagramDmAutomation ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  {instagramDmAutomation ? 'DM Automation is active' : 'DM Automation is inactive'}
                </div>
                {integrations?.some((int: Integration) => int.type === 'instagram') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      const integration = integrations.find((int: Integration) => int.type === 'instagram');
                      if (integration) handleDeleteIntegration(integration.id, 'Instagram');
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="hubspot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid2X2 className="h-5 w-5" />
                  HubSpot Integration
                </CardTitle>
                <CardDescription>
                  Sync leads from your chatbots to HubSpot CRM.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveHubspot}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api_key">HubSpot API Key</Label>
                      <Input
                        id="api_key"
                        type="password"
                        placeholder="Enter your HubSpot API key"
                        value={hubspotApiKey}
                        onChange={(e) => setHubspotApiKey(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Your API key is stored securely and never shared.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hubspot-active"
                        checked={hubspotActive}
                        onCheckedChange={setHubspotActive}
                      />
                      <Label htmlFor="hubspot-active">Enable Integration</Label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      Save Configuration
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    hubspotActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  {hubspotActive ? 'Integration is active' : 'Integration is inactive'}
                </div>
                {integrations?.some((int: Integration) => int.type === 'hubspot') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      const integration = integrations.find((int: Integration) => int.type === 'hubspot');
                      if (integration) handleDeleteIntegration(integration.id, 'HubSpot');
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              Available Integrations
            </CardTitle>
            <CardDescription>
              Discover more ways to connect your chatbots with other services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex items-center gap-4">
                <div className="bg-gray-100 p-2 rounded-md">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 8L4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 16L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Slack</h3>
                  <p className="text-sm text-muted-foreground">Receive chat notifications</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Coming soon
                </Button>
              </div>
              <div className="border rounded-lg p-4 flex items-center gap-4">
                <div className="bg-gray-100 p-2 rounded-md">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93005 19.07L9.00005 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.63 14.63L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 7L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 9L20.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Salesforce</h3>
                  <p className="text-sm text-muted-foreground">Sync contacts and leads</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Coming soon
                </Button>
              </div>
              <div className="border rounded-lg p-4 flex items-center gap-4">
                <div className="bg-gray-100 p-2 rounded-md">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Mailchimp</h3>
                  <p className="text-sm text-muted-foreground">Add leads to email lists</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Coming soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
