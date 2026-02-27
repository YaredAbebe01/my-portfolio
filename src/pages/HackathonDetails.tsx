import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

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

const apiBaseUrl = import.meta.env.VITE_API_URL;

const HackathonDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hackathonId } = useParams();
  const state = location.state as { hackathon?: HackathonItem } | null;

  const [hackathon, setHackathon] = useState<HackathonItem | null>(state?.hackathon || null);
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
    if (hackathon || !hackathonId || !apiBaseUrl) return;

    let isMounted = true;

    const loadHackathon = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/hackathons`);
        if (!response.ok) {
          throw new Error("Failed to load hackathon");
        }

        const data = await response.json();
        if (!Array.isArray(data) || !isMounted) return;

        const match = data.find((item) => String(item._id || item.id || "") === hackathonId);
        if (!match) return;

        setHackathon({
          id: String(match._id || match.id || ""),
          title: match.title,
          result: match.result,
          focus: match.focus,
          link: match.link,
          date: match.date,
          imageUrl: match.imageUrl,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        });
      } catch (error) {
        // Keep fallback state on failure.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHackathon();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, hackathon, hackathonId]);

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
                <Link to="/#projects" className="hover:text-foreground">Hackathons</Link>
                <span>›</span>
                <span className="max-w-[12rem] truncate text-foreground sm:max-w-none">{hackathon?.title || "Details"}</span>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading hackathon details...</p>
              ) : !hackathon ? (
                <Card className="border-border/70 bg-card/70 p-6">
                  <p className="text-sm text-muted-foreground">Hackathon details are not available right now.</p>
                </Card>
              ) : (
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-5xl lg:text-6xl">{hackathon.title}</h1>
                    <div className="mb-6 mt-4 h-1 w-28 rounded-full bg-primary/80" />
                    <p className="text-base text-muted-foreground sm:text-lg">{hackathon.result || "Participation"}</p>
                    {hackathon.date && <p className="mt-2 text-sm text-muted-foreground">{hackathon.date}</p>}
                    {hackathon.focus && (
                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        {hackathon.focus}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                      {hackathon.link && (
                        <Button asChild>
                          <a href={hackathon.link} target="_blank" rel="noopener noreferrer">
                            Github Link
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {hackathon.imageUrl && (
                      <img
                        src={hackathon.imageUrl}
                        alt={`${hackathon.title} highlight`}
                        className="h-56 w-full cursor-zoom-in rounded-2xl border border-border/60 object-cover sm:h-72 lg:h-80"
                        onClick={() => setFullscreenImage(hackathon.imageUrl || null)}
                      />
                    )}

                    <Card className="border-border/60 bg-card/70 p-5 sm:p-6">
                      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
                        <Trophy className="h-6 w-6 text-primary" />
                        Highlight
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {hackathon.focus || "More details coming soon."}
                      </p>
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
            alt="Fullscreen hackathon preview"
            className="max-h-[90vh] max-w-[94vw] rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default HackathonDetails;
