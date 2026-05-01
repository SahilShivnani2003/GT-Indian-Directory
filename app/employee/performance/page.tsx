"use client";

import {
  TrendingUp,
  Award,
  Heart,
  Star,
  Target,
  Zap,
  Calendar,
} from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Performance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your business performance and improvement areas
        </p>
      </div>

      {/* Performance Score */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-primary/10 to-blue-500/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <p className="text-5xl font-bold text-foreground">8.5/10</p>
            <p className="mt-2 text-sm text-green-600">
              ↑ Improved by 0.8 points this month
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">85%</p>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Response Rate",
            value: "94%",
            change: "+2%",
            icon: (
              <Zap className="h-5 w-5 text-yellow-600" />
            ),
            color: "bg-yellow-100",
          },
          {
            label: "Customer Satisfaction",
            value: "4.6/5",
            change: "+0.3",
            icon: (
              <Heart className="h-5 w-5 text-red-600" />
            ),
            color: "bg-red-100",
          },
          {
            label: "Listing Completeness",
            value: "92%",
            change: "+5%",
            icon: (
              <Target className="h-5 w-5 text-green-600" />
            ),
            color: "bg-green-100",
          },
          {
            label: "Review Score",
            value: "4.3/5",
            change: "+0.5",
            icon: (
              <Star className="h-5 w-5 text-blue-600" />
            ),
            color: "bg-blue-100",
          },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className={`h-10 w-10 rounded-lg ${metric.color} flex items-center justify-center mb-3`}>
              {metric.icon}
            </div>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {metric.value}
            </p>
            <p className="mt-2 text-xs text-green-600">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Fast response time to customer inquiries",
              "High-quality product images and descriptions",
              "Excellent customer reviews and ratings",
              "Consistent business presence",
              "Regular listing updates",
            ].map((strength, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-green-600 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-foreground">
              Areas to Improve
            </h3>
          </div>
          <ul className="space-y-3">
            {[
              "Increase social media engagement",
              "Add more detailed business information",
              "Improve response time during peak hours",
              "Expand service area coverage",
              "Regular promotional updates",
            ].map((area, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          This Month vs Last Month
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              metric: "Profile Views",
              current: "2,450",
              previous: "1,890",
              change: "+29.6%",
            },
            {
              metric: "Customer Inquiries",
              current: "127",
              previous: "98",
              change: "+29.6%",
            },
            {
              metric: "Conversion Rate",
              current: "2.1%",
              previous: "1.8%",
              change: "+16.7%",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-secondary/50 p-4 border border-border"
            >
              <p className="text-sm text-muted-foreground mb-2">
                {item.metric}
              </p>
              <p className="text-2xl font-bold text-foreground mb-2">
                {item.current}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Previous: {item.previous}
                </span>
                <span className="text-green-600 font-semibold">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
