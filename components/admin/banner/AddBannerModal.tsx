"use client";

import { useState, useRef } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { bannerService } from "@/service/apis/banner.service";
import { imageService } from "@/service/apis/image.service";
import { CreateBanner } from "@/types/Banner";

interface AddBannerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BANNER_TYPES: CreateBanner["bannerType"][] = [
  "Promotional",
  "Featured",
  "Opportunity",
];

const INITIAL_FORM: CreateBanner = {
  campaignName: "",
  businessName: "",
  bannerType: "Promotional",
  mediaPath: "",
  redirectUrl: "",
  title: "",
  subtitle: "",
  description: "",
  ctaText: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

const labelCls = "mb-1 block text-sm font-medium text-foreground";

export function AddBannerModal({
  open,
  onClose,
  onSuccess,
}: AddBannerModalProps) {
  const [form, setForm] = useState<CreateBanner>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  function set<K extends keyof CreateBanner>(key: K, value: CreateBanner[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetAndClose() {
    setForm(INITIAL_FORM);
    setError(null);
    onClose();
  }

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setError(null);
    try {
      const uploadData = new FormData();
      uploadData.append("files", file);
      const response = await imageService.uploadMultipleImages(uploadData);
      if (response.data?.success) {
        const url = response.data?.data?.urls?.[0];
        if (url) {
          set("mediaPath", url);
        } else {
          setError("Upload succeeded but no image URL was returned.");
        }
      } else {
        setError("Failed to upload media.");
      }
    } catch (err) {
      console.error("Error uploading media:", err);
      setError("Failed to upload media.");
    } finally {
      setUploadingMedia(false);
      e.target.value = "";
    }
  };

  const removeMedia = async () => {
    if (!form.mediaPath) return;
    try {
      await imageService.deleteImage(form.mediaPath);
    } catch (err) {
      console.error("Error deleting media:", err);
      // Non-blocking: still clear it locally even if remote delete fails
    } finally {
      set("mediaPath", "");
    }
  };

  const validate = (): string | null => {
    if (!form.campaignName.trim()) return "Campaign name is required.";
    if (!form.businessName.trim()) return "Business name is required.";
    if (!form.mediaPath) return "Please upload a banner image.";
    if (!form.startDate) return "Start date is required.";
    if (!form.endDate) return "End date is required.";
    if (form.endDate < form.startDate)
      return "End date cannot be before start date.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await bannerService.createBanner(form);
      onSuccess();
      resetAndClose();
    } catch (err) {
      console.error("Error creating banner:", err);
      setError("Failed to create banner. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add Banner</h2>
          <button
            onClick={resetAndClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          {/* Media upload */}
          <div>
            <label className={labelCls}>Banner Image *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              className="hidden"
              disabled={uploadingMedia}
            />
            <div className="flex items-center gap-3">
              {form.mediaPath ? (
                <div className="group relative h-16 w-28 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.mediaPath}
                    alt="Banner media"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-dashed border-border bg-secondary">
                  {uploadingMedia ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingMedia}
                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                {uploadingMedia
                  ? "Uploading…"
                  : form.mediaPath
                    ? "Change Image"
                    : "Upload Image"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Campaign Name *</label>
              <input
                type="text"
                value={form.campaignName}
                onChange={(e) => set("campaignName", e.target.value)}
                placeholder="e.g., Diwali Sale 2026"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Business Name *</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="e.g., Sharma Electronics"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Banner Type</label>
              <select
                value={form.bannerType}
                onChange={(e) =>
                  set(
                    "bannerType",
                    e.target.value as CreateBanner["bannerType"],
                  )
                }
                className={inputCls}
              >
                {BANNER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Redirect URL</label>
              <input
                type="url"
                value={form.redirectUrl}
                onChange={(e) => set("redirectUrl", e.target.value)}
                placeholder="https://example.com/offer"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Main headline on the banner"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                placeholder="Supporting line"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>CTA Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => set("ctaText", e.target.value)}
                placeholder="e.g., Shop Now"
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-foreground">
                  Active
                </span>
              </label>
            </div>

            <div>
              <label className={labelCls}>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                min={form.startDate || undefined}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Additional details shown with the banner"
              className={inputCls}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={resetAndClose}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingMedia}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Creating…" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
