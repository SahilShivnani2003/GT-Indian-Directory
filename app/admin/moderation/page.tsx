"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { listingService } from "@/service/apis/listing.service";
import { Listing } from "@/types/Listing";

export default function ModerationPage() {
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [reviewingIndex, setReviewingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [processed, setProcessed] = useState<
    Record<string, "Approved" | "Rejected">
  >({});

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPendingListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listingService.getListing({
        pageNumber: 1,
        pageSize: 100,
        categoryId: "",
        status: "Pending",
        search: "",
        isFeatured: false,
      });
      const data = response.data?.data?.data;
      const items: Listing[] = Array.isArray(data) ? data : (data?.items ?? []);
      setPendingListings(items);
      setReviewingIndex(0);
    } catch (error) {
      console.error("Error fetching pending listings:", error);
      showToast("Failed to load pending listings.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingListings();
  }, [fetchPendingListings]);

  const current = pendingListings[reviewingIndex];

  const goNext = () => {
    if (reviewingIndex < pendingListings.length - 1) {
      setReviewingIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (reviewingIndex > 0) {
      setReviewingIndex((i) => i - 1);
    }
  };

  const handleApprove = async () => {
    if (!current || actionLoading) return;
    setActionLoading("approve");
    try {
      await listingService.updateStatus(current.id, "Active");
      setProcessed((prev) => ({ ...prev, [current.id]: "Approved" }));
      showToast(`"${current.businessName}" approved successfully.`);
      goNext();
    } catch (error) {
      console.error("Error approving listing:", error);
      showToast("Failed to approve listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!current || actionLoading) return;
    setActionLoading("reject");
    try {
      await listingService.updateStatus(current.id, "Rejected");
      setProcessed((prev) => ({ ...prev, [current.id]: "Rejected" }));
      showToast(`"${current.businessName}" rejected.`, "error");
      goNext();
    } catch (error) {
      console.error("Error rejecting listing:", error);
      showToast("Failed to reject listing.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
        Loading moderation queue…
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (pendingListings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-india-green/10">
          <Check className="h-6 w-6 text-india-green" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          All Caught Up!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No pending listings to review at the moment.
        </p>
      </div>
    );
  }

  const processedStatus = current ? processed[current.id] : null;
  const processedCount = Object.keys(processed).length;
  const totalReviewed = processedCount;
  const approvedCount = Object.values(processed).filter(
    (v) => v === "Approved",
  ).length;
  const rejectedCount = Object.values(processed).filter(
    (v) => v === "Rejected",
  ).length;

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
            Moderation Queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and approve pending business listings
          </p>
        </div>
        {/* Session stats */}
        {totalReviewed > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-india-green/10 px-3 py-1 font-medium text-india-green">
              ✓ {approvedCount} Approved
            </span>
            <span className="rounded-full bg-red-500/10 px-3 py-1 font-medium text-red-500">
              ✗ {rejectedCount} Rejected
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Review Progress
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {reviewingIndex + 1} of {pendingListings.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((reviewingIndex + 1) / pendingListings.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Review Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-secondary">
          <img
            src={
              current.images?.[0] ||
              "https://placehold.co/800x400?text=No+Image"
            }
            alt={current.businessName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Already-processed badge */}
          {processedStatus && (
            <div
              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white ${
                processedStatus === "Approved" ? "bg-india-green" : "bg-red-500"
              }`}
            >
              {processedStatus}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-white">
              {current.businessName}
            </h2>
            {current.featured && (
              <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-yellow-900">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Business Details */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Category
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {current.categoryName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Location
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {current.city}, {current.state}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Phone
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {current.contactNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Email
              </p>
              <p className="mt-1 break-all font-semibold text-foreground">
                {current.email}
              </p>
            </div>
          </div>

          {/* Website */}
          {current.website && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Website
              </p>
              <a
                href={current.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                {current.website}
              </a>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Description
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {current.description}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Full Address
            </p>
            <p className="text-sm text-foreground">
              {current.addressLine1}
              {current.addressLine2 && `, ${current.addressLine2}`}
              {current.area && `, ${current.area}`}
              {current.district && `, ${current.district}`}
              {`, ${current.city}, ${current.state}`}
              {current.pinCode && ` - ${current.pinCode}`}
            </p>
          </div>

          {/* Submission Info */}
          <div className="rounded-lg bg-secondary p-4">
            <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Submitted On
            </p>
            <p className="text-sm text-foreground">
              {new Date(current.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-border bg-secondary px-6 py-4">
          {/* Prev / Next navigation */}
          <button
            onClick={goPrev}
            disabled={reviewingIndex === 0}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <button
            onClick={handleReject}
            disabled={!!actionLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/20 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            {actionLoading === "reject" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Reject
          </button>

          <button
            onClick={handleApprove}
            disabled={!!actionLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-india-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-india-green/90 disabled:opacity-50"
          >
            {actionLoading === "approve" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approve
          </button>

          <button
            onClick={goNext}
            disabled={reviewingIndex === pendingListings.length - 1}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      {pendingListings.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pendingListings.map((listing, idx) => {
            const status = processed[listing.id];
            return (
              <button
                key={listing.id}
                onClick={() => setReviewingIndex(idx)}
                className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === reviewingIndex
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={
                    listing.images?.[0] || "https://placehold.co/80x56?text=?"
                  }
                  alt={listing.businessName}
                  className="h-14 w-20 object-cover"
                />
                {status && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/40`}
                  >
                    {status === "Approved" ? (
                      <Check className="h-5 w-5 text-india-green" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
