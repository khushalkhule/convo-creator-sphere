
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Globe, FileText } from 'lucide-react';

interface KnowledgeBaseStepProps {
  data: {
    knowledge_base?: {
      type: string;
      content: string;
      urls?: string[];
      files?: string[];
    };
  };
  onChange: (data: any) => void;
}

export const KnowledgeBaseStep: React.FC<KnowledgeBaseStepProps> = ({ data, onChange }) => {
  const [newUrl, setNewUrl] = useState('');
  
  const knowledgeBase = data.knowledge_base || { type: 'text', content: '', urls: [], files: [] };
  
  const handleTypeChange = (type: string) => {
    onChange({
      knowledge_base: {
        ...knowledgeBase,
        type
      }
    });
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      knowledge_base: {
        ...knowledgeBase,
        content: e.target.value
      }
    });
  };
  
  const handleAddUrl = () => {
    if (!newUrl) return;
    const urls = [...(knowledgeBase.urls || []), newUrl];
    onChange({
      knowledge_base: {
        ...knowledgeBase,
        urls
      }
    });
    setNewUrl('');
  };
  
  const handleRemoveUrl = (index: number) => {
    const urls = [...(knowledgeBase.urls || [])];
    urls.splice(index, 1);
    onChange({
      knowledge_base: {
        ...knowledgeBase,
        urls
      }
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real application, this would upload files to a server
    // For this demo, we'll just store the file names
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      onChange({
        knowledge_base: {
          ...knowledgeBase,
          files: [...(knowledgeBase.files || []), ...fileNames]
        }
      });
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const files = [...(knowledgeBase.files || [])];
    files.splice(index, 1);
    onChange({
      knowledge_base: {
        ...knowledgeBase,
        files
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <p className="text-muted-foreground">Provide information for your chatbot to learn from</p>
      </div>

      <Tabs defaultValue={knowledgeBase.type} onValueChange={handleTypeChange}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="text">Text Content</TabsTrigger>
          <TabsTrigger value="urls">Website URLs</TabsTrigger>
          <TabsTrigger value="files">Upload Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Enter text knowledge</Label>
            <Textarea
              id="content"
              value={knowledgeBase.content || ''}
              onChange={handleContentChange}
              placeholder="Enter your knowledge base content here. This can include FAQs, product information, etc."
              className="min-h-[200px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="urls" className="space-y-4">
          <div className="space-y-2">
            <Label>Website URLs</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="https://example.com/knowledge"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <Button type="button" onClick={handleAddUrl}>Add</Button>
            </div>
          </div>
          
          {(knowledgeBase.urls || []).length > 0 && (
            <div className="space-y-2">
              <Label>Added URLs</Label>
              <div className="space-y-2">
                {(knowledgeBase.urls || []).map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">{url}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveUrl(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="files" className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Documents</Label>
            <Card className="border-dashed p-6">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Drag and drop files here or click to browse
                </p>
                <Button variant="outline" className="relative">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, TXT, CSV (Max 10MB)
                </p>
              </div>
            </Card>
          </div>
          
          {(knowledgeBase.files || []).length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files</Label>
              <div className="space-y-2">
                {(knowledgeBase.files || []).map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">{file}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
