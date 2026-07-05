"use client";

import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X, Star, Loader2 } from "lucide-react";
import { planService } from "@/service/apis/plans.service";
import { Plan, CreatePlan } from "@/types/Plan";

const emptyForm: CreatePlan = {
  planCode: "",
  name: "",
  description: "",
  durationDays: 30,
  price: 0,
  discountPrice: 0,
  features: [],
  maxListings: 0,
  maxImages: 0,
  featuredListing: false,
  prioritySupport: false,
  isActive: true,
  isPopular: false,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<CreatePlan>(emptyForm);
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await planService.getPlans();
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setFeaturesText("");
    setIsModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      planCode: plan.planCode,
      name: plan.name,
      description: plan.description,
      durationDays: plan.durationDays,
      price: plan.price,
      discountPrice: plan.discountPrice,
      features: plan.features,
      maxListings: plan.maxListings,
      maxImages: plan.maxImages,
      featuredListing: plan.featuredListing,
      prioritySupport: plan.prioritySupport,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
    });
    setFeaturesText(plan.features.join("\n"));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleFormChange = <K extends keyof CreatePlan>(
    key: K,
    value: CreatePlan[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: CreatePlan = { ...form, features };

    setSaving(true);
    try {
      if (editingPlan) {
        const response = await planService.updatePlan(editingPlan.id, payload);
        const updated = response.data?.data;
        setPlans((prev) =>
          prev.map((p) =>
            p.id === editingPlan.id ? { ...p, ...(updated ?? payload) } : p,
          ),
        );
      } else {
        const response = await planService.createPlan(payload);
        const created: Plan | undefined = response.data?.data;
        if (created) {
          setPlans((prev) => [...prev, created]);
        } else {
          // Fallback: refetch if API doesn't return the created record
          await fetchPlans();
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert(`Failed to ${editingPlan ? "update" : "create"} plan`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await planService.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan");
    }
  };

  const totalRevenue = plans.reduce(
    (sum, p) => sum + (p.discountPrice || p.price) * 0,
    0,
  ); // placeholder aggregation until a subscribers-per-plan field exists from the API

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage pricing tiers and plan features
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {loading && (
          <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading plans...
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No plans yet. Create your first plan to get started.
          </div>
        )}

        {!loading &&
          plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-border bg-card p-6 flex flex-col relative"
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3" />
                  Popular
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {plan.name}
                    </h3>
                    {!plan.isActive && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    ₹{plan.discountPrice || plan.price}
                  </span>
                  {plan.discountPrice > 0 &&
                    plan.discountPrice < plan.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{plan.price}
                      </span>
                    )}
                  <span className="text-sm text-muted-foreground">
                    /{plan.durationDays} days
                  </span>
                </div>
                {plan.savings > 0 && (
                  <p className="mt-1 text-xs text-india-green">
                    Save ₹{plan.savings}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limits */}
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Max Listings</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {plan.maxListings}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Images</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {plan.maxImages}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingPlan ? "Edit Plan" : "Create Plan"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded hover:bg-secondary text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Plan Code">
                  <input
                    className="input"
                    value={form.planCode}
                    onChange={(e) =>
                      handleFormChange("planCode", e.target.value)
                    }
                  />
                </Field>
                <Field label="Name">
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  className="input"
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Duration (days)">
                  <input
                    type="number"
                    className="input"
                    value={form.durationDays}
                    onChange={(e) =>
                      handleFormChange("durationDays", Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Price (₹)">
                  <input
                    type="number"
                    className="input"
                    value={form.price}
                    onChange={(e) =>
                      handleFormChange("price", Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Discount Price (₹)">
                  <input
                    type="number"
                    className="input"
                    value={form.discountPrice}
                    onChange={(e) =>
                      handleFormChange("discountPrice", Number(e.target.value))
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Max Listings">
                  <input
                    type="number"
                    className="input"
                    value={form.maxListings}
                    onChange={(e) =>
                      handleFormChange("maxListings", Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Max Images">
                  <input
                    type="number"
                    className="input"
                    value={form.maxImages}
                    onChange={(e) =>
                      handleFormChange("maxImages", Number(e.target.value))
                    }
                  />
                </Field>
              </div>

              <Field label="Features (one per line)">
                <textarea
                  className="input"
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={"Priority listing\n24/7 support\n..."}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Checkbox
                  label="Featured Listing"
                  checked={form.featuredListing}
                  onChange={(v) => handleFormChange("featuredListing", v)}
                />
                <Checkbox
                  label="Priority Support"
                  checked={form.prioritySupport}
                  onChange={(v) => handleFormChange("prioritySupport", v)}
                />
                <Checkbox
                  label="Active"
                  checked={form.isActive}
                  onChange={(v) => handleFormChange("isActive", v)}
                />
                <Checkbox
                  label="Mark as Popular"
                  checked={form.isPopular}
                  onChange={(v) => handleFormChange("isPopular", v)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.name || !form.planCode}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingPlan ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Revenue Summary
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Total Plans</p>
            <p className="text-3xl font-bold text-foreground">{plans.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Average Plan Value
            </p>
            <p className="text-3xl font-bold text-primary">
              ₹
              {plans.length
                ? Math.round(
                    plans.reduce(
                      (sum, p) => sum + (p.discountPrice || p.price),
                      0,
                    ) / plans.length,
                  )
                : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Active Plans</p>
            <p className="text-3xl font-bold text-saffron">
              {plans.filter((p) => p.isActive).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
      {label}
    </label>
  );
}
