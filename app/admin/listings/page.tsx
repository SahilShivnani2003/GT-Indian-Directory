"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { listingService } from "@/service/apis/listing.service";
import { Listing, CreateListing } from "@/types/Listing";
import { AddListingModal } from "@/components/admin/listing/AddListingModal";

type StatusFilter = "all" | "Active" | "Pending" | "Rejected" | "Expired";

const STATUS_OPTIONS: StatusFilter[] = [
  "all",
  "Active",
  "Pending",
  "Rejected",
  "Expired",
];

const PAGE_SIZE = 10;

export default function AdminListingsPage() {
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateListing>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Listing | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        pageNumber,
        pageSize: PAGE_SIZE,
        categoryId: "",
        search: "",
        isFeatured: false,
      };
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      const response = await listingService.getListing(params);
      const data = response.data?.data;
      // Support both paginated ({ items, totalCount }) and plain array responses
      if (Array.isArray(data)) {
        setListings(data);
        setTotalCount(data.length);
      } else {
        setListings(data?.items || []);
        setTotalCount(data?.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      showToast("Failed to fetch listings.", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, pageNumber]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [filterStatus]);

  const handleDelete = (listing: Listing) => {
    setDeleteConfirm(listing);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await listingService.deleteListing(deleteConfirm.id);
      showToast(`"${deleteConfirm.businessName}" deleted successfully.`);
      setDeleteConfirm(null);
      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      showToast("Failed to delete listing.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setEditForm({
      businessName: listing.businessName,
      description: listing.description,
      contactNumber: listing.contactNumber,
      email: listing.email,
      website: listing.website,
      categoryId: listing.categoryId,
      categoryName: listing.categoryName,
      images: listing.images,
      addressLine1: listing.addressLine1,
      addressLine2: listing.addressLine2,
      area: listing.area,
      district: listing.district,
      city: listing.city,
      state: listing.state,
      pinCode: listing.pinCode,
    });
  };

  const handleEditSave = async () => {
    if (!selectedListing) return;
    setSaving(true);
    try {
      await listingService.updateListing(
        selectedListing.id,
        editForm as CreateListing,
      );
      showToast("Listing updated successfully.");
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error("Error updating listing:", error);
      showToast("Failed to update listing.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (listing: Listing) => {
    window.location.href = `/listings/${listing.slug}`;
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const statusCounts = {
    all: totalCount,
    Active: listings.filter((l) => l.status === "Active").length,
    Pending: listings.filter((l) => l.status === "Pending").length,
    Rejected: listings.filter((l) => l.status === "Rejected").length,
    Expired: listings.filter((l) => l.status === "Expired").length,
  };

  const statusColor: Record<string, string> = {
    Active: "text-india-green",
    Pending: "text-orange-600",
    Rejected: "text-red-600",
    Expired: "text-muted-foreground",
  };

  const statusDot: Record<string, string> = {
    Active: "bg-india-green",
    Pending: "bg-orange-500",
    Rejected: "bg-red-500",
    Expired: "bg-gray-400",
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[100] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === "success" ? "bg-india-green" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

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
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter:
        </span>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
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
                ({statusCounts[status] ?? 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Loading listings…
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "businessName", label: "Business Name", width: "22%" },
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
            { key: "city", label: "City", width: "13%" },
            { key: "contactNumber", label: "Contact", width: "18%" },
            {
              key: "status",
              label: "Status",
              width: "12%",
              render: (value: string) => (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    statusColor[value] ?? "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${statusDot[value] ?? "bg-gray-400"}`}
                  />
                  {value}
                </span>
              ),
            },
            {
              key: "featured",
              label: "Featured",
              width: "10%",
              render: (value) => (
                <span
                  className={`text-xs font-medium ${
                    value ? "text-india-green" : "text-muted-foreground"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </span>
              ),
            },
          ]}
          data={listings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(pageNumber - 1) * PAGE_SIZE + 1}–
            {Math.min(pageNumber * PAGE_SIZE, totalCount)} of {totalCount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - pageNumber) <= 1,
              )
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPageNumber(p as number)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      pageNumber === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      <AddListingModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchListings}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              Delete Listing
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteConfirm.businessName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Edit Listing: {selectedListing.businessName}
            </h2>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { label: "Business Name", field: "businessName" },
                    { label: "Category", field: "categoryName" },
                    { label: "Contact Number", field: "contactNumber" },
                    { label: "Email", field: "email" },
                    { label: "Website", field: "website" },
                    { label: "Address Line 1", field: "addressLine1" },
                    { label: "Address Line 2", field: "addressLine2" },
                    { label: "Area", field: "area" },
                    { label: "District", field: "district" },
                    { label: "City", field: "city" },
                    { label: "State", field: "state" },
                    { label: "Pin Code", field: "pinCode" },
                  ] as { label: string; field: keyof CreateListing }[]
                ).map(({ label, field }) => (
                  <div key={field}>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(editForm[field] as string) ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={editForm.description ?? ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedListing(null)}
                disabled={saving}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
