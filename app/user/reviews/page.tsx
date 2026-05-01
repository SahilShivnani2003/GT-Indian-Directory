"use client";

import { Star, MessageSquare, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

const mockReviews = [
  {
    id: 1,
    business: "Tech World Electronics",
    rating: 5,
    title: "Excellent service!",
    content:
      "Great selection of products and friendly staff. Highly recommended!",
    date: "2024-04-15",
    helpful: 12,
  },
  {
    id: 2,
    business: "Style Hub Fashion",
    rating: 4,
    title: "Good quality, fast delivery",
    content: "Items are as described. Delivery was quick and packaging was good.",
    date: "2024-04-10",
    helpful: 8,
  },
  {
    id: 3,
    business: "Home Decor Plus",
    rating: 5,
    title: "Amazing furniture!",
    content: "Perfect quality and design. Exactly what I was looking for.",
    date: "2024-04-05",
    helpful: 15,
  },
];

export default function ReviewsPage() {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your reviews and ratings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {mockReviews.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">4.7/5</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Helpful Votes</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {mockReviews.reduce((sum, r) => sum + r.helpful, 0)}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {review.business}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.rating}.0 rating
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {review.date}
              </span>
            </div>

            <h4 className="font-semibold text-foreground mb-2">
              {review.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {review.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="h-4 w-4" />
                {review.helpful} found helpful
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(review.id)}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-destructive/20 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review CTA */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 text-center">
        <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Share Your Experience
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help other customers by leaving reviews for businesses you've
          visited
        </p>
        <button className="rounded-lg bg-yellow-600 px-6 py-2 text-sm font-semibold text-white hover:bg-yellow-700 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
}
