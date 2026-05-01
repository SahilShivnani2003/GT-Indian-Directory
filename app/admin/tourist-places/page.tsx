"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { touristPlaces } from "@/data/touristPlaces"
import { DataTable } from "@/components/admin/DataTable"

export default function AdminTouristPlacesPage() {
  const [selectedPlace, setSelectedPlace] = useState<typeof touristPlaces[0] | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [places, setPlaces] = useState(touristPlaces)

  const handleAddPlace = () => {
    setIsAddingNew(true)
    setSelectedPlace(null)
  }

  const handleToggleVisibility = (id: string) => {
    setPlaces(
      places.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    )
  }

  const handleToggleFeatured = (id: string) => {
    setPlaces(places.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)))
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tourist place?")) {
      setPlaces(places.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tourist Places</h2>
          <p className="mt-1 text-muted-foreground">Manage tourist destinations and attractions</p>
        </div>
        <button
          onClick={handleAddPlace}
          className="flex items-center gap-2 rounded-lg bg-saffron px-4 py-2.5 font-semibold text-saffron-foreground hover:bg-saffron/90"
        >
          <Plus className="h-5 w-5" />
          Add Place
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Places</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{places.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">
            {places.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="mt-2 text-3xl font-bold text-saffron">{places.filter((p) => p.featured).length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="mt-2 text-3xl font-bold text-destructive">
            {places.filter((p) => p.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "name",
            label: "Place Name",
            width: "25%",
          },
          {
            key: "category",
            label: "Category",
            width: "15%",
            render: (value) => (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {value}
              </span>
            ),
          },
          {
            key: "city",
            label: "City",
            width: "15%",
          },
          {
            key: "state",
            label: "State",
            width: "15%",
          },
          {
            key: "status",
            label: "Status",
            width: "12%",
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === "active"
                    ? "bg-india-green/10 text-india-green"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {value === "active" ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "featured",
            label: "Featured",
            width: "10%",
            render: (value) =>
              value ? (
                <span className="inline-block rounded-full bg-saffron/10 px-2.5 py-1 text-xs font-semibold text-saffron">
                  ⭐ Featured
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              ),
          },
          {
            key: "actions",
            label: "Actions",
            width: "8%",
            render: (_, row) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVisibility(row.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title={row.status === "active" ? "Hide" : "Show"}
                >
                  {row.status === "active" ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedPlace(row)}
                  className="text-muted-foreground hover:text-primary"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={places}
      />

      {/* Edit Modal */}
      {selectedPlace && !isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit: {selectedPlace.name}</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    defaultValue={selectedPlace.name}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <input
                    type="text"
                    defaultValue={selectedPlace.category}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input
                    type="text"
                    defaultValue={selectedPlace.city}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State</label>
                  <input
                    type="text"
                    defaultValue={selectedPlace.state}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rating</label>
                  <input
                    type="number"
                    defaultValue={selectedPlace.rating}
                    step="0.1"
                    max="5"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Best Time</label>
                  <input
                    type="text"
                    defaultValue={selectedPlace.bestTimeToVisit}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  defaultValue={selectedPlace.description}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground h-20"
                />
              </div>

              <div className="flex gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={selectedPlace.featured} className="rounded" />
                  <span className="text-sm font-medium text-foreground">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={selectedPlace.status === "active"}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-foreground">Active</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-border pt-4">
              <button
                onClick={() => setSelectedPlace(null)}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
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
            <h2 className="text-xl font-bold text-foreground mb-4">Add New Tourist Place</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Place Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Taj Mahal"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Historical Monument"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Agra"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g., Uttar Pradesh"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rating</label>
                  <input
                    type="number"
                    placeholder="4.8"
                    step="0.1"
                    max="5"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    placeholder="e.g., October to March"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Short Description</label>
                <textarea
                  placeholder="Brief description"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Upload Image</label>
                <input type="file" accept="image/*" className="w-full" />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-border pt-4">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-saffron text-saffron-foreground hover:bg-saffron/90">
                Add Place
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
