
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoStepProps {
  data: {
    name?: string;
    description?: string;
    website_url?: string;
    team?: string;
  };
  onChange: (data: any) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">Provide basic details about your chatbot</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chatbot Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={data.name || ''}
              onChange={handleChange}
              placeholder="E.g., Sales Assistant, Support Bot"
              required
              className={!data.name ? "border-red-300 focus:border-red-500" : ""}
            />
            {!data.name && <p className="text-sm text-red-500">Name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={data.description || ''}
              onChange={handleChange}
              placeholder="Briefly describe what your chatbot will do"
              rows={3}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              value={data.website_url || ''}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team/Department</Label>
            <Input
              id="team"
              name="team"
              value={data.team || ''}
              onChange={handleChange}
              placeholder="E.g., Marketing, Support, Sales"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
