import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get In Touch
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            I'm always open to discussing new projects, opportunities, or collaborations.
          </p>
        </div>
        
        <Card className="p-6 sm:p-8 card-glow flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary">
                Contact Information
              </h3>
              
              <div className="space-y-6 w-full flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-2">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a 
                    href="mailto:yaredabebe@example.com" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    yaredabebe0101@gmail.com
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-2">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <a 
                    href="tel:+251900000000" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +251936092577
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-2">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border w-full flex flex-col items-center text-center">
                <h4 className="font-semibold mb-4">Connect With Me</h4>
                <div className="flex gap-4 justify-center">
                  <a 
                    href="https://github.com/YaredAbebe01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/yared-abebe-47870b2b9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="mailto:yaredabebe@example.com"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
