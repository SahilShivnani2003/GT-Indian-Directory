"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { UserSidebar } from "@/components/user/UserSideBar";
import { useState } from "react";
import Image from "next/image";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("authRole");
    localStorage.removeItem("authEmail");
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } border-r border-border bg-card overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/logoBgRemoved.png"
              alt="GTID"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="font-bold text-foreground">GTID</span>
          </div>
          <UserSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Account
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your profile and orders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <UserIcon className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
