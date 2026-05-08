import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";

export function Nav() {
  const { user } = useAuth();
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo size={28} />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#system" className="hover:text-foreground transition-colors">System</a>
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="text-sm font-medium px-4 h-9 inline-flex items-center rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
              <Link to="/login" search={{ mode: "signup" }} className="text-sm font-medium px-4 h-9 inline-flex items-center rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
