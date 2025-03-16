
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface PlanFeature {
  feature: string;
}

interface PlanProps {
  title: string;
  price: string;
  period?: string;
  chatbots: number | string;
  messages: number | string;
  storage: string;
  features: PlanFeature[];
}

const PlanCard: React.FC<PlanProps> = ({
  title,
  price,
  period,
  chatbots,
  messages,
  storage,
  features
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {price === 'Free' ? (
          <div className="text-2xl font-bold">Free</div>
        ) : (
          <div className="text-2xl font-bold">
            ${price}<span className="text-sm font-normal text-muted-foreground">{period}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chatbots
            </span>
            <span className="text-sm font-medium">{chatbots}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
              </svg>
              Messages
            </span>
            <span className="text-sm font-medium">{messages}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Storage
            </span>
            <span className="text-sm font-medium">{storage}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Features:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-blue-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {feature.feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4">
          <Button variant="outline" className="w-full flex justify-between">
            Edit Plan
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlans = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlanCard
          title="Free Trial"
          price="Free"
          chatbots={1}
          messages={50}
          storage="1 GB"
          features={[
            { feature: "1 chatbot" },
            { feature: "50 messages" },
            { feature: "7-day trial" },
            { feature: "Basic templates" },
            { feature: "Email support" }
          ]}
        />
        
        <PlanCard
          title="Starter"
          price="39"
          period="/mo /month, billed annually"
          chatbots={1}
          messages="5000"
          storage="5 GB"
          features={[
            { feature: "1 Chatbot" },
            { feature: "5,000 messages per month" },
            { feature: "1,000 AI tokens per day" },
            { feature: "Standard widgets and templates" },
            { feature: "Email support" },
            { feature: "Basic analytics" }
          ]}
        />
        
        <PlanCard
          title="Professional"
          price="99"
          period="/mo /month, billed annually"
          chatbots={5}
          messages="25000"
          storage="25 GB"
          features={[
            { feature: "5 Chatbots" },
            { feature: "25,000 messages per month" },
            { feature: "10,000 AI tokens per day" },
            { feature: "Advanced customization" },
            { feature: "Lead capture forms" },
            { feature: "Integrations with CRM/Email" },
            { feature: "Priority email & chat support" },
            { feature: "Detailed analytics & reporting" }
          ]}
        />
        
        <PlanCard
          title="Enterprise"
          price="299"
          period="/mo /month, billed annually"
          chatbots="Unlimited"
          messages="100000"
          storage="100 GB"
          features={[
            { feature: "Unlimited Chatbots" },
            { feature: "100,000 messages per month" },
            { feature: "Unlimited AI tokens" },
            { feature: "Custom integrations" },
            { feature: "Advanced security & compliance" },
            { feature: "Dedicated account manager" },
            { feature: "24/7 priority support" },
            { feature: "Custom analytics & reporting" },
            { feature: "Team collaboration features" }
          ]}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Plan</CardTitle>
          <p className="text-sm text-muted-foreground">Create a new subscription plan</p>
        </CardHeader>
        <CardContent>
          <Button className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Create New Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
