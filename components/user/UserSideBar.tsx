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
import Image from "next/image";

const menuItems = [
  { label: "Dashboard", href: "/user", icon: LayoutDashboard, exact: true },
  { label: "My Orders", href: "/user/orders", icon: ShoppingCart },
  { label: "Saved Listings", href: "/user/saved", icon: Heart },
  { label: "My Reviews", href: "/user/reviews", icon: Star },
  { label: "Addresses", href: "/user/addresses", icon: MapPin },
  { label: "History", href: "/user/history", icon: History },
  { label: "Support", href: "/user/support", icon: HelpCircle },
  { label: "Settings", href: "/user/settings", icon: Settings },
];

export function UserSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
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
