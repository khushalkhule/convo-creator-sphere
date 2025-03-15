
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, Bot } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: string;
  configuration: any;
  created_at: string;
}

const ChatbotEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatbotData, setChatbotData] = useState<Partial<Chatbot>>({
    name: '',
    description: '',
    status: 'draft',
    configuration: {
      primaryColor: '#0070f3',
      initialMessage: 'Hi there! How can I help you today?',
      position: 'right',
      suggestedQuestions: []
    }
  });

  const token = localStorage.getItem('token');

  // Fetch chatbot data
  const { data: chatbot, isLoading, error } = useQuery({
    queryKey: ['chatbot', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`${API_URL}/api/chatbots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (chatbot) {
      setChatbotData(chatbot);
    }
  }, [chatbot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChatbotData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (key: string, value: any) => {
    setChatbotData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!id) throw new Error('No chatbot ID provided');

      await axios.put(
        `${API_URL}/api/chatbots/${id}`,
        chatbotData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Chatbot updated",
        description: "Your chatbot has been updated successfully."
      });
    } catch (error) {
      console.error('Failed to update chatbot:', error);
      toast({
        title: "Failed to update chatbot",
        description: "There was an error updating your chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Chatbot</h2>
          <p className="text-red-600">Failed to load the chatbot data. Please try again later.</p>
          <Button onClick={() => navigate('/chatbots')} className="mt-4" variant="outline">
            Back to Chatbots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/chatbots')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chatbots
        </Button>
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Edit Chatbot</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  The core details about your chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={chatbotData.name}
                    onChange={handleChange}
                    placeholder="My Awesome Chatbot"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={chatbotData.description}
                    onChange={handleChange}
                    placeholder="This chatbot helps customers with product information."
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={chatbotData.status} 
                    onValueChange={(value) => setChatbotData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how your chatbot looks on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={chatbotData.configuration?.primaryColor || '#0070f3'}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={chatbotData.configuration?.primaryColor || '#0070f3'}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="position">Chat Widget Position</Label>
                  <Select 
                    value={chatbotData.configuration?.position || 'right'} 
                    onValueChange={(value) => handleConfigChange('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Bottom Left</SelectItem>
                      <SelectItem value="right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Behavior</CardTitle>
                <CardDescription>
                  Configure how your chatbot interacts with users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="initialMessage">Initial Message</Label>
                  <Textarea
                    id="initialMessage"
                    value={chatbotData.configuration?.initialMessage || ''}
                    onChange={(e) => handleConfigChange('initialMessage', e.target.value)}
                    placeholder="Hi there! How can I help you today?"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Suggested Questions</Label>
                  <div className="space-y-2">
                    {(chatbotData.configuration?.suggestedQuestions || []).map((question: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={question}
                          onChange={(e) => {
                            const newQuestions = [...(chatbotData.configuration?.suggestedQuestions || [])];
                            newQuestions[index] = e.target.value;
                            handleConfigChange('suggestedQuestions', newQuestions);
                          }}
                          placeholder="E.g., What services do you offer?"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            const newQuestions = [...(chatbotData.configuration?.suggestedQuestions || [])];
                            newQuestions.splice(index, 1);
                            handleConfigChange('suggestedQuestions', newQuestions);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        const currentQuestions = [...(chatbotData.configuration?.suggestedQuestions || [])];
                        handleConfigChange('suggestedQuestions', [...currentQuestions, '']);
                      }}
                    >
                      Add Suggested Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            className="mr-2"
            onClick={() => navigate('/chatbots')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotEdit;
