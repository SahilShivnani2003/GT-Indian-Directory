"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";

// ─── Types ──────────────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
}

interface Order {
  id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
}

// ─── Static sample data ─────────────────────────────────────────────────────

const STATIC_ORDERS: Order[] = [
  {
    id: "1",
    orderId: "ORD-1001",
    userName: "Rohit Sharma",
    userEmail: "rohit.sharma@example.com",
    items: [
      { name: "Wireless Mouse", quantity: 2, price: 799 },
      { name: "USB-C Hub", quantity: 1, price: 1499 },
    ],
    subtotal: 3097,
    tax: 279,
    shippingCost: 49,
    totalAmount: 3425,
    paymentStatus: "completed",
    orderStatus: "delivered",
    shippingAddress: {
      addressLine1: "12 MG Road",
      city: "Gwalior",
      state: "Madhya Pradesh",
      pinCode: "474001",
    },
  },
  {
    id: "2",
    orderId: "ORD-1002",
    userName: "Priya Verma",
    userEmail: "priya.verma@example.com",
    items: [{ name: "Office Chair", quantity: 1, price: 6499 }],
    subtotal: 6499,
    tax: 585,
    shippingCost: 199,
    totalAmount: 7283,
    paymentStatus: "pending",
    orderStatus: "pending",
    shippingAddress: {
      addressLine1: "45 Lake View Apartments",
      addressLine2: "Near City Mall",
      city: "Indore",
      state: "Madhya Pradesh",
      pinCode: "452001",
    },
  },
  {
    id: "3",
    orderId: "ORD-1003",
    userName: "Arjun Mehta",
    userEmail: "arjun.mehta@example.com",
    items: [
      { name: "Bluetooth Headphones", quantity: 1, price: 2999 },
      { name: "Phone Case", quantity: 3, price: 299 },
    ],
    subtotal: 3896,
    tax: 350,
    shippingCost: 0,
    totalAmount: 4246,
    paymentStatus: "failed",
    orderStatus: "cancelled",
    shippingAddress: {
      addressLine1: "78 Park Street",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pinCode: "462001",
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(STATIC_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [draftPaymentStatus, setDraftPaymentStatus] =
    useState<Order["paymentStatus"]>("pending");
  const [draftOrderStatus, setDraftOrderStatus] =
    useState<Order["orderStatus"]>("pending");

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "pending",
  ).length;
  const completedOrders = orders.filter(
    (o) => o.orderStatus === "delivered",
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setDraftPaymentStatus(order.paymentStatus);
    setDraftOrderStatus(order.orderStatus);
  };

  const closeOrder = () => setSelectedOrder(null);

  const saveOrderChanges = () => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              paymentStatus: draftPaymentStatus,
              orderStatus: draftOrderStatus,
            }
          : o,
      ),
    );
    closeOrder();
  };

  const handleDelete = (item: unknown) => {
    const order = item as Order;
    if (!confirm(`Delete order ${order.orderId}?`)) return;
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Orders Management
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {orders.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-500">
            {pendingOrders}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="mt-2 text-3xl font-bold text-india-green">
            {completedOrders}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            ₹{(totalRevenue / 100000).toFixed(2)}L
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={[
          { key: "orderId", label: "Order ID", width: "15%" },
          { key: "userName", label: "Customer", width: "18%" },
          {
            key: "items",
            label: "Items",
            width: "18%",
            render: (value: OrderItem[]) => (
              <div>
                <p className="text-sm font-medium text-foreground">
                  {value.length} item(s)
                </p>
                <p className="text-xs text-muted-foreground">
                  {value[0]?.name}
                </p>
              </div>
            ),
          },
          {
            key: "totalAmount",
            label: "Amount",
            width: "12%",
            render: (value: number) => (
              <span className="font-semibold text-foreground">₹{value}</span>
            ),
          },
          {
            key: "paymentStatus",
            label: "Payment",
            width: "12%",
            render: (value: string) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === "completed"
                    ? "bg-india-green/10 text-india-green"
                    : value === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
          {
            key: "orderStatus",
            label: "Status",
            width: "12%",
            render: (value: string) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === "delivered"
                    ? "bg-india-green/10 text-india-green"
                    : value === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : value === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
        ]}
        data={orders}
        onEdit={(item) => openOrder(item as Order)}
        onDelete={handleDelete}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Order Details: {selectedOrder.orderId}
              </h2>
              <button
                onClick={closeOrder}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Customer Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedOrder.userName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedOrder.userEmail}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ₹{selectedOrder.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">₹{selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    ₹{selectedOrder.shippingCost}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-primary">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.pinCode}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Payment Status
                  </label>
                  <select
                    value={draftPaymentStatus}
                    onChange={(e) =>
                      setDraftPaymentStatus(
                        e.target.value as Order["paymentStatus"],
                      )
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Order Status
                  </label>
                  <select
                    value={draftOrderStatus}
                    onChange={(e) =>
                      setDraftOrderStatus(
                        e.target.value as Order["orderStatus"],
                      )
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeOrder}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Close
              </button>
              <button
                onClick={saveOrderChanges}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
