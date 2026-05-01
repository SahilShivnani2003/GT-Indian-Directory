'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { categories } from '@/data/categories'
import { DataTable } from '@/components/admin/DataTable'
import { subcategories } from '@/data/subCategorires'

export default function SubcategoriesPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<typeof subcategories[0] | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    categoryId: '',
    slug: '',
    description: '',
  })

  const handleAddNew = () => {
    if (newSubcategory.name && newSubcategory.categoryId && newSubcategory.slug && newSubcategory.description) {
      alert(`Added: ${newSubcategory.name}`)
      setIsAddingNew(false)
      setNewSubcategory({ name: '', categoryId: '', slug: '', description: '' })
    }
  }

  const handleDelete = (id: string) => {
    alert(`Deleted subcategory`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Subcategories Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage business subcategories</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Subcategory
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Subcategories</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{subcategories.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{categories.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Status</p>
          <p className="mt-2 text-3xl font-bold text-india-green">{subcategories.length}</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: 'name', label: 'Subcategory Name', width: '30%' },
          {
            key: 'categoryId',
            label: 'Parent Category',
            width: '25%',
            render: (value) => {
              const cat = categories.find((c) => c.id === value)
              return <span className="text-sm">{cat?.name || 'Unknown'}</span>
            },
          },
          { key: 'slug', label: 'Slug', width: '20%' },
          { key: 'description', label: 'Description', width: '25%' },
        ]}
        data={subcategories}
        onEdit={(item) => setSelectedSubcategory(item)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Edit Modal */}
      {selectedSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit Subcategory</h2>
              <button onClick={() => setSelectedSubcategory(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subcategory Name</label>
                <input
                  type="text"
                  defaultValue={selectedSubcategory.name}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent Category</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} selected={selectedSubcategory.categoryId === cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
                <input
                  type="text"
                  defaultValue={selectedSubcategory.slug}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  defaultValue={selectedSubcategory.description}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedSubcategory(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                Cancel
              </button>
              <button onClick={() => setSelectedSubcategory(null)} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Add New Subcategory</h2>
              <button onClick={() => setIsAddingNew(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subcategory Name</label>
                <input
                  type="text"
                  placeholder="Enter subcategory name"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent Category</label>
                <select
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="e.g., fine-dining"
                  value={newSubcategory.slug}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, slug: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  placeholder="Enter description"
                  rows={4}
                  value={newSubcategory.description}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setIsAddingNew(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                Cancel
              </button>
              <button onClick={handleAddNew} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
