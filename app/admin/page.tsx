"use client";

import { DataTable } from "@/components/admin/DataTable";
import { StatsCard } from "@/components/admin/StateCard";
import { listings } from "@/data/listings";
import { plans } from "@/data/plans";
import {
  ShoppingBag,
  Users,
  FolderOpen,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";

const recentListings = listings.slice(0, 5);
const pendingListings = listings.filter((l) => !l.verified).slice(0, 5);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Listings"
            value={listings.length}
            subtitle="Active business directories"
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Verified Listings"
            value={listings.filter((l) => l.verified).length}
            subtitle="Approved & live"
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Pending Review"
            value={listings.filter((l) => !l.verified).length}
            subtitle="Awaiting approval"
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
            color="orange"
          />
          <StatsCard
            title="Total Users"
            value="1,234"
            subtitle="Registered members"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            color="purple"
          />
        </div>
      </div>

      {/* Revenue & Subscriptions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Subscription Plans
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {plan.name}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                ₹{plan.price}
              </p>
              <p className="mt-2 text-sm text-foreground">
                {(Math.random() * 150 + 50).toFixed(0)} active subscribers
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Listings
          </h2>
          <a
            href="/admin/listings"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Business Name", width: "35%" },
            {
              key: "category",
              label: "Category",
              render: (value) => (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {value}
                </span>
              ),
            },
            {
              key: "city",
              label: "Location",
            },
            {
              key: "verified",
              label: "Status",
              render: (value) => (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    value ? "text-india-green" : "text-orange-600"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      value ? "bg-india-green" : "bg-orange-500"
                    }`}
                  />
                  {value ? "Verified" : "Pending"}
                </span>
              ),
            },
          ]}
          data={recentListings}
          searchable={false}
        />
      </div>

      {/* Pending Moderation */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Pending Moderation
          </h2>
          <a
            href="/admin/moderation"
            className="text-sm font-medium text-primary hover:underline"
          >
            Review Queue
          </a>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Business Name", width: "35%" },
            {
              key: "category",
              label: "Category",
              render: (value) => (
                <span className="inline-flex items-center rounded-full bg-saffron/10 px-2.5 py-1 text-xs font-medium text-saffron">
                  {value}
                </span>
              ),
            },
            {
              key: "city",
              label: "Location",
            },
            {
              key: "createdAt",
              label: "Submitted",
              render: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={pendingListings}
          searchable={false}
        />
      </div>
    </div>
  );
}
