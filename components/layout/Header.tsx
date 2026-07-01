"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingBag,
  Briefcase,
  Building2,
  LayoutGrid,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Category } from "@/types/Category";
import { categoryService } from "@/service/apis/category.service";

const navLinks = [
  { href: "/listings", label: "Listings", icon: ShoppingBag },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/product", label: "Products", icon: LayoutGrid },
  { href: "/tourist-places", label: "Tourist Places", icon: LayoutGrid },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuthStore();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    fetchCategories();
  }, []);

  const fetchCategories = async() =>{
    try{
      console.log('Fetching categories.');
      const response = await categoryService.getCategories({isAcitve: true});
      if(response.data?.success){
        console.log('category fetched successfully. ');
        setCategories(response.data?.data?.data);
      }
    }catch(error){
      console.error('Failed to fetch categories : ', error);
    }
  }
  const getDashboardHref = () => {
    switch (user?.role) {
      case "Admin":
        return "/admin";
      case "Employee":
        return "/employee";
      case "User":
        return "/user";
      default:
        return "/";
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logoBgRemoved.png"
            alt="GTID Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-foreground">
              GT India Directory
            </span>
            <span className="text-xs text-muted-foreground">
              Professional Business Network
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <LayoutGrid className="h-4 w-4" />
              Categories
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`}
              />
            </button>

            {catOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCatOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-card p-2 shadow-lg">
                  {categories && categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      onClick={() => setCatOpen(false)}
                    >
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        width={24}
                        height={24}
                        className="rounded object-cover"
                      />
                      {cat.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {cat.listingCount}
                      </span>
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-border pt-1">
                    <Link
                      href="/categories"
                      className="flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                      onClick={() => setCatOpen(false)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="flex items-center gap-2">
          <Link
            href="/list-business"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            List Business
          </Link>

          {isAuthenticated ? (
            /* ── Profile Avatar + Dropdown ── */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {/* Avatar circle */}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {getInitials()}
                </span>
                <span className="hidden max-w-[100px] truncate sm:block">
                  {user?.name ?? "Profile"}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg">
                  {/* User info header */}
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {getInitials()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user?.name ?? "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                      href={`${getDashboardHref()}/profile`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My Profile
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
              Login / Sign Up
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/categories"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutGrid className="h-4 w-4" />
                All Categories
              </Link>

              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Link
                  href="/list-business"
                  className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  List Your Business
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* Mobile: user info strip */}
                    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {getInitials()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {user?.name ?? "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.role}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={getDashboardHref()}
                      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href={`${getDashboardHref()}/profile`}
                      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}