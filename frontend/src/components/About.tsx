import { Card } from "@/components/ui/card";

const skills = [
  {
    name: "HTML",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.simpleicons.org/nextdotjs/000000",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "C++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Postman",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  {
    name: "Power BI",
    icon: "https://img.icons8.com/color/96/power-bi.png",
  },
];

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Professional Summary
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start md:items-center">
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 card-glow hover-lift">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                Software Engineering Student | Full-Stack Developer
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I am a fourth-year Software Engineering student at Addis Ababa Science and Technology University, focused on building secure backend services and scalable full-stack applications.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I am a certified Data Analyst and Full-Stack Developer with hands-on experience in Node.js, Next.js, React Native, and other modern web technologies. With over one year of practical experience, I have worked on RESTful APIs, authentication, database design, and responsive frontend development. I am passionate about creating efficient, user-friendly, and impactful digital solutions, continuously learning and improving my skills across both backend and frontend domains.
              </p>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 sm:p-8 card-glow">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary">
                Technical Skills Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 p-1.5">
                      <img
                        src={skill.icon}
                        alt={`${skill.name} logo`}
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
