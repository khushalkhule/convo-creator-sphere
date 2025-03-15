
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  completed: boolean;
  current: boolean;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
      
      <ol className="relative z-10 flex justify-between">
        {steps.map((step) => (
          <li key={step.id} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full 
              ${step.current ? 'bg-primary text-white' : 
                step.completed ? 'bg-primary/90 text-white' : 
                'bg-gray-100 text-gray-500'} 
              transition-colors`}
            >
              {step.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span 
              className={`mt-2 text-xs font-medium
              ${step.current ? 'text-primary' : 
                step.completed ? 'text-primary/90' : 
                'text-gray-500'}`}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};
