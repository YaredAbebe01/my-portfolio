import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Github, Instagram, Linkedin, Send } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const defaultLinks = {
  email: { id: "", url: "" },
  phone: { id: "", url: "" },
  github: { id: "", url: "" },
  linkedin: { id: "", url: "" },
  instagram: { id: "", url: "" },
};

const Contact = () => {
  const [links, setLinks] = useState(defaultLinks);
  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
            if (label.includes("phone")) {
              const url = item.url.startsWith("tel:") ? item.url : `tel:${item.url}`;
              nextLinks.phone = { id: item._id || "", url };
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

  const trackLink = (linkId: string, label: string) => {
    if (!apiBaseUrl) return;

    fetch(`${apiBaseUrl}/links/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkId ? { id: linkId } : { label }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setStatus("error");
      setErrorMessage("API URL is not configured.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Unable to send your message.");
      }

      setStatus("success");
      setFormValues({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };
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
        
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <Card className="p-6 sm:p-8 card-glow flex flex-col items-center text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary">
              Contact Information
            </h3>

            <div className="space-y-6 w-full flex flex-col items-center text-center">
              {links.email.url && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-2">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a
                    href={links.email.url}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => trackLink(links.email.id, "email")}
                  >
                    {links.email.url.replace("mailto:", "")}
                  </a>
                </div>
              )}
              {links.phone.url && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-2">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <a
                    href={links.phone.url}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => trackLink(links.phone.id, "phone")}
                  >
                    {links.phone.url.replace("tel:", "")}
                  </a>
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-muted-foreground">Addis Ababa, Ethiopia</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border w-full flex flex-col items-center text-center">
              <h4 className="font-semibold mb-4">Connect With Me</h4>
              <div className="flex gap-4 justify-center">
                {links.github.url && (
                  <a
                    href={links.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    onClick={() => trackLink(links.github.id, "github")}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {links.linkedin.url && (
                  <a
                    href={links.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    onClick={() => trackLink(links.linkedin.id, "linkedin")}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {links.instagram.url && (
                  <a
                    href={links.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    onClick={() => trackLink(links.instagram.id, "instagram")}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {links.email.url && (
                  <a
                    href={links.email.url}
                    className="w-12 h-12 bg-muted hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    onClick={() => trackLink(links.email.id, "email")}
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 card-glow">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary text-center">
              Send a Message
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formValues.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={status === "loading"}>
                <Send className="mr-2 h-4 w-4" />
                {status === "loading" ? "Sending..." : "Send Message"}
              </Button>
              {status === "success" && (
                <p className="text-xs text-emerald-400 text-center">
                  Message sent successfully. I will reply soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400 text-center">{errorMessage}</p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
