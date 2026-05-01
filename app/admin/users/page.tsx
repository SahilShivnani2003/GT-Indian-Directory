'use client'

import { useState } from 'react'
import { Edit, Trash2, X } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { users } from '@/data/users'
import { User } from '@/types/User'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users_, setUsers] = useState<User[]>(users)

  const handleStatusChange = (id: string, newStatus: string) => {
    setUsers(users_.map((u) => (u.id === id ? { ...u, status: newStatus as 'active' | 'inactive' } : u)))
    alert(`User status updated to ${newStatus}`)
  }

  const handleDelete = (id: string) => {
    setUsers(users_.filter((u) => u.id !== id))
    alert(`User deleted`)
  }

  const activeUsers = users_.filter((u) => u.status === 'active').length
  const inactiveUsers = users_.filter((u) => u.status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage registered users and their profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{users_.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">{activeUsers}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">{inactiveUsers}</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: 'name', label: 'User Name', width: '18%' },
          { key: 'email', label: 'Email', width: '22%' },
          { key: 'contactNumber', label: 'Phone', width: '15%' },
          { key: 'city', label: 'City', width: '12%' },
          { key: 'state', label: 'State', width: '12%' },
          {
            key: 'status',
            label: 'Status',
            width: '12%',
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === 'active'
                    ? 'bg-india-green/10 text-india-green'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
        ]}
        data={users_}
        onEdit={(item) => setSelectedUser(item)}
        onDelete={(item) => handleDelete(item.id)}
      />

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-card p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit User: {selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input type="text" defaultValue={selectedUser.name} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input type="email" defaultValue={selectedUser.email} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Contact Number</label>
                    <input type="text" defaultValue={selectedUser.contactNumber} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                    <input type="text" defaultValue={selectedUser.role} disabled className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground opacity-75" />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Address Line 1</label>
                    <input type="text" defaultValue={selectedUser.addressLine1} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Address Line 2</label>
                    <input type="text" defaultValue={selectedUser.addressLine2 || ''} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Landmark</label>
                    <input type="text" defaultValue={selectedUser.landmark || ''} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">City</label>
                    <input type="text" defaultValue={selectedUser.city} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">State</label>
                    <input type="text" defaultValue={selectedUser.state} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Pincode</label>
                    <input type="text" defaultValue={selectedUser.pincode} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Document Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Aadhar Number</label>
                    <input type="text" defaultValue={selectedUser.aadharNumber || ''} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">PAN Number</label>
                    <input type="text" defaultValue={selectedUser.panNumber || ''} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Account Status</h3>
                <select
                  defaultValue={selectedUser.status}
                  onChange={(e) => handleStatusChange(selectedUser.id, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Created Date</p>
                <p className="text-sm text-foreground">{selectedUser.createdAt}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedUser(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                Cancel
              </button>
              <button onClick={() => setSelectedUser(null)} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
