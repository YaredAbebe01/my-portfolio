import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skills = [
  "Node.js", "Express.js", "React", "JavaScript", "TypeScript",
  "HTML", "CSS", "Tailwind CSS", "SQL", "MongoDB",
  "Git", "PHP", "MySQL", "Java Swing", "Postman"
];

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About Me
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start md:items-center">
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 card-glow hover-lift">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                Software Engineer in the Making
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm a fourth-year Software Engineering student at Addis Ababa Science and Technology University with a strong passion for building efficient and user-friendly software solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I have hands-on experience in both frontend and backend development, having developed projects involving user authentication, blogging systems, QR-based menus, and auction platforms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I am a quick learner and a team player, always eager to take on new challenges and contribute to innovative projects.
              </p>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 sm:p-8 card-glow">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Full-Stack Development</span>
                    <span className="text-sm text-muted-foreground">Advanced</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%] rounded-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Database Management</span>
                    <span className="text-sm text-muted-foreground">Proficient</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[80%] rounded-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">UI/UX Design</span>
                    <span className="text-sm text-muted-foreground">Intermediate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[70%] rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
