"use client";

import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Have questions? We'd love to hear from you."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Contact Info */}
          <div className="w-full lg:w-80">
            <h2 className="text-lg font-semibold text-foreground">
              Get in Touch
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our team is here to help you with any questions about listings,
              advertising, or account management.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">
                    123 Business Park, Sector 42,
                    <br />
                    Gurugram, Haryana 122001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a
                    href="tel:+911800123456"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    +91 1800-123-456
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:support@gtidirectory.com"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    support@gtidirectory.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Business Hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon - Sat: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Send a Message
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message sent! We will get back to you shortly.");
                }}
                className="mt-6 flex flex-col gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <select
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="listing">Listing Help</option>
                    <option value="advertising">Advertising</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="report">Report an Issue</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
