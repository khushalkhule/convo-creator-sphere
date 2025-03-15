
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DotsPattern } from "@/assets/patterns";
import { useIntersectionObserver } from "@/utils/animations";
import { cn } from '@/lib/utils';

const demoSteps = [
  {
    title: "Create Your Chatbot",
    description: "Set up your chatbot in minutes with our intuitive setup wizard. Name your bot, define its purpose, and customize its appearance.",
    image: "https://placehold.co/600x400/e6f7ff/0069cc?text=Create+Chatbot"
  },
  {
    title: "Train With Your Knowledge",
    description: "Upload documents, connect your website, or manually add information to train your chatbot on your specific business knowledge.",
    image: "https://placehold.co/600x400/e6f7ff/0069cc?text=Train+Knowledge"
  },
  {
    title: "Configure Lead Capture",
    description: "Set up custom lead forms that appear at the right moment in conversations to capture qualified leads when engagement is highest.",
    image: "https://placehold.co/600x400/e6f7ff/0069cc?text=Lead+Capture"
  },
  {
    title: "Deploy to Your Website",
    description: "Add your chatbot to your website with a simple JavaScript snippet. No coding required and updates are instant.",
    image: "https://placehold.co/600x400/e6f7ff/0069cc?text=Deploy+Website"
  },
  {
    title: "Analyze and Optimize",
    description: "Monitor performance, analyze conversations, and optimize your chatbot based on real user interactions and lead conversion data.",
    image: "https://placehold.co/600x400/e6f7ff/0069cc?text=Analyze+Data"
  }
];

const ChatbotDemo = () => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % demoSteps.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  return (
    <section id="demo" className="relative py-24 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <DotsPattern />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 transition-opacity duration-1000 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="inline-block mb-4">
            <span className="chip bg-blue-100 text-blue-800 border border-blue-200">
              How It Works
            </span>
          </div>
          
          <h2 className="heading-lg mb-6">Create, Train, and Deploy in Minutes</h2>
          
          <p className="subheading">
            See how easy it is to set up your AI chatbot, train it with your business knowledge, 
            and start converting visitors into qualified leads.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Steps */}
          <div className="w-full lg:w-1/3">
            <div className="space-y-6">
              {demoSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-all duration-300",
                    activeStep === index 
                      ? "bg-white dark:bg-gray-800 shadow-md border border-blue-100 dark:border-blue-900"
                      : "hover:bg-white/50 dark:hover:bg-gray-800/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 font-medium text-sm",
                        activeStep === index 
                          ? "bg-blue-600 text-white" 
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold text-lg mb-1 transition-colors duration-300",
                        activeStep === index ? "text-blue-600 dark:text-blue-400" : ""
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 button-hover"
              >
                Start Building Your Chatbot
              </Button>
            </div>
          </div>
          
          {/* Image Showcase */}
          <div className="w-full lg:w-2/3">
            <div className="relative">
              {demoSteps.map((step, index) => (
                <div 
                  key={index}
                  className={cn(
                    "rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform",
                    activeStep === index 
                      ? "opacity-100 scale-100 z-10" 
                      : "opacity-0 scale-95 absolute inset-0"
                  )}
                >
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 glass-subtle">
                    <h3 className="font-bold text-xl mb-2">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-sm lg:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {demoSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                activeStep === index 
                  ? "w-8 bg-blue-600" 
                  : "bg-blue-200 hover:bg-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800"
              )}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemo;
