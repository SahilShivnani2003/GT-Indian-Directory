'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Plus, X } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { productService } from '@/service/apis/product.service'
import { Product } from '@/types/Product'

export default function AdminProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await productService.getProducts({
        pageNumber: 1,
        pageSize: 100,
      })
      setProducts(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeProducts = products.filter((p) => p.status === 'active').length
  const featuredProducts = products.filter((p) => p.featured).length
  const totalRevenue = products.length * 25000 // Mock calculation

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await productService.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Products Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage products and services from all businesses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{loading ? "—" : products.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">{loading ? "—" : activeProducts}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="mt-2 text-3xl font-bold text-yellow-500">{loading ? "—" : featuredProducts}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Estimated Sales</p>
          <p className="mt-2 text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Products Table */}
      <DataTable
        columns={[
          { key: 'name', label: 'Product Name', width: '25%' },
          { key: 'listingId', label: 'Business', width: '20%' },
          { key: 'category', label: 'Category', width: '15%' },
          {
            key: 'price',
            label: 'Price',
            width: '12%',
            render: (value, row) => {
              const product = row as Product
              return (
                <div>
                  <div className="font-semibold text-foreground">₹{product.discountPrice || product.price}</div>
                  {product.discountPrice && (
                    <div className="text-xs text-muted-foreground line-through">₹{product.price}</div>
                  )}
                </div>
              )
            },
          },
          { key: 'stock', label: 'Stock', width: '10%' },
          {
            key: 'status',
            label: 'Status',
            width: '12%',
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  value === 'Active'
                    ? 'bg-india-green/10 text-india-green'
                    : value === 'Inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={loading ? [] : products}
        onEdit={(item) => setSelectedProduct(item as Product)}
        onDelete={(item) => handleDelete((item as Product).id)}
      />

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-lg bg-card p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit Product</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
                  <input type="text" defaultValue={selectedProduct.name} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">SKU</label>
                  <input type="text" defaultValue={selectedProduct.sku} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price</label>
                  <input type="number" defaultValue={selectedProduct.price} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Discount Price</label>
                  <input type="number" defaultValue={selectedProduct.discountPrice} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
                  <input type="number" defaultValue={selectedProduct.stock} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select defaultValue={selectedProduct.status} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea defaultValue={selectedProduct.description} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" rows={3} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" defaultChecked={selectedProduct.featured} className="rounded" />
                <label htmlFor="featured" className="text-sm font-medium text-foreground">Mark as Featured</label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedProduct(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                Cancel
              </button>
              <button onClick={() => setSelectedProduct(null)} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
