"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, HelpCircle, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { Plan } from "@/types/Plan";
import { planService } from "@/service/apis/plans.service";

const faqs = [
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining duration.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
  },
  {
    question: "Is there a free trial for premium plans?",
    answer:
      "We offer a 7-day money-back guarantee on all paid plans. If you are not satisfied, we will refund your payment.",
  },
  {
    question: "How does the featured listing work?",
    answer:
      "Featured listings appear at the top of search results and category pages with a special badge, giving your business maximum visibility.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel anytime from your dashboard. Your listing will remain active until the end of your billing period.",
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);

  useEffect(()=>{
    fetchPlans();
  },[])
  const fetchPlans = async() =>{
    try{

      console.log('Fetching plans')
      const response = await planService.getActivePlans();
      if(response.data?.success){
        console.log('Plans fetched successfully');
        setPlans(response.data?.data);
      }
    }catch(error){
      console.error('Error while fetching plans : ', error);
    }
  }
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Choose the plan that fits your business needs
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans && plans
            .filter((plan) => plan.isActive)
            .map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card p-6",
                  plan.isPopular
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border",
                )}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-foreground">
                      Free
                    </span>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          ₹{plan.discountPrice.toLocaleString()}
                        </span>
                        {plan.discountPrice < plan.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{plan.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          /year
                        </span>
                      </div>
                      {plan.savings > 0 && (
                        <p className="mt-0.5 text-xs font-medium text-green-600">
                          Save ₹{plan.savings.toLocaleString()}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.featuredListing && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      ⭐ Featured
                    </span>
                  )}
                  {plan.prioritySupport && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      🎧 Priority Support
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {plan.maxListings >= 9999 ? "Unlimited" : plan.maxListings}{" "}
                    listing{plan.maxListings !== 1 ? "s" : ""}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {plan.maxImages >= 9999 ? "Unlimited" : plan.maxImages}{" "}
                    images
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/list-business"
                  className={cn(
                    "mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors",
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border text-foreground hover:bg-secondary",
                  )}
                >
                  {plan.price === 0 ? "Get Started Free" : "Choose Plan"}
                </Link>
              </div>
            ))}
        </div>
      </section>

      {/* Comparison Banner */}
      <section className="bg-primary/5 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center md:p-12">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Not sure which plan to choose?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with our Free plan and upgrade as your business grows. No
              hidden charges, no commitments.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/list-business"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you need to know about our plans
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Secure Payments",
                desc: "256-bit SSL encrypted payment processing",
              },
              {
                title: "Money-Back Guarantee",
                desc: "7-day full refund if you are not satisfied",
              },
              {
                title: "24/7 Support",
                desc: "Our team is always ready to help you",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
