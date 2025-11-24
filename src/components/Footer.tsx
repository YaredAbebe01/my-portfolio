import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-base sm:text-lg font-semibold mb-2">
            Yared Abebe
          </p>
          <p className="text-white/80 mb-4">
            Software Engineering Student | Full-Stack Developer
          </p>
          <p className="text-sm text-white/60 flex items-center justify-center gap-2">
            Built with <Heart className="h-4 w-4 text-accent fill-accent" /> using React & Tailwind CSS
          </p>
          <p className="text-sm text-white/60 mt-4">
            © {new Date().getFullYear()} Yared Abebe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
