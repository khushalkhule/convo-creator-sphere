
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Sun, Moon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChatbotPreview } from '../dashboard/ChatbotPreview';

interface DesignStepProps {
  data: {
    name?: string;
    theme?: string;
    initial_message?: string;
    suggested_messages?: string[];
    display_name?: string;
    footer_links?: { text: string; url: string }[];
    user_message_color?: string;
    auto_open_delay?: number;
    input_placeholder?: string;
  };
  onChange: (data: any) => void;
}

export const DesignStep: React.FC<DesignStepProps> = ({ data, onChange }) => {
  const [newSuggestedMessage, setNewSuggestedMessage] = useState('');
  const [newFooterLink, setNewFooterLink] = useState({ text: '', url: '' });

  const handleThemeChange = (value: string) => {
    onChange({ theme: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: parseInt(value) });
  };

  const addSuggestedMessage = () => {
    if (!newSuggestedMessage) return;
    const updatedMessages = [...(data.suggested_messages || []), newSuggestedMessage];
    onChange({ suggested_messages: updatedMessages });
    setNewSuggestedMessage('');
  };

  const removeSuggestedMessage = (index: number) => {
    const updatedMessages = [...(data.suggested_messages || [])];
    updatedMessages.splice(index, 1);
    onChange({ suggested_messages: updatedMessages });
  };

  const addFooterLink = () => {
    if (!newFooterLink.text || !newFooterLink.url) return;
    const updatedLinks = [...(data.footer_links || []), newFooterLink];
    onChange({ footer_links: updatedLinks });
    setNewFooterLink({ text: '', url: '' });
  };

  const removeFooterLink = (index: number) => {
    const updatedLinks = [...(data.footer_links || [])];
    updatedLinks.splice(index, 1);
    onChange({ footer_links: updatedLinks });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Chatbot Design</h2>
        <p className="text-muted-foreground">Customize the appearance and behavior of your chatbot</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="display_name">Chatbot Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              value={data.display_name || ''}
              onChange={handleInputChange}
              placeholder="AI Assistant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input_placeholder">Input Placeholder</Label>
            <Input
              id="input_placeholder"
              name="input_placeholder"
              value={data.input_placeholder || ''}
              onChange={handleInputChange}
              placeholder="Type your message here..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial_message">Initial Message</Label>
            <Textarea
              id="initial_message"
              name="initial_message"
              value={data.initial_message || ''}
              onChange={handleInputChange}
              placeholder="Hi there! How can I help you today?"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This is the first message users will see when they open the chatbot
            </p>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup
              value={data.theme || 'light'}
              onValueChange={handleThemeChange}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="light" id="light" />
                <label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="dark" id="dark" />
                <label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_message_color">User Message Color</Label>
            <div className="flex gap-2">
              <Input
                id="user_message_color"
                name="user_message_color"
                type="color"
                value={data.user_message_color || '#0284c7'}
                onChange={handleInputChange}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={data.user_message_color || '#0284c7'}
                onChange={handleInputChange}
                name="user_message_color"
                placeholder="#0284c7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto_open_delay">Auto-open Delay (seconds)</Label>
            <Input
              id="auto_open_delay"
              name="auto_open_delay"
              type="number"
              min="0"
              max="60"
              value={data.auto_open_delay || 0}
              onChange={handleNumberInputChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Set to 0 to disable auto-open. Otherwise, the chatbot will open automatically after this many seconds.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Suggested Messages</Label>
            <p className="text-xs text-muted-foreground">
              These are quick options that users can click on instead of typing
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a suggested message"
                value={newSuggestedMessage}
                onChange={(e) => setNewSuggestedMessage(e.target.value)}
              />
              <Button type="button" onClick={addSuggestedMessage}>Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {(data.suggested_messages || []).map((message, index) => (
                <div key={index} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                  <span className="text-sm">{message}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeSuggestedMessage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Footer Links</Label>
            <p className="text-xs text-muted-foreground">
              Links displayed at the bottom of the chatbot (e.g., Privacy Policy, Terms of Service)
            </p>
            
            <Card className="p-4 space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Link Text"
                  value={newFooterLink.text}
                  onChange={(e) => setNewFooterLink({...newFooterLink, text: e.target.value})}
                />
                <Input
                  placeholder="URL"
                  value={newFooterLink.url}
                  onChange={(e) => setNewFooterLink({...newFooterLink, url: e.target.value})}
                />
              </div>
              <Button type="button" onClick={addFooterLink} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Footer Link
              </Button>
            </Card>
            
            {(data.footer_links || []).length > 0 && (
              <div className="space-y-2">
                {(data.footer_links || []).map((link, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{link.text}</span>
                      <span className="text-xs text-muted-foreground truncate">{link.url}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFooterLink(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Live Preview Column */}
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="sticky top-4">
            <h3 className="font-medium mb-3">Live Preview</h3>
            <ChatbotPreview 
              chatbot={{
                id: 'preview',
                name: data.name || 'Chatbot Preview',
                configuration: {
                  display_name: data.display_name,
                  theme: data.theme,
                  initial_message: data.initial_message,
                  suggested_messages: data.suggested_messages,
                  user_message_color: data.user_message_color,
                  input_placeholder: data.input_placeholder,
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
