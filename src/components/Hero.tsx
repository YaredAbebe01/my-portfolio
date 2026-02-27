import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Github, Instagram, Linkedin, Mail } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const defaultLinks = {
  github: { id: "", url: "" },
  linkedin: { id: "", url: "" },
  instagram: { id: "", url: "" },
  email: { id: "", url: "" },
};

const heroTypedText = "Explore featured projects, certifications, and recent work highlights.";

const Hero = () => {
  const [links, setLinks] = useState(defaultLinks);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [typedCharCount, setTypedCharCount] = useState(0);

  useEffect(() => {
    let initialTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let replayIntervalId: ReturnType<typeof setInterval> | null = null;
    let typingIntervalId: ReturnType<typeof setInterval> | null = null;

    const runTyping = () => {
      if (typingIntervalId) {
        clearInterval(typingIntervalId);
      }

      setTypedCharCount(0);
      let nextCount = 0;

      typingIntervalId = setInterval(() => {
        nextCount += 1;
        setTypedCharCount(nextCount);

        if (nextCount >= heroTypedText.length && typingIntervalId) {
          clearInterval(typingIntervalId);
          typingIntervalId = null;
        }
      }, 45);
    };

    initialTimeoutId = setTimeout(() => {
      runTyping();
      replayIntervalId = setInterval(runTyping, 20000);
    }, 350);

    return () => {
      if (initialTimeoutId) {
        clearTimeout(initialTimeoutId);
      }
      if (replayIntervalId) {
        clearInterval(replayIntervalId);
      }
      if (typingIntervalId) {
        clearInterval(typingIntervalId);
      }
    };
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadLinks = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/links`);
        if (!response.ok) {
          throw new Error("Failed to load links");
        }

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const nextLinks = { ...defaultLinks };
          data.forEach((item) => {
            const label = String(item.label || "").toLowerCase();
            if (label.includes("github")) {
              nextLinks.github = { id: item._id || "", url: item.url };
            }
            if (label.includes("linkedin")) {
              nextLinks.linkedin = { id: item._id || "", url: item.url };
            }
            if (label.includes("instagram") || label.includes("insta")) {
              nextLinks.instagram = { id: item._id || "", url: item.url };
            }
            if (label.includes("email")) {
              const url = item.url.startsWith("mailto:") ? item.url : `mailto:${item.url}`;
              nextLinks.email = { id: item._id || "", url };
            }
          });
          setLinks(nextLinks);
        }
      } catch (error) {
        // Keep fallback links on failure.
      }
    };

    loadLinks();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!apiBaseUrl) return;

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/profile`);
        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();
        if (isMounted && data?.imageUrl) {
          setProfileImageUrl(data.imageUrl);
        }
      } catch (error) {
        // Keep empty state on failure.
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const trackLink = (linkId: string, label: string) => {
    if (!apiBaseUrl) return;

    fetch(`${apiBaseUrl}/links/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkId ? { id: linkId } : { label }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const typedSummary = heroTypedText.slice(0, typedCharCount);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-20 sm:py-0">
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      <div className="absolute inset-0 bg-noise opacity-15 dark:opacity-35" />
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center animate-fade-in-up">
          <div className="text-center lg:text-left">

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              Yared Abebe
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-4 sm:mb-6">
              Software Engineer | Full-Stack Developer
            </p>

            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 px-4 lg:px-0">
              <span>{typedSummary}</span>
              <span className="typing-cursor" aria-hidden="true">|</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12 px-4 lg:px-0">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg w-full sm:w-auto"
              asChild
            >
              <a href="#projects">Explore Projects</a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border/70 text-foreground hover:bg-muted backdrop-blur-sm w-full sm:w-auto"
              asChild
            >
              <a 
                href="https://drive.google.com/file/d/1hmdc2CdqYE-wWRZnYefVtXtIGrSaLgFz/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>Download Resume</span>
              </a>
            </Button>
            </div>
            
            <div className="flex gap-4 sm:gap-6 justify-center lg:justify-start">
            {links.github.url && (
              <a 
                href={links.github.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => trackLink(links.github.id, "github")}
              >
                <Github className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            )}
            {links.linkedin.url && (
              <a 
                href={links.linkedin.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => trackLink(links.linkedin.id, "linkedin")}
              >
                <Linkedin className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            )}
            {links.instagram.url && (
              <a
                href={links.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => trackLink(links.instagram.id, "instagram")}
              >
                <Instagram className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            )}
            {links.email.url && (
              <a 
                href={links.email.url} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => trackLink(links.email.id, "email")}
              >
                <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            )}
            </div>
          </div>

          {profileImageUrl && (
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card/70 p-4 shadow-2xl animate-float-gentle">
                <img
                  src={profileImageUrl}
                  alt="Portrait of Yared Abebe"
                  className="h-80 w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
