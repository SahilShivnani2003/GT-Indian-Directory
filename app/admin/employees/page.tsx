'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, Search, Filter, Mail, Phone, MapPin, Calendar, Building2, Briefcase, Clock } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { employees } from '@/data/employees'
import { User } from '@/types/User'

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive') => {
    // In a real app, this would update the backend
    alert(`Employee status updated to ${newStatus}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      alert(`Employee record deleted`)
    }
  }

  const handleSaveEmployee = () => {
    // In a real app, this would save to backend
    alert('Employee details saved successfully')
    setSelectedEmployee(null)
  }

  // Filter employees based on search and status
  const filteredEmployees = employees.filter((emp: User) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.contactNumber.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const activeEmployees = employees.filter((e: User) => e.status === 'active').length
  const inactiveEmployees = employees.filter((e: User) => e.status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Employee Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage team members and employee profiles</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
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
              <p className="mt-2 text-3xl font-bold text-foreground">{employees.length}</p>
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
              <p className="mt-2 text-3xl font-bold text-green-600">{activeEmployees}</p>
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
              <p className="mt-2 text-3xl font-bold text-gray-600">{inactiveEmployees}</p>
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
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: 'name', label: 'Employee Name', width: '20%' },
          { key: 'email', label: 'Email', width: '20%' },
          { key: 'contactNumber', label: 'Contact', width: '15%' },
          { key: 'role', label: 'Role', width: '12%' },
          {
            key: 'status',
            label: 'Status',
            width: '13%',
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
          { key: 'createdAt', label: 'Joined', width: '12%' },
        ]}
        data={filteredEmployees}
        onEdit={(item) => setSelectedEmployee(item as User)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Edit Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-card shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Edit Employee</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedEmployee.name}</p>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.name} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="flex text-sm font-medium text-foreground mb-1.5 items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </label>
                    <input 
                      type="email" 
                      defaultValue={selectedEmployee.email} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="flex text-sm font-medium text-foreground mb-1.5 items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Contact Number
                    </label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.contactNumber} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                    <select
                      defaultValue={selectedEmployee.role}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="User">User</option>
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address Line 1</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.addressLine1} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address Line 2</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.addressLine2 || ''} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Landmark</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.landmark || ''} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.city} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.state} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Pincode</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.pincode} 
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>

              {/* Documents & KYC */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Documents & KYC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Aadhar Number</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.aadharNumber || ''} 
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">PAN Number</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee.panNumber || ''} 
                      placeholder="AAAAA0000A"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                    <select
                      defaultValue={selectedEmployee.status}
                      onChange={(e) => handleStatusChange(selectedEmployee.id, e.target.value as 'active' | 'inactive')}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex text-sm font-medium text-foreground mb-1.5 items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Created At
                    </label>
                    <input 
                      type="text" 
                      value={new Date(selectedEmployee.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} 
                      disabled
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button 
                onClick={() => setSelectedEmployee(null)} 
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEmployee} 
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}