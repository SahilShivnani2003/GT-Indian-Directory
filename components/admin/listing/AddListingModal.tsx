"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { listingService } from "@/service/apis/listing.service";
import { CreateListing } from "@/types/Listing";
import { imageService } from "@/service/apis/image.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddListingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: CreateListing = {
  businessName: "",
  description: "",
  contactNumber: "",
  email: "",
  website: "",
  categoryId: "",
  categoryName: "",
  images: [],
  addressLine1: "",
  addressLine2: "",
  area: "",
  district: "",
  city: "",
  state: "",
  pinCode: "",
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AddListingModal({
  open,
  onClose,
  onSuccess,
}: AddListingModalProps) {
  const [form, setForm] = useState<CreateListing>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateListing, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form each time the modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [open]);

  if (!open) return null;

  // ── Helpers ──

  const setField =
    (key: keyof CreateListing) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      const response = await imageService.uploadMultipleImages(files);

      if (response.data?.success) {
        const urls = response.data.urls;
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      } else {
        console.error("Image upload failed: ", response.data?.message);
      }
    } catch (error) {
      console.error("Error handling file change: ", error);
    }
    const previews = files.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = async (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    try {
      const response = await imageService.deleteImage(form.images[index]);

      if (response.data?.success) {
        setForm((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      } else {
        console.error("Image deletion failed: ", response.data?.message);
      }
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  // ── Validation ──

  const validate = (): boolean => {
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

    const next: typeof errors = {};

    requiredFields.forEach((key) => {
      if (!form[key] || String(form[key]).trim() === "") {
        next[key] = "This field is required";
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }

    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      next.pinCode = "PIN code must be 6 digits";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await listingService.createListing(form);

      if (response.data?.success) {
        console.log("Listing created successfully : ", response.data);
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Failed to create listing:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-3xl flex-col rounded-xl bg-card shadow-xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Add New Listing
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fill in the details to create a new business listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {/* ── Basic Information ── */}
            <section>
              <SectionHeading>Basic Information</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Business Name"
                  required
                  error={errors.businessName}
                >
                  <input
                    className={inputCls}
                    placeholder="e.g. Sharma Electronics"
                    value={form.businessName}
                    onChange={setField("businessName")}
                  />
                </Field>

                <Field
                  label="Contact Number"
                  required
                  error={errors.contactNumber}
                >
                  <input
                    className={inputCls}
                    placeholder="+91 98765 43210"
                    value={form.contactNumber}
                    onChange={setField("contactNumber")}
                  />
                </Field>

                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="business@example.com"
                    value={form.email}
                    onChange={setField("email")}
                  />
                </Field>

                <Field label="Website" error={errors.website}>
                  <input
                    className={inputCls}
                    placeholder="https://example.com"
                    value={form.website}
                    onChange={setField("website")}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Description"
                    required
                    error={errors.description}
                  >
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={3}
                      placeholder="Brief description of the business..."
                      value={form.description}
                      onChange={setField("description")}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* ── Category ── */}
            <section>
              <SectionHeading>Category</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category ID" required error={errors.categoryId}>
                  <input
                    className={inputCls}
                    placeholder="e.g. cat_electronics"
                    value={form.categoryId}
                    onChange={setField("categoryId")}
                  />
                </Field>

                <Field
                  label="Category Name"
                  required
                  error={errors.categoryName}
                >
                  <input
                    className={inputCls}
                    placeholder="e.g. Electronics"
                    value={form.categoryName}
                    onChange={setField("categoryName")}
                  />
                </Field>
              </div>
            </section>

            {/* ── Address ── */}
            <section>
              <SectionHeading>Address</SectionHeading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="Address Line 1"
                    required
                    error={errors.addressLine1}
                  >
                    <input
                      className={inputCls}
                      placeholder="House / Shop No., Street Name"
                      value={form.addressLine1}
                      onChange={setField("addressLine1")}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Address Line 2" error={errors.addressLine2}>
                    <input
                      className={inputCls}
                      placeholder="Landmark, Building (optional)"
                      value={form.addressLine2 ?? ""}
                      onChange={setField("addressLine2")}
                    />
                  </Field>
                </div>

                <Field label="Area" required error={errors.area}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Connaught Place"
                    value={form.area}
                    onChange={setField("area")}
                  />
                </Field>

                <Field label="District" required error={errors.district}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Central Delhi"
                    value={form.district}
                    onChange={setField("district")}
                  />
                </Field>

                <Field label="City" required error={errors.city}>
                  <input
                    className={inputCls}
                    placeholder="e.g. New Delhi"
                    value={form.city}
                    onChange={setField("city")}
                  />
                </Field>

                <Field label="State" required error={errors.state}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Delhi"
                    value={form.state}
                    onChange={setField("state")}
                  />
                </Field>

                <Field label="PIN Code" required error={errors.pinCode}>
                  <input
                    className={inputCls}
                    placeholder="e.g. 110001"
                    maxLength={6}
                    value={form.pinCode}
                    onChange={setField("pinCode")}
                  />
                </Field>
              </div>
            </section>

            {/* ── Images ── */}
            <section>
              <SectionHeading>Images</SectionHeading>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Drop zone / trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
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

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
