
import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  triggerOnce = true,
}: UseIntersectionObserverProps = {}): [RefObject<T>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Unobserve after intersection if triggerOnce is true
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(node);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting];
};

export const staggeredChildren = (delay: number = 0.1) => {
  return (index: number) => ({
    animationDelay: `${index * delay}s`,
  });
};

interface TypewriterHookProps {
  text: string;
  speed?: number;
  delay?: number;
}

export const useTypewriter = ({ text, speed = 50, delay = 0 }: TypewriterHookProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Reset state when text changes
    setDisplayText('');
    setIsDone(false);
    
    // Initial delay
    timeout = setTimeout(() => {
      setIsTyping(true);
      
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text.charAt(currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          setIsDone(true);
        }
      }, speed);
      
      return () => clearInterval(intervalId);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayText, isTyping, isDone };
};
