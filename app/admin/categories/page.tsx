'use client'

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/admin/DataTable"
import { categoryService } from "@/service/apis/category.service"
import { Category, CreateCategory } from "@/types/Category"

export default function CategoriesPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryService.getCategories({ isAcitve: true })
      setCategories(response.data?.data?.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category: any) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const categoryId = category.id;
      console.log('Category id : ', categoryId)
      const response = await categoryService.deleteCategory(categoryId)
      if(response.data?.success){
        alert('Category deleted successfully');
        setCategories(categories.filter((c) => c.id !== categoryId))
      }
      
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category")
    }
  }

  const handleEdit = (category: Category) => {
    alert(`Edit category: ${category.name}`)
  }

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      try {

        const data: CreateCategory = {
          name: newCategory.name,
          description: newCategory.description,
          imageUrl: 'image',
          isActive: true,
        }
        const response = await categoryService.createCategory(data)
        if (response.data?.success) {
          setCategories([...categories, response.data.data])
          setNewCategory({ name: "", description: "" })
          setIsAdding(false)
        }
      } catch (error) {
        console.error("Error creating category:", error)
        alert("Failed to create category")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage business categories and subcategories
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">New Category</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="e.g. Restaurants, Hotels, Software"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                placeholder="Category description..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewCategory({ name: "", description: "" })
                }}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Category
              </button>
            </div>
          </div>
        </div> 
      )}

      {/* Categories Table */}
      <DataTable
        columns={[
          {
            key: "name",
            label: "Category Name",
            width: "25%",
          },
          {
            key: "description",
            label: "Description",
            width: "40%",
            render: (value) => (
              <p className="text-sm text-muted-foreground line-clamp-2">{value}</p>
            ),
          },
          {
            key: "listingCount",
            label: "Listings",
            width: "15%",
            render: (value) => (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {value || 0}
              </span>
            ),
          },
          {
            key: "createdAt",
            label: "Created",
            width: "15%",
            render: (value) => new Date(value).toLocaleDateString(),
          },
        ]}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
