import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";
import certImg1 from "../../pics/pics52-professional-foundations-certificate-yared-abebe.png";
import certImg2 from "../../pics/Yared Abebe_page-0001.jpg";
import certImg3 from "../../pics/photo_2025-06-22_12-01-23.jpg";
import certImg4 from "../../pics/51-data-analytics-certificate-yared-abebe (2).png";

const certificates = [
  {
    title: "Software Engineering (Current Study)",
    issuer: "Addis Ababa Science and Technology University",
    date: "2022 – Present",
    location: "Addis Ababa, Ethiopia",
    description: "Currently a 4th-year student pursuing a degree in Software Engineering. Relevant Coursework: Internet Programming, Web Development, Database Systems, Object-Oriented Programming (Java), Operating Systems, Mobile Computing, Computer Graphics, Distributed Systems, Artificial Intelligence.",
    skills: ["Software Engineering", "Web Development", "Database Systems", "OOP", "AI"],
    link: "#"
  },
  {
    title: "Data Analytics",
    issuer: "ALX Africa",
    date: "02/2025 – 09/2025",
    location: "Addis Ababa, Ethiopia",
    description: "Developed strong analytical and programming skills, learning data collection, processing, and visualization using tools such as Power BI and SQL to extract insights from real-world datasets.",
    skills: ["Power BI", "SQL", "Data Visualization", "Analytics"],
    link: certImg4
  },
  {
    title: "Node.js Developer",
    issuer: "Google Developer Group (GDG)",
    date: "12/2024 – 06/2025",
    location: "Addis Ababa, Ethiopia",
    description: "Gained practical skills in building scalable backend applications using Node.js, Express.js, and MongoDB, emphasizing RESTful API development and teamwork in real-world projects.",
    skills: ["Node.js", "Express.js", "MongoDB", "REST API"],
    link: certImg2
  },
  {
    title: "AI and Machine Learning Bootcamp",
    issuer: "Python and Others",
    date: "Feb 12, 2025 – Feb 21, 2025",
    description: "Hands-on bootcamp covering AI and machine learning concepts and practical implementation in Python.",
    skills: ["Python", "AI", "Machine Learning"],
    link: certImg3
  },
  {
    title: "Professional Foundation",
    issuer: "ALX Africa",
    date: "",
    description: "Completed the Professional Foundation program at ALX Africa.",
    skills: ["Professional Skills", "Foundations"],
    link: certImg1
  }
];

const certImages = [certImg1, certImg2, certImg3];

const Certificates = () => {
  return (
    <section id="certificates" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Certifications
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Committed to continuous learning and professional development. Here are the certifications I've earned to validate my skills and knowledge.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificates.map((cert, index) => (
            <Card
              key={index}
              className="hover-lift card-glow group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                if (cert.link && cert.link !== "#") {
                  const url = `/cert-viewer.html?img=${encodeURIComponent(cert.link)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {cert.title}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{cert.issuer}</span>
                  <span className="text-xs">{cert.date}</span>
                </CardDescription>
                {cert.location && (
                  <div className="text-xs text-muted-foreground mt-1">{cert.location}</div>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-xs text-muted-foreground">{cert.description}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {cert.link && cert.link !== "#" && (
                  <a
                    href={`/cert-viewer.html?img=${encodeURIComponent(cert.link)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-black hover:text-black flex items-center gap-1 transition-colors"
                  >
                    <span style={{ color: 'black' }}>View Certificate</span>
                    <ExternalLink className="h-3 w-3" style={{ color: 'black' }} />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;

