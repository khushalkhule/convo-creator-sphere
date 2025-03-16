
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PlatformUsageProps {
  apiCallsUsed: number;
  apiCallsLimit: number;
  storageUsed: number;
  storageLimit: number;
  chatbotsUsed: number;
  chatbotsLimit: number;
}

export const PlatformUsage: React.FC<PlatformUsageProps> = ({
  apiCallsUsed,
  apiCallsLimit,
  storageUsed,
  storageLimit,
  chatbotsUsed,
  chatbotsLimit
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Platform Usage</CardTitle>
            <p className="text-sm text-muted-foreground">Current usage of platform resources</p>
          </div>
          <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                <line x1="6" x2="6" y1="6" y2="6"></line>
                <line x1="6" x2="6" y1="18" y2="18"></line>
              </svg>
              <span className="font-medium">Plan</span>
              <span className="ml-auto font-bold">Enterprise</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M9 21V9"></path>
              </svg>
              <span className="font-medium">Next Billing</span>
              <span className="ml-auto">July 15, 2025</span>
            </div>
          </div>
          
          <div className="space-y-3 pt-3">
            <h4 className="text-sm font-medium mb-2">Included Features:</h4>
            <ul className="grid grid-cols-2 gap-2">
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Unlimited team members
              </li>
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Custom AI model integration
              </li>
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                White-label chatbots
              </li>
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Custom domain
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
          <p className="text-sm text-muted-foreground">Current usage of available resources</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span className="text-sm font-medium">API Calls</span>
              </div>
              <span className="text-sm font-medium">{apiCallsUsed.toLocaleString()} / {apiCallsLimit.toLocaleString()}</span>
            </div>
            <Progress value={(apiCallsUsed / apiCallsLimit) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                <span className="text-sm font-medium">Storage</span>
              </div>
              <span className="text-sm font-medium">{storageUsed} GB / {storageLimit} GB</span>
            </div>
            <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"></path>
                </svg>
                <span className="text-sm font-medium">Chatbots</span>
              </div>
              <span className="text-sm font-medium">{chatbotsUsed} / {chatbotsLimit}</span>
            </div>
            <Progress value={(chatbotsUsed / chatbotsLimit) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
