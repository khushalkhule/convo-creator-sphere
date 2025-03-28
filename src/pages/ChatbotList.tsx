
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Settings, Trash2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ChatbotCard } from '@/components/dashboard/ChatbotCard';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  conversation_count: number;
  lead_count: number;
  configuration?: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatbotList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch chatbots
  const { data: chatbots, isLoading, error, refetch } = useQuery({
    queryKey: ['chatbots'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/chatbots`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  const handleDeleteChatbot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return;
    
    try {
      await axios.delete(`${API_URL}/chatbots/${id}`, {
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
    navigate(`/chatbots/${id}/wizard`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Chatbots</h1>
            <p className="text-muted-foreground">Manage and monitor all your chatbots</p>
          </div>
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
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Chatbots</h2>
            <p className="text-red-600">Failed to load your chatbots. Please try again later.</p>
            <Button onClick={() => refetch()} className="mt-4" variant="outline">Retry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots && chatbots.length > 0 ? (
              chatbots.map((chatbot: Chatbot) => (
                <ChatbotCard
                  key={chatbot.id}
                  id={chatbot.id}
                  name={chatbot.name}
                  description={chatbot.description || "No description"}
                  status={chatbot.status as 'active' | 'draft' | 'paused'}
                  conversationCount={chatbot.conversation_count || 0}
                  leadCount={chatbot.lead_count || 0}
                  onManage={() => handleEditChatbot(chatbot.id)}
                  configuration={chatbot.configuration}
                />
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
    </DashboardLayout>
  );
};

export default ChatbotList;
