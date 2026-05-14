import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" ? "signup" : "signin") as "signup" | "signin",
  }),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in · Leads Up" },
      { name: "description", content: "Sign in to your Leads Up dashboard." },
    ],
  }),
});

function LoginPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
    } catch {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen grid-bg bg-background text-foreground flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <header className="relative px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-2"><Logo /></Link>
      </header>
      <div className="relative flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-elevated">
            <h1 className="text-2xl font-semibold tracking-tight text-gradient">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignup ? "Start booking more revenue in minutes." : "Sign in to your Leads Up dashboard."}
            </p>

            <button
              onClick={onGoogle}
              disabled={busy}
              className="mt-6 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-colors text-sm font-medium disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {isSignup && (
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
              )}
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full h-11 inline-flex items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground font-medium shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-60"
              >
                {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "New to Leads Up?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
