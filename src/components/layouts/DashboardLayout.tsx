
import React, { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LucideHome, 
  LucideMessageCircle, 
  LucideUsers, 
  LucideBarChart, 
  LucideSettings,
  LucideLogOut,
  LucideMenu,
  LucideX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const NavItem = ({ to, icon: Icon, label, active = false }) => (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      onClick={() => setSidebarOpen(false)}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="fixed z-20 left-4 top-4 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="rounded-full"
        >
          <LucideMenu />
        </Button>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-40 inset-y-0 left-0 flex w-72 flex-col border-r bg-white dark:bg-gray-800 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-primary text-xl">AIreply</span>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <LucideX size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-3">
          <div className="flex flex-col gap-1">
            <NavItem 
              to={dashboardPath} 
              icon={LucideHome} 
              label="Dashboard" 
              active={location.pathname === dashboardPath}
            />
            
            {isAdmin ? (
              <>
                <NavItem 
                  to="/admin/users" 
                  icon={LucideUsers} 
                  label="Users" 
                  active={location.pathname.startsWith('/admin/users')}
                />
                <NavItem 
                  to="/admin/chatbots" 
                  icon={LucideMessageCircle} 
                  label="Chatbots" 
                  active={location.pathname.startsWith('/admin/chatbots')}
                />
                <NavItem 
                  to="/admin/analytics" 
                  icon={LucideBarChart} 
                  label="Analytics" 
                  active={location.pathname.startsWith('/admin/analytics')}
                />
                <NavItem 
                  to="/admin/settings" 
                  icon={LucideSettings} 
                  label="Settings" 
                  active={location.pathname.startsWith('/admin/settings')}
                />
              </>
            ) : (
              <>
                <NavItem 
                  to="/chatbots" 
                  icon={LucideMessageCircle} 
                  label="Chatbots" 
                  active={location.pathname.startsWith('/chatbots')}
                />
                <NavItem 
                  to="/leads" 
                  icon={LucideUsers} 
                  label="Leads" 
                  active={location.pathname.startsWith('/leads')}
                />
                <NavItem 
                  to="/analytics" 
                  icon={LucideBarChart} 
                  label="Analytics" 
                  active={location.pathname.startsWith('/analytics')}
                />
                <NavItem 
                  to="/account" 
                  icon={LucideSettings} 
                  label="Account" 
                  active={location.pathname.startsWith('/account')}
                />
              </>
            )}
          </div>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="ml-auto"
              title="Logout"
            >
              <LucideLogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 lg:pl-72">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
