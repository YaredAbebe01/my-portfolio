import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_URL;

type CertificateItem = {
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
  title: string;
  result?: string;
  focus?: string;
  link?: string;
  date?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

const Certificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHackathonLoading, setIsHackathonLoading] = useState(false);
  const [expandedCertificates, setExpandedCertificates] = useState<Record<number, boolean>>({});
  const [certificateOverflow, setCertificateOverflow] = useState<Record<number, boolean>>({});
  const descriptionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const clampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  };

  const toggleCertificateDescription = (index: number) => {
    setExpandedCertificates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkCertificateOverflow = () => {
    setCertificateOverflow(() => {
      const next: Record<number, boolean> = {};
      Object.entries(descriptionRefs.current).forEach(([key, node]) => {
        const index = Number(key);
        if (!node) return;
        next[index] = node.scrollHeight > node.clientHeight + 1;
      });
      return next;
    });
  };

  useLayoutEffect(() => {
    checkCertificateOverflow();
  }, [certificates]);

  useEffect(() => {
    const handleResize = () => checkCertificateOverflow();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadCertificates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/certificates`);
        if (!response.ok) {
          throw new Error("Failed to load certificates");
        }

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const mapped = data.map((item) => ({
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
          mapped.sort((a, b) => {
            const aValue = Date.parse(a.updatedAt || a.createdAt || "") || 0;
            const bValue = Date.parse(b.updatedAt || b.createdAt || "") || 0;
            return bValue - aValue;
          });
          setCertificates(mapped);
        }
      } catch (error) {
        // Keep empty state on failure.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

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
            title: item.title,
            result: item.result,
            focus: item.focus,
            link: item.link,
            date: item.date,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          mapped.sort((a, b) => {
            const aValue = Date.parse(a.updatedAt || a.createdAt || "") || 0;
            const bValue = Date.parse(b.updatedAt || b.createdAt || "") || 0;
            return bValue - aValue;
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
  }, [apiBaseUrl]);

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
          {isLoading && (
            <p className="mt-3 text-xs text-muted-foreground">Loading certification data...</p>
          )}
        </div>
        
        {certificates.length === 0 && !isLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            No certificates yet. Add certificates from the admin page.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {certificates.map((cert, index) => (
              <Card
                key={index}
                className="hover-lift card-glow group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (cert.imageUrl) {
                    const url = `/cert-viewer.html?img=${encodeURIComponent(cert.imageUrl)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {cert.title}
                    </CardTitle>
                    {cert.imageUrl && (
                      <img
                        src={cert.imageUrl}
                        alt={`${cert.title} certificate`}
                        className="h-16 w-24 rounded-lg border border-border/60 object-cover"
                      />
                    )}
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>{cert.issuer}</span>
                    <span className="text-xs">{cert.date}</span>
                  </CardDescription>
                  {cert.location && (
                    <div className="text-xs text-muted-foreground mt-1">{cert.location}</div>
                  )}
                </CardHeader>
                <CardContent>
                  {cert.description && (
                    <div className="mb-2 text-xs text-muted-foreground">
                      <div
                        ref={(node) => {
                          descriptionRefs.current[index] = node;
                        }}
                        style={expandedCertificates[index] ? undefined : clampStyle}
                      >
                        {cert.description}
                      </div>
                      {certificateOverflow[index] && (
                        <button
                          type="button"
                          className="mt-2 text-xs font-medium text-primary hover:text-primary/80"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleCertificateDescription(index);
                          }}
                        >
                          {expandedCertificates[index] ? "See less" : "See more"}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(cert.skills || []).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    {cert.imageUrl && (
                      <a
                        href={`/cert-viewer.html?img=${encodeURIComponent(cert.imageUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-primary hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        <span>View Certificate</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-primary hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground text-center">
            Hackathon Participation
          </h3>
          {isHackathonLoading && (
            <p className="mb-4 text-xs text-muted-foreground text-center">Loading hackathons...</p>
          )}
          {hackathons.length === 0 && !isHackathonLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              No hackathons yet. Add hackathons from the admin page.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {hackathons.map((hackathon) => (
                <Card key={hackathon.title} className="card-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                      {hackathon.imageUrl && (
                        <img
                          src={hackathon.imageUrl}
                          alt={`${hackathon.title} highlight`}
                          className="h-14 w-20 rounded-lg border border-border/60 object-cover"
                        />
                      )}
                    </div>
                    <CardDescription>{hackathon.result || hackathon.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{hackathon.focus}</p>
                    {(hackathon.imageUrl || hackathon.link) && (
                      <div className="mt-3 flex items-center gap-4">
                        {hackathon.imageUrl && (
                          <a
                            href={`/cert-viewer.html?img=${encodeURIComponent(hackathon.imageUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary transition-colors"
                          >
                            <span>View Image</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {hackathon.link && (
                          <a
                            href={hackathon.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary transition-colors"
                          >
                            <span>View Proof</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certificates;

