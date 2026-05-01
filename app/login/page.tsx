"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { User, Building2, ShieldCheck } from "lucide-react";

// Simulated role-based credentials — replace with real DB auth later
const MOCK_USERS = [
  { email: "admin@gtidirectory.com", password: "admin123", role: "admin" },
  { email: "user@gtidirectory.com", password: "user123", role: "user" },
  { email: "business@gtidirectory.com", password: "biz123", role: "business" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate async auth
    setTimeout(() => {
      const matched = MOCK_USERS.find(
        (u) => u.email === email && u.password === password,
      );

      if (!matched) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Store session info
      localStorage.setItem("authRole", matched.role);
      localStorage.setItem("authEmail", matched.email);

      // Role-based redirect
      switch (matched.role) {
        case "admin":
          router.push("/admin");
          break;
        case "business":
          router.push("/employee");
          break;
        case "user":
          router.push("/user");
          break;
        default:
          router.push("/");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Logo + Title */}
          <div className="flex flex-col items-center">
            <Image
              src="/logoBgRemoved.png"
              alt="GTID"
              width={56}
              height={56}
              className="rounded-full"
            />
            <h1 className="mt-4 text-xl font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in — your access is determined by your account role
            </p>
          </div>

          {/* Role hint pills */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            {[
              {
                label: "User",
                icon: <User className="h-3 w-3" />,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Business",
                icon: <Building2 className="h-3 w-3" />,
                color: "bg-amber-50 text-amber-700",
              },
              {
                label: "Admin",
                icon: <ShieldCheck className="h-3 w-3" />,
                color: "bg-rose-50 text-rose-700",
              },
            ].map((r) => (
              <span
                key={r.label}
                className={`flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${r.color}`}
              >
                {r.icon}
                {r.label}
              </span>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-border"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Dev hint — remove in production */}
        <div className="mt-4 rounded-xl border border-dashed border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1.5">Test credentials</p>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>User — user@gtidirectory.com / user123</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Business — business@gtidirectory.com / biz123</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>Admin — admin@gtidirectory.com / admin123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/about" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/about" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
