"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  HelpCircle,
  Settings,
  History,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/user",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "My Orders",
    href: "/user/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Saved Listings",
    href: "/user/saved",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    label: "My Reviews",
    href: "/user/reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Addresses",
    href: "/user/addresses",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    label: "History",
    href: "/user/history",
    icon: <History className="h-5 w-5" />,
  },
  {
    label: "Support",
    href: "/user/support",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function UserSidebar() {
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
