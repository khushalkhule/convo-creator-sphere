
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMemberCardProps {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  email,
  role,
  avatarUrl
}) => {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit permissions</DropdownMenuItem>
            <DropdownMenuItem>Remove member</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Badge variant={role === 'Owner' ? 'default' : 'outline'}>
          {role}
        </Badge>
      </CardContent>
    </Card>
  );
};

// Add Button component to resolve import error
const Button = ({ variant = 'default', size = 'default', children, ...props }: any) => {
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium 
        ${variant === 'ghost' ? 'hover:bg-muted hover:text-primary' : ''}
        ${size === 'icon' ? 'h-9 w-9' : ''}`} 
      {...props}
    >
      {children}
    </button>
  );
};
