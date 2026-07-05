"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2, ImagePlus, X } from "lucide-react";
import { Category } from "@/types/Category";
import { City, State } from "@/types/CityState";
import { stateService } from "@/service/apis/state.service";
import { categoryService } from "@/service/apis/category.service";
import { listingService } from "@/service/apis/listing.service";
import { imageService } from "@/service/apis/image.service"; // adjust path if different

const MAX_IMAGES = 3;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Form shape ───────────────────────────────────────────────────────────────

interface FormData {
  businessName: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  contactNumber: string;
  email: string;
  website: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  district: string;
  cityId: string;
  stateId: string;
  stateIso2: string;
  pinCode: string;
  businessHours: string;
  yearEstablished: string;
  images: string[]; // uploaded image URLs (not raw FileList)
}

const INITIAL: FormData = {
  businessName: "",
  slug: "",
  categoryId: "",
  categoryName: "",
  contactNumber: "",
  email: "",
  website: "",
  description: "",
  addressLine1: "",
  addressLine2: "",
  area: "",
  district: "",
  cityId: "",
  stateId: "",
  stateIso2: "",
  pinCode: "",
  businessHours: "",
  yearEstablished: "",
  images: [],
};

// ── Shared class strings ──────────────────────────────────────────────────────

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

const selectCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

// ── Component ─────────────────────────────────────────────────────────────────

export default function ListBusinessPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL);

  // Remote data
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Loading flags
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Image upload state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // local blob previews, index-aligned with form.images
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Fetch states + categories on mount ─────────────────────────────────────
  useEffect(() => {
    fetchStates();
    fetchCategories();
  }, []);

  // ── Fetch cities whenever the selected state changes ────────────────────────
  useEffect(() => {
    if (form.stateIso2) {
      fetchCities(form.stateIso2);
    } else {
      setCities([]);
    }
  }, [form.stateIso2]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Data fetchers ───────────────────────────────────────────────────────────

  async function fetchStates() {
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
  }

  async function fetchCities(iso2: string) {
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
  }

  async function fetchCategories() {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories({ isAcitve: true });
      if (response.data?.success) {
        setCategories(response.data.data?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }

  // ── Image upload / removal ──────────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setImageError(null);

    const remainingSlots = MAX_IMAGES - form.images.length;
    if (remainingSlots <= 0) {
      setImageError(
        `You can upload up to ${MAX_IMAGES} images on the free plan.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setImageError(
        `Only ${remainingSlots} more image(s) allowed. The rest were skipped.`,
      );
    }

    // Show local previews immediately while the upload is in flight
    const localPreviews = filesToUpload.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...localPreviews]);
    setUploadingImages(true);

    try {
      const uploadData = new FormData();
      filesToUpload.forEach((file) => uploadData.append("files", file));

      const response = await imageService.uploadMultipleImages(uploadData);
      if (response.data?.success) {
        const urls: string[] = response.data?.data?.urls ?? [];
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      } else {
        console.error("Image upload failed:", response.data?.message);
        setImageError("Image upload failed. Please try again.");
        // Roll back the previews we optimistically added
        localPreviews.forEach((url) => URL.revokeObjectURL(url));
        setImagePreviews((prev) =>
          prev.filter((p) => !localPreviews.includes(p)),
        );
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageError("Image upload failed. Please try again.");
      localPreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews((prev) =>
        prev.filter((p) => !localPreviews.includes(p)),
      );
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async (index: number) => {
    const url = form.images[index];
    const preview = imagePreviews[index];

    try {
      if (url) {
        const response = await imageService.deleteImage(url);
        if (!response.data?.success) {
          console.error("Image deletion failed:", response.data?.message);
          setImageError("Couldn't remove that image. Please try again.");
          return;
        }
      }
      if (preview) URL.revokeObjectURL(preview);
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageError("Couldn't remove that image. Please try again.");
    }
  };

  // ── Form helpers ────────────────────────────────────────────────────────────

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBusinessNameChange(name: string) {
    setForm((prev) => ({ ...prev, businessName: name, slug: slugify(name) }));
  }

  function handleCategoryChange(id: string) {
    const cat = categories.find((c) => c.id === id);
    setForm((prev) => ({
      ...prev,
      categoryId: id,
      categoryName: cat?.name ?? "",
    }));
  }

  function handleStateChange(stateId: string) {
    const selectedState = states.find((s) => s.id === stateId);
    setForm((prev) => ({
      ...prev,
      stateId,
      stateIso2: selectedState?.iso2 ?? "",
      cityId: "",
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        businessName: form.businessName,
        slug: form.slug,
        categoryId: form.categoryId,
        categoryName: form.categoryName,
        contactNumber: form.contactNumber,
        email: form.email,
        website: form.website,
        description: form.description,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        area: form.area,
        district: form.district,
        city: form.cityId,
        state: form.stateId,
        pinCode: form.pinCode,
        images: form.images,
      };

      const response = await listingService.createListing(payload);
      if (response.data?.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      // TODO: surface an error toast/alert to the user
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-india-green/10">
            <CheckCircle className="h-8 w-8 text-india-green" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Listing Submitted!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for submitting your business. Our team will review and
            approve your listing within 24–48 hours.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Go Home
            </Link>
            <Link
              href="/listings"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────

  return (
    <>
      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            List Your Business
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get your business discovered by thousands of potential customers
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`hidden text-sm sm:inline ${
                    s <= step
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s === 1 ? "Business Info" : s === 2 ? "Location" : "Details"}
                </span>
                {s < 3 && (
                  <div
                    className={`h-0.5 w-8 transition-colors sm:w-16 ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 md:p-8"
        >
          {/* ── Step 1: Business Info ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Business Information
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  placeholder="Enter your business name"
                  className={inputCls}
                  required
                />
              </div>

              {form.slug && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Listing URL
                  </label>
                  <div className="flex h-11 items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
                    /listings/
                    <span className="ml-0.5 font-mono text-foreground">
                      {form.slug}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={form.categoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={selectCls}
                      required
                      disabled={loadingCategories}
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories…"
                          : "Select category"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {loadingCategories && (
                      <Loader2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => set("contactNumber", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="business@example.com"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Website
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://yourbusiness.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Business Description *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your business, services, and what makes you unique…"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Location ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Business Location
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)}
                  placeholder="Street address, building name"
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => set("addressLine2", e.target.value)}
                  placeholder="Floor, suite, landmark"
                  className={inputCls}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => set("area", e.target.value)}
                    placeholder="Area / locality name"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    District *
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    placeholder="e.g., South Delhi"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    State *
                  </label>
                  <div className="relative">
                    <select
                      value={form.stateId}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className={selectCls}
                      required
                      disabled={loadingStates}
                    >
                      <option value="">
                        {loadingStates ? "Loading states…" : "Select state"}
                      </option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {loadingStates && (
                      <Loader2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    City *
                  </label>
                  <div className="relative">
                    <select
                      value={form.cityId}
                      onChange={(e) => set("cityId", e.target.value)}
                      className={selectCls}
                      required
                      disabled={!form.stateId || loadingCities}
                    >
                      <option value="">
                        {!form.stateId
                          ? "Select a state first"
                          : loadingCities
                            ? "Loading cities…"
                            : "Select city"}
                      </option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {loadingCities && (
                      <Loader2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:w-1/2 sm:pr-2.5">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={form.pinCode}
                  onChange={(e) => set("pinCode", e.target.value)}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  pattern="\d{6}"
                  className={inputCls}
                  required
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Additional Details ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Additional Details
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={form.businessHours}
                  onChange={(e) => set("businessHours", e.target.value)}
                  placeholder="e.g., Mon–Sat: 9:00 AM – 6:00 PM"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Year Established
                </label>
                <input
                  type="number"
                  value={form.yearEstablished}
                  onChange={(e) => set("yearEstablished", e.target.value)}
                  placeholder="e.g., 2015"
                  min={1900}
                  max={new Date().getFullYear()}
                  className={inputCls}
                />
              </div>

              {/* ── Image upload ── */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Business Images
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploadingImages || form.images.length >= MAX_IMAGES}
                />

                {/* Dropzone / trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImages || form.images.length >= MAX_IMAGES}
                  className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-background px-4 py-8 transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {uploadingImages
                        ? "Uploading…"
                        : "Click to browse images"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG up to 5 MB each · {form.images.length}/
                      {MAX_IMAGES} used on free plan
                    </p>
                  </div>
                </button>

                {imageError && (
                  <p className="mt-2 text-xs text-destructive">{imageError}</p>
                )}

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {imagePreviews.map((src, idx) => (
                      <div
                        key={src}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Business image ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {!form.images[idx] ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                After submission your listing will have{" "}
                <span className="font-medium text-foreground">
                  status: pending
                </span>{" "}
                and will be visible once reviewed. Fields like{" "}
                <span className="font-mono">id</span>,{" "}
                <span className="font-mono">rating</span>,{" "}
                <span className="font-mono">reviewCount</span>,{" "}
                <span className="font-mono">viewCount</span>,{" "}
                <span className="font-mono">verified</span>, and{" "}
                <span className="font-mono">featured</span> are managed by the
                platform.
              </div>

              <div className="rounded-lg bg-primary/5 p-4">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    I confirm that the information provided is accurate and I
                    have the authority to list this business. I agree to the{" "}
                    <Link
                      href="/about"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/about"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={submitting || uploadingImages}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  {step < 3 ? "Continue" : "Submit Listing"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Free Listing",
              desc: "Start with a free basic listing and upgrade anytime",
            },
            {
              title: "Get Verified",
              desc: "Build trust with a verified business badge",
            },
            {
              title: "Reach Customers",
              desc: "Be discovered by thousands of potential customers",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
