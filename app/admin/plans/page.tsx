"use client";

import { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { planService } from "@/service/apis/plans.service";
import { Plan } from "@/types/Plan";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (plan: Plan) => {
    alert(`Edit plan: ${plan.name}`);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await planService.deletePlan(planId);
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Subscription Plans
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage pricing tiers and plan features
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(loading ? [] : plans).map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border border-border bg-card p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
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
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-foreground">
                  ₹{plan.price}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  /month
                </span>
              </div>
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

            {/* Stats */}
            <div className="border-t border-border pt-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Active Subscribers</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {Math.floor(Math.random() * 200 + 50)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Revenue Summary
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Total Monthly Revenue
            </p>
            <p className="text-3xl font-bold text-india-green">₹2,45,000</p>
            <p className="mt-2 text-xs text-india-green">
              +15% from last month
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Average Plan Value
            </p>
            <p className="text-3xl font-bold text-primary">₹4,999</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Across all plans
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Total Active Subscriptions
            </p>
            <p className="text-3xl font-bold text-saffron">562</p>
            <p className="mt-2 text-xs text-saffron">+8% this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
