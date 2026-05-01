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

const menuItems = [
  {
    label: "Dashboard",
    href: "/employee",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "My Listings",
    href: "/employee/listings",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/employee/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Performance",
    href: "/employee/performance",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Leads",
    href: "/employee/leads",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Reports",
    href: "/employee/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/employee/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function EmployeeSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
