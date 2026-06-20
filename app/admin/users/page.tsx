"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { Status, User } from "@/types/User";
import { authService } from "@/service/apis/auth.service";
import UserFormModal from "@/components/admin/user/UserFormModal";

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; user: User };

const STATUS_STYLES: Record<Status, string> = {
  Active: "bg-india-green/10 text-india-green",
  Inactive: "bg-orange-500/10 text-orange-600",
  Pending: "bg-yellow-100 text-yellow-800",
  Draft: "bg-gray-100 text-gray-500",
};

// API requires pagination params — bump pageSize if you need more
// than this many users loaded for client-side table display.
const PAGE_NUMBER = 1;
const PAGE_SIZE = 100;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getAllUser({
        role: "User",
        pageNumber: PAGE_NUMBER,
        pageSize: PAGE_SIZE,
      });
      if (response.data?.success) {
        setUsers(response.data.data?.data ?? []);
      } else {
        alert("Failed to fetch users. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await authService.deleteUser(id);
      if (response.data?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user. Please try again.");
    }
  };

  const handleModalSuccess = () => {
    setModal({ mode: "closed" });
    fetchUsers();
  };

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Users Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage registered users and their profiles
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {loading ? "—" : users.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">
            {loading ? "—" : activeUsers}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {loading ? "—" : inactiveUsers}
          </p>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading users…
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "User Name", width: "18%" },
            { key: "email", label: "Email", width: "22%" },
            { key: "contactNumber", label: "Phone", width: "15%" },
            { key: "city", label: "City", width: "12%" },
            { key: "state", label: "State", width: "12%" },
            {
              key: "status",
              label: "Status",
              width: "12%",
              render: (value) => {
                // API may not return status — guard against undefined
                const status = value as Status | undefined;
                if (!status) {
                  return (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500">
                      —
                    </span>
                  );
                }
                return (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
                  >
                    {status}
                  </span>
                );
              },
            },
          ]}
          data={users}
          onEdit={(item) => setModal({ mode: "edit", user: item })}
          onDelete={(item) => handleDelete(item.id)}
        />
      )}

      {/* Add / Edit Modal */}
      {modal.mode !== "closed" && (
        <UserFormModal
          user={modal.mode === "edit" ? modal.user : null}
          onClose={() => setModal({ mode: "closed" })}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
