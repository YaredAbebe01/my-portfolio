import { useEffect, useState } from "react";
import { ArrowLeft, Boxes, Code2, ExternalLink, Star, X } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

const apiBaseUrl = import.meta.env.VITE_API_URL;

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const state = location.state as { project?: ProjectItem } | null;

  const [project, setProject] = useState<ProjectItem | null>(state?.project || null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (project || !projectId || !apiBaseUrl) return;

    let isMounted = true;

    const loadProject = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/projects`);
        if (!response.ok) {
          throw new Error("Failed to load project");
        }

        const data = await response.json();
        if (!Array.isArray(data) || !isMounted) return;

        const match = data.find((item) => {
          const idValue = String(item._id || item.id || "");
          return idValue === projectId;
        });

        if (!match) return;

        setProject({
          id: String(match._id || match.id || ""),
          title: match.title,
          description: match.description,
          technologies: match.technologies || [],
          features: match.features || [],
          liveUrl: match.liveUrl,
          repoUrl: match.repoUrl,
          imageUrl: match.imageUrl,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        });
      } catch (error) {
        // Keep not found state on failure.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, project, projectId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="container mx-auto max-w-6xl">
          <div
            className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/45 p-4 shadow-2xl backdrop-blur-sm sm:p-8"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 18%, hsl(var(--primary) / 0.3), transparent 42%), radial-gradient(circle at 85% 6%, hsl(var(--secondary) / 0.2), transparent 38%), radial-gradient(circle at 50% 95%, hsl(var(--accent) / 0.16), transparent 40%)",
            }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative z-10">
              <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Link to="/#projects" className="hover:text-foreground">
                  Projects
                </Link>
                <span>›</span>
                <span className="max-w-[12rem] truncate text-foreground sm:max-w-none">{project?.title || "Details"}</span>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading project details...</p>
              ) : !project ? (
                <Card className="border-border/70 bg-card/70 p-6">
                  <p className="text-sm text-muted-foreground">Project details are not available right now.</p>
                </Card>
              ) : (
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-5xl lg:text-6xl">{project.title}</h1>
                    <div className="mb-6 mt-4 h-1 w-28 rounded-full bg-primary/80" />
                    <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{project.description}</p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <Card className="border-border/60 bg-card/70 p-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/20 p-2 text-primary">
                            <Code2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold sm:text-3xl">{project.technologies.length}</p>
                            <p className="text-sm text-muted-foreground">Total Technology</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="border-border/60 bg-card/70 p-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/20 p-2 text-primary">
                            <Boxes className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold sm:text-3xl">{project.features.length}</p>
                            <p className="text-sm text-muted-foreground">Key Features</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.liveUrl && (
                        <Button asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            Live Demo
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button variant="outline" asChild>
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            Github
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      className="h-56 w-full rounded-2xl border border-border/60 bg-cover bg-center sm:h-72 lg:h-80"
                      style={{
                        backgroundImage: project.imageUrl
                          ? `url(${project.imageUrl})`
                          : "linear-gradient(120deg, hsl(var(--primary) / 0.45), hsl(var(--secondary) / 0.35))",
                      }}
                      role={project.imageUrl ? "button" : undefined}
                      tabIndex={project.imageUrl ? 0 : -1}
                      onClick={() => project.imageUrl && setFullscreenImage(project.imageUrl)}
                      onKeyDown={(event) => {
                        if ((event.key === "Enter" || event.key === " ") && project.imageUrl) {
                          event.preventDefault();
                          setFullscreenImage(project.imageUrl);
                        }
                      }}
                    />

                    <Card className="border-border/60 bg-card/70 p-5 sm:p-6">
                      <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Technologies Used</h2>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((technology, index) => (
                          <Badge key={`${technology}-${index}`} variant="secondary">
                            {technology}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    <Card className="border-border/60 bg-card/70 p-5 sm:p-6">
                      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
                        <Star className="h-6 w-6 text-primary" />
                        Key Features
                      </h2>
                      <ul className="space-y-3 text-muted-foreground">
                        {project.features.map((feature, index) => (
                          <li key={`${feature}-${index}`} className="flex items-start gap-2 text-base sm:text-lg">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close fullscreen image"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen project preview"
            className="max-h-[90vh] max-w-[94vw] rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
