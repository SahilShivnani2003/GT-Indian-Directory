"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { bannerService } from "@/service/apis/banner.service";
import { Banner, CreateBanner } from "@/types/Banner";
import { imageService } from "@/service/apis/image.service";
import { AddBannerModal } from "@/components/admin/banner/AddBannerModal";

type TypeFilter = "all" | "Promotional" | "Featured" | "Opportunity";

const TYPE_OPTIONS: TypeFilter[] = [
  "all",
  "Promotional",
  "Featured",
  "Opportunity",
];

const PAGE_SIZE = 10;

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function AdminBannersPage() {
  const [filterType, setFilterType] = useState<TypeFilter>("all");
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateBanner>>({});
  const [banners, setBanners] = useState<Banner[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
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

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        pageNumber,
        pageSize: PAGE_SIZE,
      };
      if (filterType !== "all") {
        params.type = filterType;
      }

      const response = await bannerService.getBanners(params);
      const data = response.data?.data?.data;
      // Support both paginated ({ items, totalCount }) and plain array responses
      if (Array.isArray(data)) {
        setBanners(data);
        setTotalCount(response.data?.data?.totalRecords ?? data.length);
      } else {
        setBanners(data?.items ?? []);
        setTotalCount(data?.totalCount ?? 0);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      showToast("Failed to fetch banners.", "error");
    } finally {
      setLoading(false);
    }
  }, [filterType, pageNumber]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [filterType]);

  const handleDelete = (banner: Banner) => {
    setDeleteConfirm(banner);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await bannerService.deleteBanner(deleteConfirm.id);
      showToast(`"${deleteConfirm.campaignName}" deleted successfully.`);
      setDeleteConfirm(null);
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      showToast("Failed to delete banner.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setEditForm({
      campaignName: banner.campaignName,
      businessName: banner.businessName,
      bannerType: banner.bannerType,
      mediaPath: banner.mediaPath,
      redirectUrl: banner.redirectUrl,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.ctaText,
      startDate: banner.startDate?.slice(0, 10),
      endDate: banner.endDate?.slice(0, 10),
      isActive: banner.isActive,
    });
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const uploadData = new FormData();
      uploadData.append("files", file);
      const response = await imageService.uploadMultipleImages(uploadData);
      if (response.data?.success) {
        const url = response.data?.data?.urls?.[0];
        if (url) {
          setEditForm((prev) => ({ ...prev, mediaPath: url }));
        }
      } else {
        showToast("Failed to upload media.", "error");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      showToast("Failed to upload media.", "error");
    } finally {
      setUploadingMedia(false);
      e.target.value = "";
    }
  };

  const handleEditSave = async () => {
    if (!selectedBanner) return;
    setSaving(true);
    try {
      await bannerService.updateBanner(
        selectedBanner.id,
        editForm as CreateBanner,
      );
      showToast("Banner updated successfully.");
      setSelectedBanner(null);
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      showToast("Failed to update banner.", "error");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const typeCounts = {
    all: totalCount,
    Promotional: banners.filter((b) => b.bannerType === "Promotional").length,
    Featured: banners.filter((b) => b.bannerType === "Featured").length,
    Opportunity: banners.filter((b) => b.bannerType === "Opportunity").length,
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
          <h1 className="text-2xl font-bold text-foreground">Manage Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and schedule promotional banners
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter:
        </span>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className="ml-1 font-normal">
                ({typeCounts[type] ?? 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Loading banners…
        </div>
      ) : (
        <DataTable
          columns={[
            {
              key: "mediaPath",
              label: "Preview",
              width: "10%",
              render: (value) =>
                value ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={value}
                    alt=""
                    className="h-10 w-16 rounded-md object-cover border border-border"
                  />
                ) : (
                  <div className="h-10 w-16 rounded-md bg-secondary" />
                ),
            },
            { key: "campaignName", label: "Campaign", width: "18%" },
            { key: "businessName", label: "Business", width: "16%" },
            {
              key: "bannerType",
              label: "Type",
              width: "13%",
              render: (value) => (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {value}
                </span>
              ),
            },
            {
              key: "startDate",
              label: "Starts",
              width: "11%",
              render: (value) => formatDate(value),
            },
            {
              key: "endDate",
              label: "Ends",
              width: "11%",
              render: (value) => formatDate(value),
            },
            {
              key: "isActive",
              label: "Active",
              width: "10%",
              render: (value) => (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    value ? "text-india-green" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      value ? "bg-india-green" : "bg-gray-400"
                    }`}
                  />
                  {value ? "Active" : "Inactive"}
                </span>
              ),
            },
          ]}
          data={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

      {/* Add Banner Modal */}
      <AddBannerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchBanners}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              Delete Banner
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteConfirm.campaignName}
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
      {selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Edit Banner: {selectedBanner.campaignName}
            </h2>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {/* Media */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Media
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  id="edit-banner-media-input"
                />
                <div className="flex items-center gap-3">
                  {editForm.mediaPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editForm.mediaPath}
                      alt="Banner media"
                      className="h-16 w-28 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="h-16 w-28 rounded-lg border border-dashed border-border bg-secondary" />
                  )}
                  <label
                    htmlFor="edit-banner-media-input"
                    className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {uploadingMedia ? "Uploading…" : "Change Image"}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { label: "Campaign Name", field: "campaignName" },
                    { label: "Business Name", field: "businessName" },
                    { label: "Redirect URL", field: "redirectUrl" },
                    { label: "Title", field: "title" },
                    { label: "Subtitle", field: "subtitle" },
                    { label: "CTA Text", field: "ctaText" },
                  ] as { label: string; field: keyof CreateBanner }[]
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

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Banner Type
                  </label>
                  <select
                    value={editForm.bannerType ?? "Promotional"}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        bannerType: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Promotional">Promotional</option>
                    <option value="Featured">Featured</option>
                    <option value="Opportunity">Opportunity</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editForm.startDate ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isActive ?? false}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Active
                  </span>
                </label>
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
                onClick={() => setSelectedBanner(null)}
                disabled={saving}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving || uploadingMedia}
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
