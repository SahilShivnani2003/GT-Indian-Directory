"use client";

import { FileText, Download, Filter, Calendar } from "lucide-react";
import { useState } from "react";

const reports = [
  {
    id: 1,
    name: "Monthly Sales Report",
    date: "May 1, 2024",
    type: "Sales",
    status: "Ready",
  },
  {
    id: 2,
    name: "Customer Feedback Summary",
    date: "Apr 30, 2024",
    type: "Feedback",
    status: "Ready",
  },
  {
    id: 3,
    name: "Analytics Report Q1 2024",
    date: "Apr 15, 2024",
    type: "Analytics",
    status: "Ready",
  },
  {
    id: 4,
    name: "Performance Metrics",
    date: "Apr 1, 2024",
    type: "Performance",
    status: "Ready",
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>("all");

  const filteredReports = reports.filter((report) => {
    if (reportType === "all") return true;
    return report.type.toLowerCase() === reportType.toLowerCase();
  });

  const reportTypes = ["all", "Sales", "Feedback", "Analytics", "Performance"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and download business reports
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                reportType === type
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {type === "all" ? "All Reports" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id.toString())}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {report.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.date}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                      {report.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Generation Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Generate Custom Report
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Report Type
              </label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Sales Report</option>
                <option>Analytics Report</option>
                <option>Customer Feedback</option>
                <option>Performance Metrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time Period
              </label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Format
              </label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Send to Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
