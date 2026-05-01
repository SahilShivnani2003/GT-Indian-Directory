"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FolderOpen,
  CreditCard,
  BarChart3,
  CheckCircle,
  MapPin,
  Package,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/listings", icon: ShoppingBag, label: "Listings" },
  { href: "/admin/moderation", icon: CheckCircle, label: "Moderation Queue" },
  { href: "/admin/users", icon: Users, label: "Business Users" },
  { href: "/admin/employees", icon: Users, label: "Employees" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/subcategories", icon: FolderOpen, label: "Subcategories" },
  { href: "/admin/tourist-places", icon: MapPin, label: "Tourist Places" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/plans", icon: CreditCard, label: "Plans" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Logo Section */}
      <div className="border-b border-border px-6 py-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logoBgRemoved.png"
            alt="GTID Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-semibold text-foreground">GTID Admin</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
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
