"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { listingService } from "@/service/apis/listing.service";
import { Listing, CreateListing } from "@/types/Listing";
import { imageService } from "@/service/apis/image.service";
import { categoryService } from "@/service/apis/category.service";
import { stateService } from "@/service/apis/state.service";
import { Category } from "@/types/Category";
import { City, State } from "@/types/CityState";
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

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const selectCls = `${inputCls} disabled:cursor-not-allowed disabled:opacity-60`;

export default function AdminListingsPage() {
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateListing>>({});
  const [editErrors, setEditErrors] = useState<
    Partial<Record<keyof CreateListing, string>>
  >({});
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

  // ── Edit modal dropdown data ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [editSelectedStateIso, setEditSelectedStateIso] = useState("");

  // ── Edit modal image state ──
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchStates();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  // Debounce search input so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params: {
        pageNumber: number;
        pageSize: number;
        categoryId?: string;
        status?: "Active" | "Pending" | "Rejected" | "Expired";
        search?: string;
        isFeatured?: boolean;
      } = {
        pageNumber,
        pageSize: PAGE_SIZE,
      };

      // Only attach optional filters when they actually have a value —
      // omitting them (instead of sending "") avoids the backend treating
      // an empty string as an active filter.
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      if (filterCategoryId) {
        params.categoryId = filterCategoryId;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await listingService.getListing(params);
      const data = response.data?.data?.data;
      if (Array.isArray(data)) {
        setListings(data);
        setTotalCount(response.data?.data?.totalRecords ?? data.length);
      } else {
        setListings(data?.items ?? []);
        setTotalCount(data?.totalCount ?? 0);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      showToast("Failed to fetch listings.", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategoryId, debouncedSearch, pageNumber]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [filterStatus, filterCategoryId, debouncedSearch]);

  // ── Dropdown data fetchers (shared by the edit modal) ──

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories({ isAcitve: true });
      if (response.data?.success) {
        setCategories(response.data?.data?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const response = await stateService.getStates("IN");
      if (response.data?.success) {
        setStates(response.data.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (iso2: string) => {
    setLoadingCities(true);
    setCities([]);
    try {
      const response = await stateService.getCities(iso2);
      if (response.data?.success) {
        setCities(response.data.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

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

  // ── Edit modal open/close ──

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
      images: listing.images ?? [],
      addressLine1: listing.addressLine1,
      addressLine2: listing.addressLine2,
      area: listing.area,
      district: listing.district,
      city: listing.city,
      state: listing.state,
      pinCode: listing.pinCode,
      featured: listing.featured,
    });
    setEditErrors({});
    setEditImagePreviews(listing.images ?? []);

    // Find the state's iso2 from its name so the city dropdown can populate.
    // States list may not be loaded yet on first click, so fetch fresh and
    // resolve iso2 once available.
    setEditSelectedStateIso("");
    (async () => {
      setLoadingStates(true);
      try {
        const response = await stateService.getStates("IN");
        if (response.data?.success) {
          const stateList: State[] = response.data.data ?? [];
          setStates(stateList);
          const match = stateList.find((s) => s.name === listing.state);
          if (match) {
            setEditSelectedStateIso(match.iso2);
            fetchCities(match.iso2);
          }
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setLoadingStates(false);
      }
    })();

    fetchCategories();
  };

  const closeEditModal = () => {
    setSelectedListing(null);
    setEditForm({});
    setEditErrors({});
    setEditImagePreviews([]);
    setEditSelectedStateIso("");
    setCities([]);
  };

  const setEditField =
    (key: keyof CreateListing) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditForm((prev) => ({ ...prev, [key]: e.target.value }));
      setEditErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleEditCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = e.target.value;
    const selected = categories.find((c) => c.id === categoryId);
    setEditForm((prev) => ({
      ...prev,
      categoryId,
      categoryName: selected?.name ?? "",
    }));
    setEditErrors((prev) => ({
      ...prev,
      categoryId: undefined,
      categoryName: undefined,
    }));
  };

  const handleEditStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const iso2 = e.target.value;
    const selected = states.find((s) => s.iso2 === iso2);

    setEditSelectedStateIso(iso2);
    setEditForm((prev) => ({
      ...prev,
      state: selected?.name ?? "",
      city: "",
    }));
    setEditErrors((prev) => ({ ...prev, state: undefined, city: undefined }));
    setCities([]);

    if (iso2) {
      fetchCities(iso2);
    }
  };

  const handleEditCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm((prev) => ({ ...prev, city: e.target.value }));
    setEditErrors((prev) => ({ ...prev, city: undefined }));
  };

  // ── Edit modal image handling ──

  const handleEditFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const response = await imageService.uploadMultipleImages(formData);
      if (response.data?.success) {
        const urls: string[] = response.data?.data?.urls ?? [];
        setEditForm((prev) => ({
          ...prev,
          images: [...(prev.images ?? []), ...urls],
        }));
        setEditImagePreviews((prev) => [...prev, ...urls]);
      } else {
        console.error("Image upload failed:", response.data?.message);
        showToast("Failed to upload image.", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image.", "error");
    } finally {
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  };

  const removeEditImage = async (index: number) => {
    const url = editForm.images?.[index];
    if (!url) return;

    try {
      const response = await imageService.deleteImage(url);
      if (response.data?.success) {
        setEditForm((prev) => ({
          ...prev,
          images: (prev.images ?? []).filter((_, i) => i !== index),
        }));
        setEditImagePreviews((prev) => prev.filter((_, i) => i !== index));
      } else {
        console.error("Image deletion failed:", response.data?.message);
        showToast("Failed to remove image.", "error");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast("Failed to remove image.", "error");
    }
  };

  // ── Edit modal validation + save ──

  const validateEdit = (): boolean => {
    const requiredFields: (keyof CreateListing)[] = [
      "businessName",
      "description",
      "contactNumber",
      "email",
      "categoryId",
      "categoryName",
      "addressLine1",
      "area",
      "district",
      "city",
      "state",
      "pinCode",
    ];

    const next: typeof editErrors = {};

    requiredFields.forEach((key) => {
      const value = editForm[key];
      if (!value || String(value).trim() === "") {
        next[key] = "This field is required";
      }
    });

    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      next.email = "Enter a valid email address";
    }

    if (editForm.pinCode && !/^\d{6}$/.test(editForm.pinCode)) {
      next.pinCode = "PIN code must be 6 digits";
    }

    setEditErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEditSave = async () => {
    if (!selectedListing) return;
    if (!validateEdit()) return;

    setSaving(true);
    try {
      await listingService.updateListing(
        selectedListing.id,
        editForm as CreateListing,
      );
      showToast("Listing updated successfully.");
      closeEditModal();
      fetchListings();
    } catch (error) {
      console.error("Error updating listing:", error);
      showToast("Failed to update listing.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (listing: Listing) => {
    window.location.href = `/listings/${listing.id}`;
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

        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          className="ml-auto rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:ml-0"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by business name…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-64"
        />
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
          <div className="flex w-full max-w-3xl flex-col rounded-xl bg-card shadow-xl max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                Edit Listing: {selectedListing.businessName}
              </h2>
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                {/* ── Basic Information ── */}
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Business Name
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.businessName ?? ""}
                        onChange={setEditField("businessName")}
                      />
                      {editErrors.businessName && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Contact Number
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.contactNumber ?? ""}
                        onChange={setEditField("contactNumber")}
                      />
                      {editErrors.contactNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.contactNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Email Address
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        value={editForm.email ?? ""}
                        onChange={setEditField("email")}
                      />
                      {editErrors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Website
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.website ?? ""}
                        onChange={setEditField("website")}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Featured Listing
                      </label>
                      <label className="flex h-[38px] items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={editForm.featured ?? false}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                          className="rounded border-border"
                        />
                        Mark this listing as featured
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Description
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <textarea
                        className={`${inputCls} resize-none`}
                        rows={3}
                        value={editForm.description ?? ""}
                        onChange={setEditField("description")}
                      />
                      {editErrors.description && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Category ── */}
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </h3>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Category<span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <select
                      className={selectCls}
                      value={editForm.categoryId ?? ""}
                      onChange={handleEditCategoryChange}
                      disabled={loadingCategories}
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories…"
                          : "Select a category"}
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {(editErrors.categoryId || editErrors.categoryName) && (
                      <p className="mt-1 text-xs text-red-500">
                        {editErrors.categoryId ?? editErrors.categoryName}
                      </p>
                    )}
                  </div>
                </section>

                {/* ── Address ── */}
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Address Line 1
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.addressLine1 ?? ""}
                        onChange={setEditField("addressLine1")}
                      />
                      {editErrors.addressLine1 && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Address Line 2
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.addressLine2 ?? ""}
                        onChange={setEditField("addressLine2")}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Area<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.area ?? ""}
                        onChange={setEditField("area")}
                      />
                      {editErrors.area && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.area}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        District<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        value={editForm.district ?? ""}
                        onChange={setEditField("district")}
                      />
                      {editErrors.district && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.district}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        State<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <select
                        className={selectCls}
                        value={editSelectedStateIso}
                        onChange={handleEditStateChange}
                        disabled={loadingStates}
                      >
                        <option value="">
                          {loadingStates ? "Loading states…" : "Select a state"}
                        </option>
                        {states.map((s) => (
                          <option key={s.iso2} value={s.iso2}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {editErrors.state && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        City<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <select
                        className={selectCls}
                        value={editForm.city ?? ""}
                        onChange={handleEditCityChange}
                        disabled={!editSelectedStateIso || loadingCities}
                      >
                        <option value="">
                          {!editSelectedStateIso
                            ? "Select a state first"
                            : loadingCities
                              ? "Loading cities…"
                              : "Select a city"}
                        </option>
                        {cities.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {editErrors.city && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        PIN Code<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        className={inputCls}
                        maxLength={6}
                        value={editForm.pinCode ?? ""}
                        onChange={setEditField("pinCode")}
                      />
                      {editErrors.pinCode && (
                        <p className="mt-1 text-xs text-red-500">
                          {editErrors.pinCode}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Images ── */}
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Images
                  </h3>

                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleEditFileChange}
                  />

                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50"
                  >
                    <Upload className="h-6 w-6" />
                    <span>
                      <span className="font-medium text-primary">
                        Click to upload
                      </span>{" "}
                      images
                    </span>
                    <span className="text-xs">
                      PNG, JPG, WEBP supported · multiple allowed
                    </span>
                  </button>

                  {editImagePreviews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {editImagePreviews.map((src, i) => (
                        <div
                          key={`${src}-${i}`}
                          className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Listing image ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeEditImage(i)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50"
                      >
                        <Plus className="h-5 w-5" />
                        <span className="mt-1 text-xs">Add more</span>
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
