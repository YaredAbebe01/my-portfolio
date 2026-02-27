const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-8 sm:py-12 px-4 sm:px-6 border-t border-border/60">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-base sm:text-lg font-semibold mb-2">
            Yared Abebe
          </p>
          <p className="text-muted-foreground mb-4">
            Software Engineering Student | Full-Stack Developer
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} Yared Abebe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
