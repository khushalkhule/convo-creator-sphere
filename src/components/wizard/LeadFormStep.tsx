
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LeadFormField {
  label: string;
  field_name: string;
  type: string;
  required: boolean;
}

interface LeadFormStepProps {
  data: {
    lead_form_enabled?: boolean;
    lead_form_title?: string;
    lead_form_description?: string;
    lead_form_success_message?: string;
    lead_form_fields?: LeadFormField[];
  };
  onChange: (data: any) => void;
}

export const LeadFormStep: React.FC<LeadFormStepProps> = ({ data, onChange }) => {
  const [newField, setNewField] = useState<LeadFormField>({
    label: '',
    field_name: '',
    type: 'text',
    required: true
  });

  const handleToggleChange = (checked: boolean) => {
    onChange({ lead_form_enabled: checked });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleNewFieldChange = (field: string, value: any) => {
    setNewField({ ...newField, [field]: value });
  };

  const addField = () => {
    if (!newField.label || !newField.field_name) return;
    
    const updatedFields = [...(data.lead_form_fields || []), newField];
    onChange({ lead_form_fields: updatedFields });
    
    // Reset the form
    setNewField({
      label: '',
      field_name: '',
      type: 'text',
      required: true
    });
  };

  const removeField = (index: number) => {
    const updatedFields = [...(data.lead_form_fields || [])];
    updatedFields.splice(index, 1);
    onChange({ lead_form_fields: updatedFields });
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (
      toIndex < 0 || 
      toIndex >= (data.lead_form_fields || []).length ||
      fromIndex < 0 ||
      fromIndex >= (data.lead_form_fields || []).length
    ) {
      return;
    }
    
    const updatedFields = [...(data.lead_form_fields || [])];
    const [movedItem] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedItem);
    
    onChange({ lead_form_fields: updatedFields });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lead Generation Form</h2>
        <p className="text-muted-foreground">Configure the lead capture form for your chatbot</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="lead_form_enabled"
          checked={data.lead_form_enabled}
          onCheckedChange={handleToggleChange}
        />
        <Label htmlFor="lead_form_enabled">Enable Lead Capture Form</Label>
      </div>

      {data.lead_form_enabled && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead_form_title">Form Title</Label>
              <Input
                id="lead_form_title"
                name="lead_form_title"
                value={data.lead_form_title || ''}
                onChange={handleInputChange}
                placeholder="Get in Touch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead_form_description">Form Description</Label>
              <Textarea
                id="lead_form_description"
                name="lead_form_description"
                value={data.lead_form_description || ''}
                onChange={handleInputChange}
                placeholder="Please fill out this form and we'll get back to you shortly."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead_form_success_message">Success Message</Label>
              <Textarea
                id="lead_form_success_message"
                name="lead_form_success_message"
                value={data.lead_form_success_message || ''}
                onChange={handleInputChange}
                placeholder="Thanks for reaching out! We'll be in touch soon."
                rows={2}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label>Form Fields</Label>
              <p className="text-xs text-muted-foreground mb-4">
                Configure the fields that will appear in your lead capture form
              </p>
            </div>

            <Card className="p-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_field_label">Field Label</Label>
                  <Input
                    id="new_field_label"
                    value={newField.label}
                    onChange={(e) => handleNewFieldChange('label', e.target.value)}
                    placeholder="e.g., Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_field_name">Field Name</Label>
                  <Input
                    id="new_field_name"
                    value={newField.field_name}
                    onChange={(e) => handleNewFieldChange('field_name', e.target.value)}
                    placeholder="e.g., full_name"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_field_type">Field Type</Label>
                  <Select 
                    value={newField.type} 
                    onValueChange={(value) => handleNewFieldChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="new_field_required"
                    checked={newField.required}
                    onCheckedChange={(checked) => handleNewFieldChange('required', checked)}
                  />
                  <Label htmlFor="new_field_required">Required Field</Label>
                </div>
              </div>

              <Button type="button" onClick={addField} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </Card>

            {(data.lead_form_fields || []).length > 0 && (
              <div className="space-y-2">
                <Label>Current Form Fields</Label>
                <div className="space-y-2">
                  {(data.lead_form_fields || []).map((field, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          className="cursor-move text-muted-foreground hover:text-foreground"
                          title="Drag to reorder"
                          onClick={() => {
                            // Simple move up/down as drag is complex to implement
                            if (index > 0) {
                              moveField(index, index - 1);
                            }
                          }}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <div>
                          <div className="font-medium text-sm">{field.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {field.field_name} · {field.type} · {field.required ? 'Required' : 'Optional'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(index)}
                          title="Remove field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
