"use client";

import { Plus, Edit2, Trash2, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const mockAddresses = [
  {
    id: 1,
    name: "Home",
    street: "221B Ashok Nagar",
    landmark: "Near Hanuman Temple",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462022",
    phone: "+91-9876543210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    street: "45 Corporate Avenue",
    landmark: "Near IT Park",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462011",
    phone: "+91-9876543210",
    isDefault: false,
  },
  {
    id: 3,
    name: "Parent's Place",
    street: "12 Rajendra Nagar",
    landmark: "Near Bus Stand",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    phone: "+91-9876543211",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Add New Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address Label
              </label>
              <input
                type="text"
                placeholder="e.g., Home, Office"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91-"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Street Address
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Landmark
              </label>
              <input
                type="text"
                placeholder="Nearby landmark (optional)"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                State
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pincode
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="default" />
              <label
                htmlFor="default"
                className="text-sm text-muted-foreground"
              >
                Set as default address
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAddresses.map((address) => (
          <div
            key={address.id}
            className={`rounded-lg border-2 p-6 transition-all ${
              address.isDefault
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {address.name}
              </h3>
              {address.isDefault && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Default
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
              <p>{address.street}</p>
              {address.landmark && <p>{address.landmark}</p>}
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {address.phone}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-destructive/20 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
