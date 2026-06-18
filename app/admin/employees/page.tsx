"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Building2,
  Briefcase,
  Clock,
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { User } from "@/types/User";
import { authService } from "@/service/apis/auth.service";
import UserFormModal from "@/components/admin/user/UserFormModal";

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; user: User };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Active" | "Inactive" |  'Pending' | 'Draft'
  >("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await authService.getAllUser({ role: "Employee" });
      if (response.data?.success) {
        setEmployees(response.data.users ?? []);
      } else {
        alert("Failed to fetch employees. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("An error occurred while fetching employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee record?"))
      return;
    try {
      const response = await authService.deleteUser(id);
      if (response.data?.success) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete employee. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee. Please try again.");
    }
  };

  /** Called by UserFormModal on successful add or edit */
  const handleModalSuccess = (savedEmployee: User) => {
    if (modal.mode === "edit") {
      setEmployees((prev) =>
        prev.map((e) => (e.id === savedEmployee.id ? savedEmployee : e)),
      );
    } else {
      setEmployees((prev) => [savedEmployee, ...prev]);
    }
    setModal({ mode: "closed" });
  };

  // Derived counts — always safe since employees is initialised to []
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive",
  ).length;

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.contactNumber.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Employee Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage team members and employee profiles
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {loading ? "—" : employees.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {loading ? "—" : activeEmployees}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="mt-2 text-3xl font-bold text-gray-600">
                {loading ? "—" : inactiveEmployees}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "Active" | "Inactive" | "Pending" | "Draft")
            }
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Active ">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading employees…
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Employee Name", width: "20%" },
            { key: "email", label: "Email", width: "20%" },
            { key: "contactNumber", label: "Contact", width: "15%" },
            { key: "role", label: "Role", width: "12%" },
            {
              key: "status",
              label: "Status",
              width: "13%",
              render: (value) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    value === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }`}
                >
                  {(value as string).charAt(0).toUpperCase() +
                    (value as string).slice(1)}
                </span>
              ),
            },
            { key: "createdAt", label: "Joined", width: "12%" },
          ]}
          data={filteredEmployees}
          onEdit={(item) => setModal({ mode: "edit", user: item as User })}
          onDelete={(item) => handleDelete((item as User).id)}
        />
      )}

      {/* Add / Edit Modal — role defaults to "Employee" in add mode */}
      {modal.mode !== "closed" && (
        <UserFormModal
          user={modal.mode === "edit" ? modal.user : null}
          defaultRole="Employee"
          onClose={() => setModal({ mode: "closed" })}
          onSuccess={()=>fetchEmployees()}
        />
      )}
    </div>
  );
}
