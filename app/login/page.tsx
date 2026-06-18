"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Building2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/service/apis/auth.service";
import  { User } from "@/types/User";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = {
        contactNumber: phone,
        password: password,
      };
      const response = await authService.login(data);   
      
      if (response.data?.success) {
        console.log("Login successful : ", response.data);
        const user : User = response.data?.data?.user;
        const token = response.data?.data?.token;

        setAuth(user, token);

        switch (user?.role) {
          case "Admin":
            router.push("/admin");
            break;
          case "Employee":
            router.push("/employee");
            break;
          case "User":
            router.push("/user");
            break;
          default:
            router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Login error : ", error);
      setError(
        error?.message || "An error occurred during login. Please try again.",
      );
      setLoading(false);
      return;
    }
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
                icon: <UserIcon className="h-3 w-3" />,
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
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoComplete="tel"
                maxLength={10}
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
