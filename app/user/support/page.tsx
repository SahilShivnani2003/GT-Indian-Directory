"use client";

import { MessageSquare, Mail, Phone, Clock, Send } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How do I track my order?",
    answer:
      "You can track your order from the 'My Orders' section. Click on any order to see real-time tracking updates.",
  },
  {
    id: 2,
    question: "What is the return policy?",
    answer:
      "We accept returns within 7 days of delivery. Items must be in original condition with all packaging intact.",
  },
  {
    id: 3,
    question: "How can I contact a business?",
    answer:
      "Each listing has contact details including phone, email, and website. You can reach out directly from the listing page.",
  },
  {
    id: 4,
    question: "Is my personal information safe?",
    answer:
      "Yes, we use industry-standard encryption to protect your data. Your information is never shared without consent.",
  },
];

const supportChannels = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Available 9 AM - 9 PM",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    description: "support@gtidirectory.com",
    availability: "Response within 24 hours",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    description: "+91-1234-567-890",
    availability: "Available 9 AM - 6 PM",
  },
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    message: "",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Support & Help</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get help and answers to common questions
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportChannels.map((channel, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              {channel.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {channel.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {channel.description}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {channel.availability}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Send us a Message
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General Inquiry</option>
              <option value="order">Order Related</option>
              <option value="business">Business Inquiry</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="What can we help you with?"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Please describe your issue in detail..."
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors text-left"
              >
                <p className="font-medium text-foreground">{faq.question}</p>
                <span
                  className={`text-muted-foreground transition-transform ${
                    expandedFaq === faq.id ? "rotate-180" : ""
                  }`}
                >
                  ↓
                </span>
              </button>
              {expandedFaq === faq.id && (
                <div className="px-6 py-4 border-t border-border bg-secondary/50">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
