"use client";

import { useState } from "react";
import { Save, X, Shield, Bell, Eye } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {["profile", "security", "notifications", "privacy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Tech World Electronics"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="business@gtidirectory.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <input
                type="tel"
                defaultValue="+91-9876543210"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Website
              </label>
              <input
                type="url"
                defaultValue="https://techworld.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Description
            </label>
            <textarea
              defaultValue="Your one-stop shop for latest electronics, mobiles, and accessories."
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          {saveSuccess && (
            <div className="rounded-lg bg-green-100 p-4 text-green-800 text-sm">
              ✓ Changes saved successfully
            </div>
          )}
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-border">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Change Password</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update your password regularly to keep your account secure
              </p>
              <button className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Change Password
              </button>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
              <button className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          {[
            {
              title: "Email Notifications",
              description: "Receive email updates about your listings",
              enabled: true,
            },
            {
              title: "SMS Alerts",
              description: "Get SMS alerts for important updates",
              enabled: true,
            },
            {
              title: "Lead Notifications",
              description: "Get notified when you receive new leads",
              enabled: true,
            },
            {
              title: "Weekly Report",
              description: "Receive weekly performance reports",
              enabled: false,
            },
            {
              title: "Marketing Emails",
              description: "Receive tips and promotional content",
              enabled: false,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between pb-4 border-b border-border last:border-0"
            >
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={item.enabled}
                className="mt-1 h-5 w-5 rounded border-border cursor-pointer"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === "privacy" && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          {[
            {
              title: "Public Profile",
              description: "Allow your profile to be visible to other users",
              enabled: true,
            },
            {
              title: "Show Contact Information",
              description: "Display your contact details on listings",
              enabled: true,
            },
            {
              title: "Analytics Sharing",
              description: "Share anonymous analytics with GTID",
              enabled: false,
            },
            {
              title: "Data Collection",
              description:
                "Allow collection of browsing data for personalization",
              enabled: false,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between pb-4 border-b border-border last:border-0"
            >
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={item.enabled}
                className="mt-1 h-5 w-5 rounded border-border cursor-pointer"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}
