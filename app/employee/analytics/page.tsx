"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const viewsData = [
  { date: "Mon", views: 320, leads: 12 },
  { date: "Tue", views: 450, leads: 18 },
  { date: "Wed", views: 380, leads: 15 },
  { date: "Thu", views: 520, leads: 22 },
  { date: "Fri", views: 650, leads: 28 },
  { date: "Sat", views: 580, leads: 20 },
  { date: "Sun", views: 420, leads: 14 },
];

const categoryData = [
  { name: "Electronics", value: 2400 },
  { name: "Fashion", value: 1200 },
  { name: "Home & Furniture", value: 950 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your business performance and engagement
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Period:
        </span>
        <div className="flex gap-2">
          {["7 Days", "30 Days", "90 Days", "Year"].map((period) => (
            <button
              key={period}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Views & Leads Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Views & Leads Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" />
            <Bar dataKey="leads" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Views by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Click-Through Rate</p>
            <p className="mt-2 text-3xl font-bold text-foreground">3.8%</p>
            <p className="mt-2 text-xs text-green-600">↑ 0.5% from last month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Average Time on Page</p>
            <p className="mt-2 text-3xl font-bold text-foreground">2m 34s</p>
            <p className="mt-2 text-xs text-green-600">↑ 15 sec from last month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="mt-2 text-3xl font-bold text-foreground">1.2%</p>
            <p className="mt-2 text-xs text-red-600">↓ 0.2% from last month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Monthly Revenue Impact</p>
            <p className="mt-2 text-3xl font-bold text-foreground">₹45,200</p>
            <p className="mt-2 text-xs text-green-600">↑ ₹8,500 from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
