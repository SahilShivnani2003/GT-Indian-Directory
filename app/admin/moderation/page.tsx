'use client'

import { useState } from "react"
import { Check, X } from "lucide-react"
import { listings } from "@/data/listings"
import { Listing } from "@/types/Listing"

const pendingListings = listings.filter((l) => !l.verified)

export default function ModerationPage() {
  const [reviewingIndex, setReviewingIndex] = useState(0)

  if (pendingListings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-india-green/10 flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-india-green" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">All Caught Up!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No pending listings to review at the moment.
        </p>
      </div>
    )
  }

  const current = pendingListings[reviewingIndex]

  const handleApprove = () => {
    alert(`Approved: ${current.businessName}`)
    if (reviewingIndex < pendingListings.length - 1) {
      setReviewingIndex(reviewingIndex + 1)
    }
  }

  const handleReject = () => {
    alert(`Rejected: ${current.businessName}`)
    if (reviewingIndex < pendingListings.length - 1) {
      setReviewingIndex(reviewingIndex + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moderation Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve pending business listings
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-lg bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Review Progress
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {reviewingIndex + 1} of {pendingListings.length}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((reviewingIndex + 1) / pendingListings.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Review Card */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Image */}
        <div className="relative h-64 w-full bg-secondary overflow-hidden">
          <img
            src={current.images?.[0] || 'https://via.placeholder.com/800x400'}
            alt={current.businessName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white">{current.businessName}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Business Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Category
              </p>
              <p className="mt-1 font-semibold text-foreground">{current.categoryName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Location
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {current.city}, {current.state}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Phone
              </p>
              <p className="mt-1 font-semibold text-foreground">{current.contactNumber}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Email
              </p>
              <p className="mt-1 font-semibold text-foreground">{current.email}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Description
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Full Address
            </p>
            <p className="text-sm text-foreground">
              {current.addressLine1}
              {current.addressLine2 && `, ${current.addressLine2}`}
              , {current.area}, {current.district}, {current.city}, {current.state} - {current.pinCode}
            </p>
          </div>

          {/* Submission Info */}
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
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
        <div className="border-t border-border bg-secondary px-6 py-4 flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-india-green text-white hover:bg-india-green/90 px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <Check className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}
