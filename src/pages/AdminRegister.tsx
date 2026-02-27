import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const AdminRegister = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiBaseUrl) {
      setStatus("error");
      setMessage("API URL is not configured.");
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Registration failed");
      }

      setStatus("success");
      setMessage("Registration submitted. Wait for approval before signing in.");
      setFormValues({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3 text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Admin Registration</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Submit your request and wait for approval before signing in.
          </p>
        </div>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Request Access</CardTitle>
            <CardDescription>Admin approvals are granted manually.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Submitting..." : "Submit Request"}
              </Button>
              {status === "error" && <p className="text-xs text-red-400">{message}</p>}
              {status === "success" && <p className="text-xs text-emerald-400">{message}</p>}
              <a href="/admin" className="text-xs text-muted-foreground underline">
                Back to admin login
              </a>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminRegister;
