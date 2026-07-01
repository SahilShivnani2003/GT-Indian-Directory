"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Clock,
  Settings,
  FileText,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  {
    label: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
  },
  {
    label: "My Listings",
    href: "/employee/listings",
    icon: Building2,
  },
  {
    label: "Analytics",
    href: "/employee/analytics",
    icon: BarChart3,
  },
  {
    label: "Performance",
    href: "/employee/performance",
    icon: TrendingUp,
  },
  {
    label: "Leads",
    href: "/employee/leads",
    icon: Clock,
  },
  {
    label: "Reports",
    href: "/employee/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/employee/settings",
    icon: Settings,
  },
];

export function EmployeeSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/employee") return pathname === "/employee";
    return pathname === href || pathname.startsWith(href + "/");
  };
  return (
    <>
      {/* Logo Section */}
      <div className="border-b border-border px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logoBgRemoved.png"
            alt="GTID Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-semibold text-foreground">GTID User</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
