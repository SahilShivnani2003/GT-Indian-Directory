"use client";

import { useState } from "react";
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  BarChart3,
} from "lucide-react";
import { listings } from "@/data/listings";
import Link from "next/link";

export default function EmployeeDashboard() {
  const [timeframe, setTimeframe] = useState("month");

  // Mock data - in real app, fetch from backend
  const employeeListings = listings.slice(0, 5);
  const totalViews = 4550;
  const previousViews = 3200;
  const totalLeads = 127;
  const previousLeads = 98;
  const avgRating = 4.3;
  const totalListings = employeeListings.length;

  const viewsChange = ((totalViews - previousViews) / previousViews) * 100;
  const leadsChange = ((totalLeads - previousLeads) / previousLeads) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg border border-border bg-linear-to-r from-primary/10 to-primary/5 p-6">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back to your Dashboard
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's what's happening with your listings today.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          View:
        </span>
        <div className="flex gap-2">
          {["day", "week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeframe === period
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Listings */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Listings</p>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalListings}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Active business listings
          </p>
        </div>

        {/* Profile Views */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Profile Views</p>
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalViews}</p>
          <p className="mt-2 flex items-center gap-1 text-xs">
            <ArrowUpRight className="h-3 w-3 text-green-600" />
            <span className="text-green-600 font-semibold">
              {viewsChange.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </p>
        </div>

        {/* Leads */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Leads Received</p>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalLeads}</p>
          <p className="mt-2 flex items-center gap-1 text-xs">
            <ArrowUpRight className="h-3 w-3 text-green-600" />
            <span className="text-green-600 font-semibold">
              {leadsChange.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </p>
        </div>

        {/* Average Rating */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Rating</p>
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{avgRating}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Out of 5.0 stars
          </p>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Listings
          </h3>
          <Link
            href="/employee/listings"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Views
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employeeListings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {listing.businessName}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {listing.categoryName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        listing.verified
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {listing.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {listing.viewCount}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/employee/listings/new"
          className="rounded-lg border border-border bg-card p-6 hover:bg-secondary transition-colors group"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Create Listing</h3>
          <p className="text-sm text-muted-foreground">
            Add a new business listing
          </p>
        </Link>

        <Link
          href="/employee/analytics"
          className="rounded-lg border border-border bg-card p-6 hover:bg-secondary transition-colors group"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">View Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Check your performance metrics
          </p>
        </Link>

        <Link
          href="/employee/leads"
          className="rounded-lg border border-border bg-card p-6 hover:bg-secondary transition-colors group"
        >
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">View Leads</h3>
          <p className="text-sm text-muted-foreground">
            Check incoming customer inquiries
          </p>
        </Link>
      </div>
    </div>
  );
}
