
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIModelStepProps {
  data: {
    ai_model?: string;
    temperature?: number;
    max_tokens?: number;
  };
  onChange: (data: any) => void;
}

export const AIModelStep: React.FC<AIModelStepProps> = ({ data, onChange }) => {
  const handleModelChange = (value: string) => {
    onChange({ ai_model: value });
  };

  const handleTemperatureChange = (value: number[]) => {
    onChange({ temperature: value[0] });
  };

  const handleMaxTokensChange = (value: string) => {
    onChange({ max_tokens: parseInt(value) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Model Configuration</h2>
        <p className="text-muted-foreground">Choose an AI model and adjust its settings</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Select AI Model</Label>
          <RadioGroup
            value={data.ai_model || 'gpt-4o-mini'}
            onValueChange={handleModelChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <RadioGroupItem value="gpt-4o-mini" id="gpt-4o-mini" className="mt-1" />
              <div className="space-y-1">
                <label htmlFor="gpt-4o-mini" className="text-sm font-medium leading-none cursor-pointer">
                  GPT-4o Mini
                </label>
                <p className="text-xs text-muted-foreground">
                  Balanced model with good performance and reasonable cost. Recommended for most use cases.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <RadioGroupItem value="gpt-4o" id="gpt-4o" className="mt-1" />
              <div className="space-y-1">
                <label htmlFor="gpt-4o" className="text-sm font-medium leading-none cursor-pointer">
                  GPT-4o
                </label>
                <p className="text-xs text-muted-foreground">
                  High performance model with advanced reasoning capabilities. Best for complex tasks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <RadioGroupItem value="gpt-3.5-turbo" id="gpt-3.5-turbo" className="mt-1" />
              <div className="space-y-1">
                <label htmlFor="gpt-3.5-turbo" className="text-sm font-medium leading-none cursor-pointer">
                  GPT-3.5 Turbo
                </label>
                <p className="text-xs text-muted-foreground">
                  Fast and cost-effective model. Great for simpler tasks and high volume use cases.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <RadioGroupItem value="claude-3-haiku" id="claude-3-haiku" className="mt-1" />
              <div className="space-y-1">
                <label htmlFor="claude-3-haiku" className="text-sm font-medium leading-none cursor-pointer">
                  Claude 3 Haiku
                </label>
                <p className="text-xs text-muted-foreground">
                  Alternative AI model with strong performance on specific types of tasks.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Temperature (Creativity)</Label>
              <span className="text-sm text-muted-foreground">{data.temperature || 0.7}</span>
            </div>
            <Slider
              value={[data.temperature || 0.7]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleTemperatureChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More precise</span>
              <span>More creative</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_tokens">Maximum Response Length</Label>
          <Select value={String(data.max_tokens || 2000)} onValueChange={handleMaxTokensChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select maximum tokens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">Short (1000 tokens)</SelectItem>
              <SelectItem value="2000">Medium (2000 tokens)</SelectItem>
              <SelectItem value="4000">Long (4000 tokens)</SelectItem>
              <SelectItem value="8000">Extra Long (8000 tokens)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This limits how long your chatbot's responses can be. One token is roughly 4 characters or 3/4 of a word.
          </p>
        </div>
      </div>
    </div>
  );
};
