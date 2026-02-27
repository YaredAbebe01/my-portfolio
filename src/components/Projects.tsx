import { useEffect, useState } from "react";
import { Award, ChevronDown, ExternalLink, FolderKanban, Layers3, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const apiBaseUrl = import.meta.env.VITE_API_URL;

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  location?: string;
  description?: string;
  skills?: string[];
  link?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type HackathonItem = {
  id: string;
  title: string;
  result?: string;
  focus?: string;
  link?: string;
  date?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isCertificateLoading, setIsCertificateLoading] = useState(false);
  const [isHackathonLoading, setIsHackathonLoading] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const syncTabWithHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#certificates") {
        setActiveTab("certificates");
        return;
      }
      if (hash === "#projects") {
        setActiveTab("projects");
      }
    };

    syncTabWithHash();
    window.addEventListener("hashchange", syncTabWithHash);
    return () => window.removeEventListener("hashchange", syncTabWithHash);
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadProjects = async () => {
      setIsProjectLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/projects`);
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const mapped = data.map((item) => ({
            id: item._id || String(item.id || ""),
            title: item.title,
            description: item.description,
            technologies: item.technologies || [],
            features: item.features || [],
            liveUrl: item.liveUrl,
            repoUrl: item.repoUrl,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));

          mapped.sort((firstProject, secondProject) => {
            const firstValue = Date.parse(firstProject.updatedAt || firstProject.createdAt || "") || 0;
            const secondValue = Date.parse(secondProject.updatedAt || secondProject.createdAt || "") || 0;
            return secondValue - firstValue;
          });

          setProjects(mapped);
        }
      } catch (error) {
        // Keep empty state on failure.
      } finally {
        if (isMounted) {
          setIsProjectLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadHackathons = async () => {
      setIsHackathonLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/hackathons`);
        if (!response.ok) {
          throw new Error("Failed to load hackathons");
        }

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const mapped = data.map((item) => ({
            id: item._id || String(item.id || ""),
            title: item.title,
            result: item.result,
            focus: item.focus,
            link: item.link,
            date: item.date,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));

          mapped.sort((firstHackathon, secondHackathon) => {
            const firstValue = Date.parse(firstHackathon.updatedAt || firstHackathon.createdAt || "") || 0;
            const secondValue = Date.parse(secondHackathon.updatedAt || secondHackathon.createdAt || "") || 0;
            return secondValue - firstValue;
          });

          setHackathons(mapped);
        }
      } catch (error) {
        // Keep empty state on failure.
      } finally {
        if (isMounted) {
          setIsHackathonLoading(false);
        }
      }
    };

    loadHackathons();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadCertificates = async () => {
      setIsCertificateLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/certificates`);
        if (!response.ok) {
          throw new Error("Failed to load certificates");
        }

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const mapped = data.map((item) => ({
            id: item._id || String(item.id || ""),
            title: item.title,
            issuer: item.issuer,
            date: item.date,
            location: item.location,
            description: item.description,
            skills: item.skills || [],
            link: item.link,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));

          mapped.sort((firstCertificate, secondCertificate) => {
            const firstValue = Date.parse(firstCertificate.updatedAt || firstCertificate.createdAt || "") || 0;
            const secondValue = Date.parse(secondCertificate.updatedAt || secondCertificate.createdAt || "") || 0;
            return secondValue - firstValue;
          });

          setCertificates(mapped);
        }
      } catch (error) {
        // Keep empty state on failure.
      } finally {
        if (isMounted) {
          setIsCertificateLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  const projectCards = projects.slice(0, visibleProjects);

  return (
    <section id="projects" className="px-4 py-12 sm:px-6 sm:py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/50 p-4 shadow-2xl backdrop-blur-sm sm:p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.28), transparent 42%), radial-gradient(circle at 85% 5%, hsl(var(--secondary) / 0.2), transparent 38%), radial-gradient(circle at 50% 95%, hsl(var(--accent) / 0.16), transparent 40%)",
          }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative z-10 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-4xl md:text-5xl">Portfolio Showcase</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Explore my featured projects, certifications, and hackathon experiences that reflect my practical skills and continuous growth.
              </p>
            </div>

            <div id="certificates" className="scroll-mt-24" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mx-auto grid h-auto w-full max-w-3xl grid-cols-3 gap-1 rounded-3xl border border-border/70 bg-card/40 p-1.5 backdrop-blur sm:gap-0 sm:p-2">
                <TabsTrigger
                  value="projects"
                  className="h-[72px] min-w-0 flex-col gap-1 rounded-2xl px-1 text-xs font-semibold leading-tight data-[state=active]:bg-background/80 sm:h-16 sm:flex-row sm:px-3 sm:text-base"
                >
                  <FolderKanban className="h-4 w-4 sm:mr-2" />
                  <span className="text-center">Projects</span>
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="h-[72px] min-w-0 flex-col gap-1 rounded-2xl px-1 text-xs font-semibold leading-tight data-[state=active]:bg-background/80 sm:h-16 sm:flex-row sm:px-3 sm:text-base"
                >
                  <Award className="h-4 w-4 sm:mr-2" />
                  <span className="text-center">Certificates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="hackathons"
                  className="h-[72px] min-w-0 flex-col gap-1 rounded-2xl px-1 text-xs font-semibold leading-tight data-[state=active]:bg-background/80 sm:h-16 sm:flex-row sm:px-3 sm:text-base"
                >
                  <Trophy className="h-4 w-4 sm:mr-2" />
                  <span className="text-center">Hackathons</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-6">
                {isProjectLoading ? (
                  <p className="text-center text-sm text-muted-foreground">Loading project data...</p>
                ) : projectCards.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No projects found.</p>
                ) : (
                  <>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {projectCards.map((project, index) => (
                        <Card
                          key={`${project.title}-${index}`}
                          className="group mx-auto w-full max-w-[21rem] border-border/60 bg-card/70 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 md:max-w-none animate-slide-in-left"
                          style={{ animationDelay: `${index * 90}ms` }}
                        >
                          <CardHeader className="space-y-3 p-5 sm:p-6">
                            <div
                              className="h-44 w-full rounded-xl border border-border/50 bg-cover bg-center"
                              style={{
                                backgroundImage: project.imageUrl
                                  ? `url(${project.imageUrl})`
                                  : "linear-gradient(120deg, hsl(var(--primary) / 0.45), hsl(var(--secondary) / 0.35))",
                              }}
                            />
                            <CardTitle className="text-xl text-foreground group-hover:text-primary sm:text-4xl">
                              {project.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3 text-base leading-relaxed text-muted-foreground sm:text-base">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                            <div className="hidden flex-wrap gap-2 sm:flex">
                              {project.technologies.slice(0, 4).map((technology, technologyIndex) => (
                                <Badge key={`${technology}-${technologyIndex}`} variant="secondary">
                                  {technology}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-4">
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-base font-medium text-primary transition-colors hover:text-primary/80"
                                  >
                                    Live Demo
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                                {project.repoUrl && (
                                  <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-base font-medium text-primary transition-colors hover:text-primary/80"
                                  >
                                    Github
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                asChild
                              >
                                <Link
                                  to={`/projects/${project.id || index}`}
                                  state={{ project }}
                                >
                                  Details
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {projects.length > visibleProjects && (
                      <div className="mt-6 text-left">
                        <Button variant="outline" onClick={() => setVisibleProjects((count) => count + 3)}>
                          See More
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="certificates" className="mt-6">
                {isCertificateLoading ? (
                  <p className="text-center text-sm text-muted-foreground">Loading certificate data...</p>
                ) : certificates.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No certificates found.</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {certificates.map((certificate, index) => (
                      <Card
                        key={`${certificate.title}-${index}`}
                        className="mx-auto w-full max-w-[21rem] border-border/60 bg-card/70 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 md:max-w-none animate-slide-in-right"
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <CardHeader className="p-5 sm:p-6">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <CardTitle className="text-xl text-foreground">{certificate.title}</CardTitle>
                            <Layers3 className="h-5 w-5 text-primary" />
                          </div>
                          <CardDescription className="text-sm">
                            {certificate.issuer}
                            {certificate.date ? ` • ${certificate.date}` : ""}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
                          {certificate.imageUrl && (
                            <img
                              src={certificate.imageUrl}
                              alt={`${certificate.title} preview`}
                              className="h-36 w-full rounded-xl border border-border/60 object-cover"
                            />
                          )}
                          <div className="flex flex-wrap gap-2">
                            {(certificate.skills || []).slice(0, 4).map((skill, skillIndex) => (
                              <Badge key={`${skill}-${skillIndex}`} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            {certificate.link ? (
                              <a
                                href={certificate.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                              >
                                Verify Credential
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : (
                              <span />
                            )}
                            <Button variant="secondary" size="sm" asChild>
                              <Link
                                to={`/certificates/${certificate.id || index}`}
                                state={{ certificate }}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hackathons" className="mt-6">
                {isHackathonLoading ? (
                  <p className="text-center text-sm text-muted-foreground">Loading hackathons...</p>
                ) : hackathons.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No hackathons found.</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {hackathons.map((hackathon, index) => (
                      <Card
                        key={`${hackathon.title}-${index}`}
                        className="mx-auto w-full max-w-[21rem] border-border/60 bg-card/70 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 md:max-w-none animate-fade-in-up"
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <CardHeader className="p-5 sm:p-6">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <CardTitle className="text-xl text-foreground">{hackathon.title}</CardTitle>
                            <Trophy className="h-5 w-5 text-primary" />
                          </div>
                          <CardDescription className="text-sm">
                            {hackathon.result || "Participation"}
                            {hackathon.date ? ` • ${hackathon.date}` : ""}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
                          {hackathon.imageUrl && (
                            <img
                              src={hackathon.imageUrl}
                              alt={`${hackathon.title} highlight`}
                              className="h-36 w-full rounded-xl border border-border/60 object-cover"
                            />
                          )}
                          {hackathon.focus && (
                            <p className="line-clamp-3 text-sm text-muted-foreground">{hackathon.focus}</p>
                          )}
                          <div className="flex items-center justify-between gap-3">
                            {hackathon.link ? (
                              <a
                                href={hackathon.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                              >
                                Github
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : (
                              <span />
                            )}
                            <Button variant="secondary" size="sm" asChild>
                              <Link
                                to={`/hackathons/${hackathon.id || index}`}
                                state={{ hackathon }}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
