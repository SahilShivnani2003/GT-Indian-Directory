'use client'

import { StatsCard } from "@/components/admin/StateCard"
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Eye,
  MousePointer,
} from "lucide-react"

export default function AnalyticsPage() {
  // Mock analytics data
  const analyticsData = {
    totalVisitors: 45230,
    totalListings: 1250,
    totalUsers: 3420,
    totalRevenue: "₹24,50,000",
    conversionRate: "3.2%",
    avgSessionDuration: "4m 32s",
  }

  const monthlyData = [
    { month: "Jan", visitors: 8234, listings: 180, revenue: 180000 },
    { month: "Feb", visitors: 9821, listings: 220, revenue: 210000 },
    { month: "Mar", visitors: 12450, listings: 290, revenue: 245000 },
    { month: "Apr", visitors: 14230, listings: 350, revenue: 310000 },
    { month: "May", visitors: 16890, listings: 420, revenue: 380000 },
    { month: "Jun", visitors: 19450, listings: 510, revenue: 450000 },
  ]

  const topCategories = [
    { name: "Restaurants & Hotels", listings: 280, revenue: 520000 },
    { name: "Technology & IT", listings: 240, revenue: 480000 },
    { name: "Healthcare & Medical", listings: 210, revenue: 420000 },
    { name: "Real Estate", listings: 180, revenue: 360000 },
    { name: "Education", listings: 140, revenue: 280000 },
  ]

  const topCities = [
    { name: "Bangalore", listings: 320, revenue: 640000 },
    { name: "Mumbai", listings: 280, revenue: 560000 },
    { name: "Delhi", listings: 240, revenue: 480000 },
    { name: "Pune", listings: 180, revenue: 360000 },
    { name: "Hyderabad", listings: 150, revenue: 300000 },
  ]

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Visitors (30 days)"
            value={analyticsData.totalVisitors}
            subtitle="Unique visitors"
            icon={Users}
            trend={{ value: 28, isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Total Listings"
            value={analyticsData.totalListings}
            subtitle="Active businesses"
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Monthly Revenue"
            value={analyticsData.totalRevenue}
            subtitle="All subscriptions"
            icon={TrendingUp}
            trend={{ value: 18, isPositive: true }}
            color="orange"
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
          <p className="text-3xl font-bold text-foreground">
            {analyticsData.conversionRate}
          </p>
          <p className="mt-2 text-xs text-india-green">+0.5% from last month</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Avg Session Duration</p>
          <p className="text-3xl font-bold text-foreground">
            {analyticsData.avgSessionDuration}
          </p>
          <p className="mt-2 text-xs text-india-green">+45s from last month</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Page Views</p>
          <p className="text-3xl font-bold text-foreground">1,24,560</p>
          <p className="mt-2 text-xs text-india-green">+8,240 from last month</p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Monthly Trends
        </h2>
        <div className="space-y-4">
          {monthlyData.map((data) => (
            <div key={data.month}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {data.month}
                </span>
                <span className="text-sm text-muted-foreground">
                  {data.visitors.toLocaleString()} visitors
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-india-green"
                  style={{
                    width: `${(data.visitors / 20000) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories and Cities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Categories */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Top Categories
          </h2>
          <div className="space-y-4">
            {topCategories.map((category, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {category.name}
                  </p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(category.listings / 280) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right text-xs text-muted-foreground">
                  <p>{category.listings} listings</p>
                  <p className="text-india-green font-medium">₹{(category.revenue / 100000).toFixed(1)}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Top Cities
          </h2>
          <div className="space-y-4">
            {topCities.map((city, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {city.name}
                  </p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-india-green"
                      style={{
                        width: `${(city.listings / 320) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right text-xs text-muted-foreground">
                  <p>{city.listings} listings</p>
                  <p className="text-india-green font-medium">₹{(city.revenue / 100000).toFixed(1)}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          User Activity
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              New Users
            </p>
            <p className="text-3xl font-bold text-primary">245</p>
            <p className="mt-2 text-xs text-india-green">+18% this month</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Active Sessions
            </p>
            <p className="text-3xl font-bold text-india-green">892</p>
            <p className="mt-2 text-xs text-muted-foreground">Real-time</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Bounce Rate
            </p>
            <p className="text-3xl font-bold text-orange-500">28.5%</p>
            <p className="mt-2 text-xs text-destructive">-2.3% from last month</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Customer Retention
            </p>
            <p className="text-3xl font-bold text-primary">94.2%</p>
            <p className="mt-2 text-xs text-india-green">+1.5% from last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
