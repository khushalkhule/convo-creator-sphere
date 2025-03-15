
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CirclePattern } from "@/assets/patterns";
import { useIntersectionObserver, useTypewriter } from "@/utils/animations";
import { cn } from '@/lib/utils';

const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const { displayText, isTyping } = useTypewriter({
    text: "How can I help you today?",
    delay: 1000,
    speed: 70
  });
  
  const [responses] = useState([
    "I can help you increase lead conversion by 37% with our AI chatbot.",
    "Our knowledge base technology allows me to answer questions about your specific business.",
    "I can collect qualified leads while you're away and notify your team instantly."
  ]);
  
  const [currentResponse, setCurrentResponse] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  
  useEffect(() => {
    if (isTyping) return;
    
    const timer = setTimeout(() => {
      setShowResponse(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isTyping]);
  
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <CirclePattern />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-4xl mx-auto text-center transition-opacity duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="inline-block mb-4">
            <span className="chip bg-blue-100 text-blue-800 border border-blue-200">
              Introducing AiReply
            </span>
          </div>
          
          <h1 className="heading-xl mb-6">
            <span className="text-gradient">AI-Powered Conversations</span> That Convert Visitors Into Customers
          </h1>
          
          <p className="subheading mb-8 max-w-2xl mx-auto">
            Create intelligent chatbots trained on your business knowledge that engage visitors, 
            answer questions, and capture leads 24/7 without writing a single line of code.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 button-hover"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 transition-all duration-300 button-hover"
            >
              View Demo
            </Button>
          </div>
          
          {/* Chat Demo */}
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl border shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-medium">AiReply Assistant</div>
                <div className="w-16"></div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  {/* Bot message */}
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 max-w-xs mx-2 items-start">
                      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg rounded-bl-none">
                        <p className="text-sm">
                          {displayText}
                          {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User message */}
                  {showResponse && (
                    <div className="flex items-end justify-end">
                      <div className="flex flex-col space-y-2 max-w-xs mx-2 items-end">
                        <div 
                          className="bg-blue-600 text-white p-3 rounded-lg rounded-br-none animate-fade-in"
                        >
                          <p className="text-sm">I need help with lead generation for my business.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bot response */}
                  {showResponse && (
                    <div className="flex items-end animate-fade-in" style={{ animationDelay: '1s' }}>
                      <div className="flex flex-col space-y-2 max-w-xs mx-2 items-start">
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg rounded-bl-none">
                          <p className="text-sm">{responses[currentResponse]}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t p-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full p-2 pl-4 pr-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
