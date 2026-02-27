import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield, UploadCloud, FileEdit, FileCheck, UserCog } from "lucide-react";

const actions = [
  {
    title: "Secure Login",
    description: "JWT-based authentication with bcrypt password hashing.",
    icon: KeyRound,
    tags: ["JWT", "bcrypt"],
  },
  {
    title: "Project Management",
    description: "Add, update, and delete project records with validation.",
    icon: FileEdit,
    tags: ["CRUD", "Validation"],
  },
  {
    title: "Certificate Control",
    description: "Manage certificates and hackathon entries from one dashboard.",
    icon: FileCheck,
    tags: ["Admin", "Catalog"],
  },
  {
    title: "Cloudinary Uploads",
    description: "Upload and optimize media assets via CDN-backed storage.",
    icon: UploadCloud,
    tags: ["CDN", "Media"],
  },
  {
    title: "Protected Routes",
    description: "Role-restricted endpoints with secure headers and CORS policies.",
    icon: Shield,
    tags: ["CORS", "Secure"],
  },
  {
    title: "Content Governance",
    description: "Maintain professional content with logs and audit-ready metadata.",
    icon: UserCog,
    tags: ["Logs", "Audit"],
  },
];

const AdminPanel = () => {
  return (
    <section id="admin" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Admin Management
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Admin tooling is designed to keep content fresh, secure, and easy to manage while
            maintaining backend performance and data integrity.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="card-glow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Admin access is restricted to authenticated users.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
