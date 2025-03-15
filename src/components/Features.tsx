
import { GridPattern } from "@/assets/patterns";
import { useIntersectionObserver } from "@/utils/animations";
import { cn } from '@/lib/utils';

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI-Powered Conversations",
    description: "Train your chatbot on your business data to provide accurate, helpful responses that feel human and drive conversions."
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Knowledge Base Integration",
    description: "Upload documents, PDFs, or connect your website to create a custom knowledge base that powers your chatbot's responses."
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "Lead Capture Forms",
    description: "Collect qualified leads through intelligent forms that appear at the perfect moment in the conversation, boosting conversion rates."
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Advanced Analytics",
    description: "Gain insights into user behavior, conversation patterns, and conversion metrics to continuously improve performance."
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Beautiful Customization",
    description: "Match your brand perfectly with customizable colors, fonts, and positioning. Integrate seamlessly with your website design."
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "No-Code Deployment",
    description: "Install on your website with a simple JavaScript snippet. No coding knowledge required to configure, launch, and update."
  }
];

const Features = () => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  
  return (
    <section id="features" className="relative py-20 overflow-hidden">
      <GridPattern />
      
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
              Features
            </span>
          </div>
          
          <h2 className="heading-lg mb-6">Everything You Need For Success</h2>
          
          <p className="subheading">
            Our AI chatbot platform provides all the tools you need to engage visitors, answer questions, 
            and convert leads through intelligent, personalized conversations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "glass p-6 rounded-xl border transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index % 3) * 150 + 400}ms` }}
            >
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
