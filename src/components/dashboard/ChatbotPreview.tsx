
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, X, MessageSquare, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

interface ChatbotPreviewProps {
  chatbot: {
    id: string;
    name: string;
    configuration?: {
      display_name?: string;
      theme?: string;
      initial_message?: string;
      suggested_messages?: string[];
      user_message_color?: string;
      input_placeholder?: string;
    };
  };
  trigger?: React.ReactNode;
}

const defaultConfig = {
  display_name: 'AI Assistant',
  theme: 'light',
  initial_message: 'Hi there! How can I help you today?',
  suggested_messages: ['What services do you offer?', 'How does it work?', 'Pricing information'],
  user_message_color: '#0284c7',
  input_placeholder: 'Type your message here...'
};

export const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ chatbot, trigger }) => {
  const config = chatbot.configuration || defaultConfig;
  
  const isDarkTheme = config.theme === 'dark';
  
  const triggerElement = trigger || (
    <Button variant="outline" size="sm">
      <MessageSquare className="h-4 w-4 mr-2" />
      Preview
    </Button>
  );
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chatbot Preview: {chatbot.name}
          </DialogTitle>
        </DialogHeader>
        
        <Card className={`w-full border ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <CardHeader className={`pb-2 ${isDarkTheme ? 'bg-gray-800' : 'bg-primary/10'} rounded-t-lg`}>
            <CardTitle className="text-base flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <Bot className="h-4 w-4" />
              </Avatar>
              {config.display_name || defaultConfig.display_name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4 h-[300px] flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Bot message */}
              <div className="flex items-start gap-2">
                <Avatar className={`h-8 w-8 ${isDarkTheme ? 'bg-gray-700' : 'bg-primary/10'}`}>
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className={`rounded-lg p-3 max-w-[80%] ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {config.initial_message || defaultConfig.initial_message}
                </div>
              </div>
              
              {/* User message (example) */}
              <div className="flex items-start gap-2 justify-end">
                <div className="rounded-lg p-3 max-w-[80%] text-white" style={{ backgroundColor: config.user_message_color || defaultConfig.user_message_color }}>
                  I'm interested in your services
                </div>
                <Avatar className="h-8 w-8 bg-gray-300">
                  <span className="text-xs">You</span>
                </Avatar>
              </div>
            </div>
            
            {/* Suggested messages */}
            {(config.suggested_messages && config.suggested_messages.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {config.suggested_messages.map((msg, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${isDarkTheme ? 'border-gray-700 text-gray-300' : ''}`}
                  >
                    {msg}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Input area */}
            <div className="flex gap-2">
              <Input 
                placeholder={config.input_placeholder || defaultConfig.input_placeholder} 
                className={isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
              <Button size="icon" className={isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : ''}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
