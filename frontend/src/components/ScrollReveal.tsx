import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
  animationClass?: string;
};

const ScrollReveal = ({
  children,
  className,
  threshold = 0.2,
  animationClass = "animate-reveal-up",
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "opacity-0 translate-y-10 will-change-transform",
        isVisible && animationClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
