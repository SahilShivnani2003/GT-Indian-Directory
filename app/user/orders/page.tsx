"use client";

import { Search, Filter, Truck, Package, CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const mockOrders = [
  {
    id: "ORD-001",
    business: "Tech World Electronics",
    amount: "₹5,299",
    status: "Delivered",
    date: "2024-04-15",
    item: "Mobile Phone Case",
    location: "Bhopal, MP",
    tracking: "Delivered on Apr 20",
  },
  {
    id: "ORD-002",
    business: "Style Hub Fashion",
    amount: "₹2,499",
    status: "In Transit",
    date: "2024-04-18",
    item: "Designer Shirt",
    location: "Indore, MP",
    tracking: "Out for delivery",
  },
  {
    id: "ORD-003",
    business: "Home Decor Plus",
    amount: "₹12,599",
    status: "Processing",
    date: "2024-04-20",
    item: "Furniture Set",
    location: "Bhopal, MP",
    tracking: "Order confirmed",
  },
  {
    id: "ORD-004",
    business: "Tech World Electronics",
    amount: "₹3,899",
    status: "Delivered",
    date: "2024-04-10",
    item: "USB Cable",
    location: "Bhopal, MP",
    tracking: "Delivered on Apr 12",
  },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "processing" | "in-transit" | "delivered">("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.business.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (filterStatus !== "all") {
      matchesStatus = order.status.toLowerCase().replace(" ", "-") === filterStatus;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "In Transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "In Transit":
        return <Truck className="h-4 w-4" />;
      case "Processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all your orders
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{mockOrders.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Processing</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {mockOrders.filter((o) => o.status === "Processing").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">In Transit</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {mockOrders.filter((o) => o.status === "In Transit").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {mockOrders.filter((o) => o.status === "Delivered").length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID or business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {order.business}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Order {order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {order.amount}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium mt-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-foreground mb-3">
                    {order.item}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {order.location}
                    </div>
                    <div className="text-muted-foreground">
                      Order Date: {order.date}
                    </div>
                    <div className="text-muted-foreground">
                      {order.tracking}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    Track Order
                  </button>
                  <button className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    Contact Seller
                  </button>
                  {order.status === "Delivered" && (
                    <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
