'use client'

import { useState } from "react"
import { Trash2, Edit2, Eye, Plus } from "lucide-react"
import { listings } from "@/data/listings"
import { DataTable } from "@/components/admin/DataTable"

export default function AdminListingsPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all")
  const [selectedListing, setSelectedListing] = useState<any>(null)

  const filteredListings = listings.filter((listing) => {
    if (filterStatus === "verified") return listing.verified
    if (filterStatus === "pending") return !listing.verified
    return true
  })

  const handleDelete = (listing: any) => {
    alert(`Delete listing: ${listing.name}`)
  }

  const handleEdit = (listing: any) => {
    setSelectedListing(listing)
  }

  const handleView = (listing: any) => {
    window.location.href = `/listings/${listing.slug}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, edit, and delete business listings
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Listing
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <div className="flex gap-2">
          {["all", "verified", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 font-normal">
                (
                {
                  status === "all"
                    ? listings.length
                    : status === "verified"
                      ? listings.filter((l) => l.verified).length
                      : listings.filter((l) => !l.verified).length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "businessName",
            label: "Business Name",
            width: "25%",
          },
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
          {
            key: "city",
            label: "City",
            width: "15%",
          },
          {
            key: "contactNumber",
            label: "Contact",
            width: "20%",
          },
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
                  className={`h-2 w-2 rounded-full ${
                    value ? "bg-india-green" : "bg-orange-500"
                  }`}
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

      {/* Edit Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Edit Listing: {selectedListing.businessName}
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedListing.businessName}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedListing.categoryName}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedListing.city}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedListing.contactNumber}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  defaultValue={selectedListing.description}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedListing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Listing updated successfully!")
                  setSelectedListing(null)
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
