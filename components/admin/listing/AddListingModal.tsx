"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { listingService } from "@/service/apis/listing.service";
import { CreateListing } from "@/types/Listing";
import { imageService } from "@/service/apis/image.service";
import { Category } from "@/types/Category";
import { City, State } from "@/types/CityState";
import { categoryService } from "@/service/apis/category.service";
import { stateService } from "@/service/apis/state.service";

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
  featured: false,
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const selectCls = `${inputCls} disabled:cursor-not-allowed disabled:opacity-60`;

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

  // Dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Loading flags
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // The state dropdown stores a name in form.state (for submission) but we
  // need the iso code separately to look up cities for that state.
  const [selectedStateIso, setSelectedStateIso] = useState("");

  // ── Data fetchers ──

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories({ isAcitve: true });
      if (response.data?.success) {
        setCategories(response.data?.data?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch categories: ", error);
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

  // Reset form + dropdown state each time the modal opens, and load the
  // category/state lists.
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
      setImagePreviews([]);
      setImageFiles([]);
      setSelectedStateIso("");
      setCities([]);
      fetchCategories();
      fetchStates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // IMPORTANT: all hooks must run on every render, so the early return
  // happens after every useState/useEffect declaration above.
  if (!open) return null;

  const setField =
    (key: keyof CreateListing) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const selected = categories.find((c) => c.id === categoryId);
    setForm((prev) => ({
      ...prev,
      categoryId,
      categoryName: selected?.name ?? "",
    }));
    setErrors((prev) => ({
      ...prev,
      categoryId: undefined,
      categoryName: undefined,
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const iso2 = e.target.value;
    const selected = states.find((s) => s.iso2 === iso2);

    setSelectedStateIso(iso2);
    setForm((prev) => ({
      ...prev,
      state: selected?.name ?? "",
      city: "", // reset city whenever state changes
    }));
    setErrors((prev) => ({ ...prev, state: undefined, city: undefined }));
    setCities([]);
    debugger;
    if (iso2) {
      fetchCities(iso2);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, city: e.target.value }));
    setErrors((prev) => ({ ...prev, city: undefined }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const response = await imageService.uploadMultipleImages(formData);
      console.log("Image upload response: ", response.data);
      if (response.data?.success) {
        const urls = response.data?.data?.urls;
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
                <Field label="Featured Listing" error={errors.featured}>
                  <label className="flex h-[38px] items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="rounded border-border"
                    />
                    Mark this listing as featured
                  </label>
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
                <div className="sm:col-span-2">
                  <Field
                    label="Category"
                    required
                    error={errors.categoryId ?? errors.categoryName}
                  >
                    <select
                      className={selectCls}
                      value={form.categoryId}
                      onChange={handleCategoryChange}
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
                  </Field>
                </div>
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

                <Field label="State" required error={errors.state}>
                  <select
                    className={selectCls}
                    value={selectedStateIso}
                    onChange={handleStateChange}
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
                </Field>

                <Field label="City" required error={errors.city}>
                  <select
                    className={selectCls}
                    value={form.city}
                    onChange={handleCityChange}
                    disabled={!selectedStateIso || loadingCities}
                  >
                    <option value="">
                      {!selectedStateIso
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
