"use client";

import { MessageSquare, Mail, Phone, Trash2, Archive, CheckCircle } from "lucide-react";
import { useState } from "react";

const mockLeads = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543210",
    message: "Interested in your electronics store. Can you provide more details?",
    source: "Website",
    date: "2 hours ago",
    status: "new",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91-8765432109",
    message: "Looking for bulk orders. Please contact me for discussion.",
    source: "Phone",
    date: "4 hours ago",
    status: "contacted",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91-7654321098",
    message: "Want to schedule a store visit. Available weekends.",
    source: "Website",
    date: "1 day ago",
    status: "new",
  },
];

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "contacted">(
    "all"
  );

  const filteredLeads = mockLeads.filter((lead) => {
    if (filterStatus === "all") return true;
    return lead.status === filterStatus;
  });

  const newLeads = mockLeads.filter((l) => l.status === "new").length;
  const contactedLeads = mockLeads.filter((l) => l.status === "contacted").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Leads</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customer inquiries and follow-ups
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {mockLeads.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">New Leads</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{newLeads}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Contacted</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {contactedLeads}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "new", "contacted"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background text-foreground hover:bg-secondary"
            }`}
          >
            {status === "all"
              ? "All Leads"
              : status === "new"
                ? "New"
                : "Contacted"}
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {lead.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    lead.status === "new"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {lead.status === "new" ? "New" : "Contacted"}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{lead.message}</p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Source: {lead.source}</span>
                <span>{lead.date}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  Mark as Contacted
                </button>
                <button className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {selectedLead.name}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="text-foreground mt-1">{selectedLead.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="text-foreground">{selectedLead.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="text-foreground">{selectedLead.date}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>
              <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
