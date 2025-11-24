import { Button } from "@/components/ui/button";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-20 sm:py-0">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-95" />
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            Yared's Portfolio
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl text-white/90 mb-3 sm:mb-4">
            Hi, I'm <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">Yared Abebe</span>
          </p>
          
          <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Building efficient and user-friendly software solutions with expertise in full-stack development, databases, and modern web technologies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto"
              asChild
            >
              <a href="#about">
                Learn More About Me
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-black hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
              asChild
            >
              <a 
                href="https://drive.google.com/file/d/1hmdc2CdqYE-wWRZnYefVtXtIGrSaLgFz/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'black' }}
              >
                <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'black' }} />
                <span style={{ color: 'black' }}>View Resume</span>
              </a>
            </Button>
          </div>
          
          <div className="flex gap-4 sm:gap-6 justify-center">
            <a 
              href="https://github.com/YaredAbebe01" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
            <a 
              href="www.linkedin.com/in/yared-abebe-47870b2b9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
            <a 
              href="mailto:yaredabebe0101@gmail.com" 
              className="text-white/70 hover:text-white transition-colors"
            >
              <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
