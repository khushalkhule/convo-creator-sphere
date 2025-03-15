
import { Settings, MessageSquare, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChatbotCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  conversationCount: number;
  leadCount: number;
  onManage: () => void;
  onPreview: () => void;
}

export const ChatbotCard: React.FC<ChatbotCardProps> = ({
  id,
  name,
  description,
  status,
  conversationCount,
  leadCount,
  onManage,
  onPreview
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl truncate">{name}</CardTitle>
          <div className={`px-2 py-1 text-xs rounded-full ${
            status === 'active' ? 'bg-green-100 text-green-800' : 
            status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </div>
        </div>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>{conversationCount} conversations</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{leadCount} leads</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onManage}>
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
        <Button variant="outline" size="sm" onClick={onPreview}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
};
