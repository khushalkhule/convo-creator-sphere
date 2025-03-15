
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SummaryStepProps {
  data: {
    name?: string;
    description?: string;
    website_url?: string;
    team?: string;
    knowledge_base?: {
      type: string;
      content: string;
      urls?: string[];
      files?: string[];
    };
    ai_model?: string;
    temperature?: number;
    max_tokens?: number;
    theme?: string;
    initial_message?: string;
    suggested_messages?: string[];
    display_name?: string;
    lead_form_enabled?: boolean;
    lead_form_title?: string;
    lead_form_fields?: any[];
    [key: string]: any;
  };
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  // Helper function to check if a section is complete
  const isSectionComplete = (section: string): boolean => {
    switch(section) {
      case 'basic':
        return !!data.name && !!data.description;
      case 'knowledge':
        if (data.knowledge_base?.type === 'text') {
          return !!data.knowledge_base?.content;
        } else if (data.knowledge_base?.type === 'urls') {
          return !!(data.knowledge_base?.urls && data.knowledge_base.urls.length > 0);
        } else if (data.knowledge_base?.type === 'files') {
          return !!(data.knowledge_base?.files && data.knowledge_base.files.length > 0);
        }
        return false;
      case 'ai':
        return !!data.ai_model;
      case 'design':
        return !!data.theme && !!data.initial_message && !!data.display_name;
      case 'lead':
        if (!data.lead_form_enabled) return true;
        return !!data.lead_form_title && !!(data.lead_form_fields && data.lead_form_fields.length > 0);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Summary</h2>
        <p className="text-muted-foreground">Review your chatbot configuration before finalizing</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Name, description, and website</p>
            </div>
            <div>
              {isSectionComplete('basic') ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Incomplete</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="col-span-2 font-medium">{data.name || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Description:</span>
              <span className="col-span-2">{data.description || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Website:</span>
              <span className="col-span-2">{data.website_url || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Team:</span>
              <span className="col-span-2">{data.team || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Knowledge Base</h3>
              <p className="text-sm text-muted-foreground">Information sources for your chatbot</p>
            </div>
            <div>
              {isSectionComplete('knowledge') ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Incomplete</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="col-span-2 capitalize">{data.knowledge_base?.type || 'Not set'}</span>
            </div>
            
            {data.knowledge_base?.type === 'text' && (
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground">Content:</span>
                <span className="col-span-2">
                  {data.knowledge_base?.content ? 
                    `${data.knowledge_base.content.substring(0, 100)}${data.knowledge_base.content.length > 100 ? '...' : ''}` : 
                    'Not set'}
                </span>
              </div>
            )}
            
            {data.knowledge_base?.type === 'urls' && (
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground">URLs:</span>
                <span className="col-span-2">
                  {data.knowledge_base?.urls && data.knowledge_base.urls.length > 0 ? 
                    `${data.knowledge_base.urls.length} URLs added` : 
                    'No URLs added'}
                </span>
              </div>
            )}
            
            {data.knowledge_base?.type === 'files' && (
              <div className="grid grid-cols-3 text-sm">
                <span className="text-muted-foreground">Files:</span>
                <span className="col-span-2">
                  {data.knowledge_base?.files && data.knowledge_base.files.length > 0 ? 
                    `${data.knowledge_base.files.length} files uploaded` : 
                    'No files uploaded'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">AI Model</h3>
              <p className="text-sm text-muted-foreground">Model and its configuration</p>
            </div>
            <div>
              {isSectionComplete('ai') ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Incomplete</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="col-span-2 font-medium">{data.ai_model || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="col-span-2">{data.temperature || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Max Tokens:</span>
              <span className="col-span-2">{data.max_tokens || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Design</h3>
              <p className="text-sm text-muted-foreground">Appearance and behavior</p>
            </div>
            <div>
              {isSectionComplete('design') ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Incomplete</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Theme:</span>
              <span className="col-span-2 capitalize">{data.theme || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Display Name:</span>
              <span className="col-span-2">{data.display_name || 'Not set'}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Initial Message:</span>
              <span className="col-span-2">
                {data.initial_message ? 
                  `${data.initial_message.substring(0, 50)}${data.initial_message.length > 50 ? '...' : ''}` : 
                  'Not set'}
              </span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Suggested Messages:</span>
              <span className="col-span-2">
                {data.suggested_messages && data.suggested_messages.length > 0 ? 
                  `${data.suggested_messages.length} messages added` : 
                  'None added'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Lead Generation</h3>
              <p className="text-sm text-muted-foreground">Lead capture form configuration</p>
            </div>
            <div>
              {isSectionComplete('lead') ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Incomplete</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid gap-2">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground">Enabled:</span>
              <span className="col-span-2">{data.lead_form_enabled ? 'Yes' : 'No'}</span>
            </div>
            
            {data.lead_form_enabled && (
              <>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-muted-foreground">Form Title:</span>
                  <span className="col-span-2">{data.lead_form_title || 'Not set'}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-muted-foreground">Fields:</span>
                  <span className="col-span-2">
                    {data.lead_form_fields && data.lead_form_fields.length > 0 ? 
                      `${data.lead_form_fields.length} fields configured` : 
                      'No fields added'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
