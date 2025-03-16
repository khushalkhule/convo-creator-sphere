
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  MessageSquare, 
  PlusCircle, 
  Users,
  Bot,
  Loader2
} from 'lucide-react';
import { ChatbotCard } from '@/components/dashboard/ChatbotCard';
import { TeamMemberCard } from '@/components/dashboard/TeamMemberCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardChart } from '@/components/dashboard/DashboardChart';

interface DashboardStats {
  total_chatbots: number;
  total_conversations: number;
  total_leads: number;
  conversion_rate: number;
  conversation_trends: { day: string; count: number }[];
}

// API URL from environment variables or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chatbotsLoading, setChatbotsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total_chatbots: 0,
    total_conversations: 0,
    total_leads: 0,
    conversion_rate: 0,
    conversation_trends: []
  });
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch chatbots first
      try {
        setChatbotsLoading(true);
        const chatbotsResponse = await axios.get(`${API_URL}/chatbots`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Chatbots response:', chatbotsResponse.data);
        setChatbots(chatbotsResponse.data);
        setChatbotsLoading(false);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
        setChatbotsLoading(false);
        setError("Failed to load chatbots. Please try again later.");
      }
      
      // Then fetch analytics data
      try {
        setStatsLoading(true);
        const statsResponse = await axios.get(`${API_URL}/analytics/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setStats(statsResponse.data);
        setStatsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setStatsLoading(false);
        // We don't set the main error here because we still want to show chatbots
        // even if analytics fails
        toast({
          title: 'Analytics Error',
          description: 'Failed to load analytics data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const handleCreateChatbot = () => {
    navigate('/chatbots/new');
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your chatbots.</p>
          </div>
          <Button onClick={handleCreateChatbot} className="flex items-center gap-2">
            <PlusCircle size={16} />
            Create Chatbot
          </Button>
        </div>
        
        {error ? (
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Chatbots" 
                value={statsLoading ? '...' : stats.total_chatbots.toString()} 
                description="Manage your chatbots below" 
                icon={<Bot className="h-5 w-5 text-blue-500" />}
                loading={statsLoading}
              />
              
              <StatsCard 
                title="Total Conversations" 
                value={statsLoading ? '...' : stats.total_conversations.toString()} 
                description="Across all chatbots" 
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                loading={statsLoading}
              />
              
              <StatsCard 
                title="Leads Captured" 
                value={statsLoading ? '...' : stats.total_leads.toString()} 
                description="Across all chatbots" 
                icon={<Users className="h-5 w-5 text-purple-500" />}
                loading={statsLoading}
              />
            </div>
            
            <Tabs defaultValue="your-chatbots" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="your-chatbots">Your Chatbots</TabsTrigger>
                <TabsTrigger value="team-members">Team Members</TabsTrigger>
              </TabsList>
              
              <TabsContent value="your-chatbots">
                {chatbotsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chatbots && chatbots.length > 0 ? (
                      chatbots.map((chatbot: any) => (
                        <ChatbotCard 
                          key={chatbot.id}
                          id={chatbot.id}
                          name={chatbot.name}
                          description={chatbot.description || "No description provided"}
                          status={chatbot.status || "draft"}
                          conversationCount={chatbot.conversation_count || 0}
                          leadCount={chatbot.lead_count || 0}
                          onManage={() => navigate(`/chatbots/${chatbot.id}/edit`)}
                          onPreview={() => window.open(`/chatbots/${chatbot.id}/preview`, '_blank')}
                        />
                      ))
                    ) : null}
                    
                    <Card className="hover:shadow-md transition-shadow border-dashed border-2 flex flex-col items-center justify-center cursor-pointer h-[260px]" onClick={handleCreateChatbot}>
                      <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                        <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-center">Create New Chatbot</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="team-members">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TeamMemberCard 
                    name={user?.name || 'Your Name'}
                    email={user?.email || 'your.email@example.com'}
                    role="Owner"
                    avatarUrl=""
                  />
                  
                  <Card className="hover:shadow-md transition-shadow border-dashed border-2 flex flex-col items-center justify-center cursor-pointer h-[220px]" onClick={() => navigate('/team')}>
                    <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                      <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-center">Invite Team Member</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  Conversation Trends
                </CardTitle>
                <CardDescription>Daily conversation count over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {statsLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <DashboardChart data={stats.conversation_trends} />
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
