
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Bot, Loader2 } from 'lucide-react';
import { BasicInfoStep } from '@/components/wizard/BasicInfoStep';
import { KnowledgeBaseStep } from '@/components/wizard/KnowledgeBaseStep';
import { AIModelStep } from '@/components/wizard/AIModelStep';
import { DesignStep } from '@/components/wizard/DesignStep';
import { LeadFormStep } from '@/components/wizard/LeadFormStep';
import { SummaryStep } from '@/components/wizard/SummaryStep';
import { WizardStepper } from '@/components/wizard/WizardStepper';

interface Step {
  id: number;
  name: string;
  completed: boolean;
  current: boolean;
}

interface ChatbotData {
  id?: string;
  name?: string;
  description?: string;
  website_url?: string;
  team?: string;
  knowledge_base?: any;
  ai_model?: string;
  temperature?: number;
  max_tokens?: number;
  theme?: string;
  initial_message?: string;
  suggested_messages?: string[];
  display_name?: string;
  footer_links?: any;
  user_message_color?: string;
  auto_open_delay?: number;
  input_placeholder?: string;
  lead_form_enabled?: boolean;
  lead_form_title?: string;
  lead_form_description?: string;
  lead_form_success_message?: string;
  lead_form_fields?: any[];
  summary?: any;
}

// Use an environment variable or a direct backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatbotWizard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: 'Basic Info', completed: false, current: true },
    { id: 2, name: 'Knowledge Base', completed: false, current: false },
    { id: 3, name: 'AI Model', completed: false, current: false },
    { id: 4, name: 'Design', completed: false, current: false },
    { id: 5, name: 'Lead Form', completed: false, current: false },
    { id: 6, name: 'Summary', completed: false, current: false },
  ]);
  
  const [chatbotData, setChatbotData] = useState<ChatbotData>({
    name: '',
    description: '',
    website_url: '',
    team: '',
    knowledge_base: { type: 'text', content: '' },
    ai_model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 2000,
    theme: 'light',
    initial_message: 'Hi there! How can I help you today?',
    suggested_messages: ['What services do you offer?', 'How does it work?', 'Pricing information'],
    display_name: 'AI Assistant',
    footer_links: [
      { text: "Privacy Policy", url: "/privacy" },
      { text: "Terms", url: "/terms" }
    ],
    user_message_color: '#0284c7',
    auto_open_delay: 5,
    input_placeholder: 'Type your message here...',
    lead_form_enabled: true,
    lead_form_title: 'Get in Touch',
    lead_form_description: 'Please fill out this form and we\'ll get back to you shortly.',
    lead_form_success_message: 'Thanks for reaching out! We\'ll be in touch soon.',
    lead_form_fields: [
      { label: 'Full Name', field_name: 'name', type: 'text', required: true },
      { label: 'Email Address', field_name: 'email', type: 'email', required: true },
      { label: 'Phone Number', field_name: 'phone', type: 'phone', required: false }
    ]
  });
  
  useEffect(() => {
    // If we have an ID, we're editing an existing chatbot
    if (id) {
      fetchChatbotData();
    }
    
    // Fetch wizard steps
    fetchWizardSteps();
  }, [id]);
  
  const fetchWizardSteps = async () => {
    try {
      const response = await axios.get(`${API_URL}/wizard/steps`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSteps(response.data);
    } catch (error) {
      console.error('Error fetching wizard steps:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wizard steps. Please check your connection.',
        variant: 'destructive'
      });
    }
  };
  
  const fetchChatbotData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/chatbots/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setChatbotData({
        ...chatbotData,
        ...response.data
      });
    } catch (error) {
      console.error('Error fetching chatbot data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chatbot data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNext = async () => {
    setLoading(true);
    
    try {
      // Validate current step data
      if (currentStep === 1 && !chatbotData.name) {
        toast({
          title: 'Missing Information',
          description: 'Please provide a name for your chatbot.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }
      
      // Submit current step data
      let response;
      
      switch (currentStep) {
        case 1:
          // Basic Info
          console.log('Submitting basic info:', {
            name: chatbotData.name,
            description: chatbotData.description,
            website_url: chatbotData.website_url,
            team: chatbotData.team
          });
          
          if (id) {
            // Update existing chatbot
            response = await axios.put(
              `${API_URL}/chatbots/${id}`,
              {
                name: chatbotData.name,
                description: chatbotData.description,
                website_url: chatbotData.website_url,
                team: chatbotData.team
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
          } else {
            // Create new chatbot
            try {
              response = await axios.post(
                `${API_URL}/wizard/basic-info`,
                {
                  name: chatbotData.name,
                  description: chatbotData.description,
                  website_url: chatbotData.website_url,
                  team: chatbotData.team
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              
              console.log('Basic info response:', response.data);
              
              // Update chatbot ID in state
              setChatbotData({
                ...chatbotData,
                id: response.data.id
              });
            } catch (error) {
              console.error('Error saving basic info:', error);
              const errorMessage = error.response?.data?.message || 'Failed to save basic information';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
              });
              setLoading(false);
              return;
            }
          }
          break;
          
        case 2:
          // Knowledge Base
          if (!chatbotData.id) {
            toast({
              title: 'Error',
              description: 'Missing chatbot ID. Please try again.',
              variant: 'destructive'
            });
            setLoading(false);
            return;
          }
          
          try {
            response = await axios.put(
              `${API_URL}/wizard/${chatbotData.id}/knowledge-base`,
              {
                knowledge_base: chatbotData.knowledge_base
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            console.log('Knowledge base response:', response.data);
          } catch (error) {
            console.error('Error saving knowledge base:', error);
            toast({
              title: 'Error',
              description: 'Failed to save knowledge base. Please try again.',
              variant: 'destructive'
            });
            setLoading(false);
            return;
          }
          break;
          
        case 3:
          // AI Model
          response = await axios.put(
            `${API_URL}/wizard/${chatbotData.id}/ai-model`,
            {
              ai_model: chatbotData.ai_model,
              temperature: chatbotData.temperature,
              max_tokens: chatbotData.max_tokens
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          break;
          
        case 4:
          // Design
          response = await axios.put(
            `${API_URL}/wizard/${chatbotData.id}/design`,
            {
              theme: chatbotData.theme,
              initial_message: chatbotData.initial_message,
              suggested_messages: chatbotData.suggested_messages,
              display_name: chatbotData.display_name,
              footer_links: chatbotData.footer_links,
              user_message_color: chatbotData.user_message_color,
              auto_open_delay: chatbotData.auto_open_delay,
              input_placeholder: chatbotData.input_placeholder
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          break;
          
        case 5:
          // Lead Form
          response = await axios.put(
            `${API_URL}/wizard/${chatbotData.id}/lead-form`,
            {
              lead_form_enabled: chatbotData.lead_form_enabled,
              lead_form_title: chatbotData.lead_form_title,
              lead_form_description: chatbotData.lead_form_description,
              lead_form_success_message: chatbotData.lead_form_success_message,
              lead_form_fields: chatbotData.lead_form_fields
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          break;
          
        case 6:
          // Summary - finalize chatbot
          response = await axios.put(
            `${API_URL}/wizard/${chatbotData.id}/finalize`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          toast({
            title: 'Success',
            description: 'Chatbot created successfully!',
            duration: 3000
          });
          
          navigate('/dashboard');
          return;
      }
      
      // Mark current step as completed
      const updatedSteps = steps.map(step => {
        if (step.id === currentStep) {
          return { ...step, completed: true, current: false };
        } else if (step.id === currentStep + 1) {
          return { ...step, current: true };
        }
        return step;
      });
      
      setSteps(updatedSteps);
      setCurrentStep(prev => prev + 1);
      
    } catch (error) {
      console.error(`Error saving step ${currentStep}:`, error);
      let errorMessage = `Failed to save step ${currentStep}. Please try again.`;
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/dashboard');
      return;
    }
    
    // Update steps
    const updatedSteps = steps.map(step => {
      if (step.id === currentStep) {
        return { ...step, current: false };
      } else if (step.id === currentStep - 1) {
        return { ...step, current: true, completed: false };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    setCurrentStep(prev => prev - 1);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            data={chatbotData}
            onChange={(data) => setChatbotData({...chatbotData, ...data})}
          />
        );
      case 2:
        return (
          <KnowledgeBaseStep 
            data={chatbotData}
            onChange={(data) => setChatbotData({...chatbotData, ...data})}
          />
        );
      case 3:
        return (
          <AIModelStep 
            data={chatbotData}
            onChange={(data) => setChatbotData({...chatbotData, ...data})}
          />
        );
      case 4:
        return (
          <DesignStep 
            data={chatbotData}
            onChange={(data) => setChatbotData({...chatbotData, ...data})}
          />
        );
      case 5:
        return (
          <LeadFormStep 
            data={chatbotData}
            onChange={(data) => setChatbotData({...chatbotData, ...data})}
          />
        );
      case 6:
        return (
          <SummaryStep 
            data={chatbotData}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{id ? 'Edit Chatbot' : 'Create New Chatbot'}</h1>
            <p className="text-muted-foreground">Follow the steps below to configure your AI chatbot.</p>
          </div>
        </div>
        
        <WizardStepper steps={steps} currentStep={currentStep} />
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          {renderStep()}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : currentStep === 6 ? (
              <>
                <Check className="h-4 w-4" />
                Create Chatbot
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatbotWizard;
