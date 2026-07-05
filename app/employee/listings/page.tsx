"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Eye, Trash2, Search, Filter } from "lucide-react";
import { Listing } from "@/types/Listing";
import { listingService } from "@/service/apis/listing.service";
import { AddListingModal } from "@/components/admin/listing/AddListingModal";

export default function EmployeeListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "pending"
  >("all");
  const [employeeListings, setEmployeeListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const response = await listingService.getListing({
        pageNumber: 1,
        pageSize: 8,
      });
      if (response.data?.success) {
        setEmployeeListings(response.data?.data?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch listings: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  const filteredListings = employeeListings.filter((listing) => {
    const matchesSearch =
      listing.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === "active") matchesStatus = listing.status === "active";
    if (filterStatus === "inactive")
      matchesStatus = listing.status !== "active";
    if (filterStatus === "pending") matchesStatus = !listing.verified;

    return matchesSearch && matchesStatus;
  });

  const activeListings = employeeListings.filter(
    (l) => l.status === "active",
  ).length;
  const verifiedListings = employeeListings.filter((l) => l.verified).length;
  const totalViews = employeeListings.reduce((sum, l) => sum + l.viewCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Listings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all your business listings
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Listing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Listings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {employeeListings.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeListings}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {verifiedListings}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {totalViews}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by business name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
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
                  Rating
                </th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading listings...
                  </td>
                </tr>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {listing.businessName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing.city}, {listing.state}
                        </p>
                      </div>
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
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {listing.rating}
                        <span className="text-yellow-500 ml-1">★</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No listings found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Listing Modal */}
      <AddListingModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchListing}
      />
    </div>
  );
}