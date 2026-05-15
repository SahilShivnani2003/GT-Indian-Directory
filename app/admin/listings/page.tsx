"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { listingService } from "@/service/apis/listing.service";
import { Listing } from "@/types/Listing";
import { AddListingModal } from "@/components/admin/listing/AddListingModal";

export default function AdminListingsPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "pending"
  >("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await listingService.getListing();
      setListings(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleDelete = (listing: Listing) => {
    alert(`Delete listing: ${listing.businessName}`);
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleView = (listing: Listing) => {
    window.location.href = `/listings/${listing.slug}`;
  };

  const filteredListings = listings.filter((l) => {
    if (filterStatus === "verified") return l.verified;
    if (filterStatus === "pending") return !l.verified;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage Listings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, edit, and delete business listings
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Listing
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter:
        </span>
        <div className="flex gap-2">
          {(["all", "verified", "pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 font-normal">
                (
                {status === "all"
                  ? listings.length
                  : status === "verified"
                    ? listings.filter((l) => l.verified).length
                    : listings.filter((l) => !l.verified).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: "businessName", label: "Business Name", width: "25%" },
          {
            key: "categoryName",
            label: "Category",
            width: "15%",
            render: (value) => (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {value}
              </span>
            ),
          },
          { key: "city", label: "City", width: "15%" },
          { key: "contactNumber", label: "Contact", width: "20%" },
          {
            key: "verified",
            label: "Status",
            width: "15%",
            render: (value) => (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  value ? "text-india-green" : "text-orange-600"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${value ? "bg-india-green" : "bg-orange-500"}`}
                />
                {value ? "Verified" : "Pending"}
              </span>
            ),
          },
        ]}
        data={filteredListings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Add Listing Modal */}
      <AddListingModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchListings}
      />

      {/* Edit Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Edit Listing: {selectedListing.businessName}
            </h2>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Business Name",
                    value: selectedListing.businessName,
                  },
                  { label: "Category", value: selectedListing.categoryName },
                  { label: "City", value: selectedListing.city },
                  { label: "Phone", value: selectedListing.contactNumber },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <input
                      type="text"
                      defaultValue={value}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  defaultValue={selectedListing.description}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedListing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Listing updated successfully!");
                  setSelectedListing(null);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
