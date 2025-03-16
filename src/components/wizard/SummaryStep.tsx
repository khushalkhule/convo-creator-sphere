
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatbotPreview } from '../dashboard/ChatbotPreview';

interface SummaryStepProps {
  data: any;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Summary</h2>
        <p className="text-muted-foreground">Review your chatbot configuration before finalizing</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Name</div>
                <div>{data.name || '(Not provided)'}</div>
              </div>
              
              {data.description && (
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div>{data.description}</div>
                </div>
              )}
              
              {data.website_url && (
                <div>
                  <div className="text-sm font-medium">Website URL</div>
                  <div>{data.website_url}</div>
                </div>
              )}
              
              {data.team && (
                <div>
                  <div className="text-sm font-medium">Team</div>
                  <div>{data.team}</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Knowledge Base */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.knowledge_base ? (
                <>
                  <div>
                    <div className="text-sm font-medium">Source Type</div>
                    <div>{data.knowledge_base.type || 'Direct Text'}</div>
                  </div>
                  
                  {data.knowledge_base.content && (
                    <div>
                      <div className="text-sm font-medium">Content</div>
                      <div className="max-h-32 overflow-y-auto border p-2 rounded-md text-sm">
                        {data.knowledge_base.content.substring(0, 500)}
                        {data.knowledge_base.content.length > 500 && '...'}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground italic">No knowledge base provided</div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Model */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI Model Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Model</div>
                <div>{data.ai_model || 'gpt-4o-mini'}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Temperature</div>
                <div>{data.temperature || 0.7}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Max Tokens</div>
                <div>{data.max_tokens || 2000}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Lead Form */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Lead Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Enabled</div>
                <div className="flex items-center">
                  {data.lead_form_enabled ? (
                    <Check className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  {data.lead_form_enabled ? 'Yes' : 'No'}
                </div>
              </div>
              
              {data.lead_form_enabled && (
                <>
                  <div>
                    <div className="text-sm font-medium">Title</div>
                    <div>{data.lead_form_title || 'Get in Touch'}</div>
                  </div>
                  
                  {data.lead_form_description && (
                    <div>
                      <div className="text-sm font-medium">Description</div>
                      <div>{data.lead_form_description}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm font-medium">Fields</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(data.lead_form_fields || []).length > 0 ? (
                        data.lead_form_fields.map((field: any, index: number) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">No fields defined</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Live Preview Column */}
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="sticky top-4 space-y-4">
            <h3 className="font-medium">Chatbot Preview</h3>
            <ChatbotPreview 
              chatbot={{
                id: data.id || 'preview',
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
            <div className="mt-4">
              <h3 className="font-medium mb-2">Design Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Theme:</span>
                  <span>{data.theme || 'Light'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Display Name:</span>
                  <span>{data.display_name || 'AI Assistant'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Auto-open Delay:</span>
                  <span>{data.auto_open_delay || 0} seconds</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Suggested Messages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(data.suggested_messages || []).length > 0 ? (
                      data.suggested_messages.map((msg: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {msg}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
