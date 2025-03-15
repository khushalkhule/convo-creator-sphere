import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Settings, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  conversation_count: number;
  lead_count: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatbotList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isNewChatbotOpen, setIsNewChatbotOpen] = useState(false);
  const [newChatbot, setNewChatbot] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch chatbots
  const { data: chatbots, isLoading, error, refetch } = useQuery({
    queryKey: ['chatbots'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/chatbots`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  const handleCreateChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${API_URL}/api/chatbots`, 
        newChatbot,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Chatbot created",
        description: "Your new chatbot has been created successfully."
      });
      
      setNewChatbot({ name: '', description: '' });
      setIsNewChatbotOpen(false);
      navigate('/chatbots/new');
    } catch (error) {
      console.error('Failed to create chatbot:', error);
      toast({
        title: "Failed to create chatbot",
        description: "There was an error creating your chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return;
    
    try {
      await axios.delete(`${API_URL}/api/chatbots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast({
        title: "Chatbot deleted",
        description: "The chatbot has been deleted successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to delete chatbot:', error);
      toast({
        title: "Failed to delete chatbot",
        description: "There was an error deleting the chatbot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditChatbot = (id: string) => {
    navigate(`/chatbots/${id}/edit`);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Chatbots</h2>
          <p className="text-red-600">Failed to load your chatbots. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4" variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Chatbots</h1>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => navigate('/chatbots/new')}
        >
          <Plus size={16} /> Create New Chatbot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots && chatbots.length > 0 ? (
            chatbots.map((chatbot: Chatbot) => (
              <Card key={chatbot.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{chatbot.name}</CardTitle>
                  <CardDescription>{chatbot.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          chatbot.status === 'active' ? 'bg-green-100 text-green-800' : 
                          chatbot.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {chatbot.status}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversations:</span>
                      <span className="font-medium">{chatbot.conversation_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Leads:</span>
                      <span className="font-medium">{chatbot.lead_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(chatbot.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEditChatbot(chatbot.id)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" 
                    onClick={() => handleDeleteChatbot(chatbot.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full p-8 border rounded-lg text-center bg-muted/50">
              <h3 className="text-xl font-semibold mb-2">No chatbots yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI chatbot to start engaging with your website visitors.
              </p>
              <Button onClick={() => navigate('/chatbots/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Chatbot
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotList;
