"use client";

import { Calendar, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockHistory = [
  {
    id: 1,
    action: "Viewed",
    business: "Tech World Electronics",
    date: "2024-04-20",
    time: "2:30 PM",
  },
  {
    id: 2,
    action: "Saved",
    business: "Style Hub Fashion",
    date: "2024-04-20",
    time: "1:15 PM",
  },
  {
    id: 3,
    action: "Called",
    business: "Home Decor Plus",
    date: "2024-04-19",
    time: "4:45 PM",
  },
  {
    id: 4,
    action: "Reviewed",
    business: "Tech World Electronics",
    date: "2024-04-18",
    time: "10:20 AM",
  },
  {
    id: 5,
    action: "Viewed",
    business: "Home Decor Plus",
    date: "2024-04-17",
    time: "3:10 PM",
  },
];

const actionColors: { [key: string]: string } = {
  Viewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Saved: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Called: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Reviewed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.business
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAction =
      filterAction === "all" || item.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = ["all", ...new Set(mockHistory.map((h) => h.action))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Activity History</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your recent activities and interactions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action === "all"
                  ? "All Activities"
                  : action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredHistory.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    actionColors[item.action]
                  }`}
                >
                  {item.action}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium">{item.business}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </span>
                  <span>{item.time}</span>
                </div>
              </div>
              <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No activity found</p>
        </div>
      )}
    </div>
  );
}
