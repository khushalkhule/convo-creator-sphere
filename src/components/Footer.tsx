
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="relative flex h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <span className="flex h-full w-full items-center justify-center text-white font-bold">
                  A
                </span>
              </span>
              <span className="font-bold text-xl tracking-tight">AiReply</span>
            </a>
            <p className="text-muted-foreground mb-4">
              AI-powered chatbots that transform your website visitors into qualified leads.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.335 18.339H15.67v-4.177c0-1.256-.023-2.878-1.712-2.878-1.716 0-1.979 1.37-1.979 2.786v4.269h-2.666V9.75h2.56v1.17h.035c.44-.86 1.52-1.766 3.127-1.766 3.347 0 3.957 2.257 3.957 5.204v4.021zM6.152 8.58c-.91 0-1.648-.743-1.648-1.66 0-.914.738-1.657 1.648-1.657.913 0 1.652.743 1.652 1.657 0 .917-.74 1.66-1.652 1.66zm1.352 9.758H4.82V9.75h2.684v8.588zM20.165 0H3.83C1.723 0 0 1.726 0 3.852v16.296C0 22.273 1.723 24 3.83 24h16.335c2.11 0 3.835-1.727 3.835-3.852V3.852C24 1.726 22.275 0 20.165 0z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Templates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} AiReply. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-muted-foreground text-sm">
                Crafted with precision for exceptional experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
