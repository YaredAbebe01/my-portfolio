import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Globe } from "lucide-react";

const projects = [
  {
    title: "Blogging System",
    description: "A full-featured blogging platform with user authentication, post management, and comment system.",
    icon: Globe,
    technologies: ["Node.js", "MongoDB", "Express", "JavaScript"],
    features: ["User Authentication", "CRUD Operations", "Comment System"],
    link: "https://github.com/yeab166/GDG_Team3_Project.git"
  },
  {
    title: "QR-Based Menu System",
    description: "Digital menu solution using QR codes for restaurants, enabling contactless ordering.",
    icon: Code,
    technologies: ["Node.js", "Express", "MongoDB", "QR Code API"],
    features: ["QR Code Generation", "Menu Management", "Order Tracking"],
    link: "https://github.com/YaredAbebe01/bentarkMenu.git"
  },
  {
    title: "Auction Platform",
    description: "Online auction system with real-time bidding, user management, and transaction handling.",
    icon: Database,
    technologies: ["JavaScript", "MySQL", "PHP", "HTML", "CSS", "React"],
    features: ["Real-time Bidding", "User Profiles", "Transaction History"],
    link: "https://github.com/PHP-Auction-site/auction-site.git"
  }
  ,
  {
    title: "Safe Campus",
    description: "Backend for a campus safety platform using Node, Express and MongoDB. Awarded 3rd place in a Hackathon.",
    icon: Database,
    technologies: ["Node.js", "Express", "MongoDB"],
    features: ["APIs", "Authentication", "Database Integration"],
    link: "https://github.com/Alehegne/safe_Campus_backend.git"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured Projects
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            A showcase of my work demonstrating practical application of full-stack development skills.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Card 
                key={index} 
                className="hover-lift card-glow group cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => {
                  if (project.link) window.open(project.link, "_blank", "noopener,noreferrer");
                }}
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Key Features</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
