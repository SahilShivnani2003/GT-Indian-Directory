"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { categoryService } from "@/service/apis/category.service";
import { imageService } from "@/service/apis/image.service";
import { Category, CreateCategory } from "@/types/Category";

// ─── Constants ──────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  description: "",
  imageUrl: "",
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / edit form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories({ isAcitve: true });
      setCategories(response.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Form open/close helpers ──

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl ?? "",
    });
    setImagePreview(category.imageUrl);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview(undefined);
  };

  // ── Image upload ──

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("files", files[0]);
      const response = await imageService.uploadMultipleImages(formData);
      if (response.data?.success) {
        const url = response.data?.data?.urls?.[0];
        if (url) {
          setForm((prev) => ({ ...prev, imageUrl: url }));
          setImagePreview(url);
        }
      } else {
        console.error("Image upload failed:", response.data?.message);
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    const currentUrl = form.imageUrl;
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview(undefined);

    if (!currentUrl) return;
    try {
      const response = await imageService.deleteImage(currentUrl);
      if (!response.data?.success) {
        console.error("Image deletion failed:", response.data?.message);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // ── Create / Update ──

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      const data: CreateCategory = {
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        isActive: true,
      };

      if (editingId) {
        const response = await categoryService.updateCategory(editingId, data);
        if (response.data?.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingId ? { ...c, ...data, id: editingId } : c,
            ),
          );
          closeForm();
        } else {
          alert("Failed to update category");
        }
      } else {
        const response = await categoryService.createCategory(data);
        if (response.data?.success) {
          setCategories((prev) => [...prev, response.data.data]);
          closeForm();
        } else {
          alert("Failed to create category");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert(
        editingId ? "Failed to update category" : "Failed to create category",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──

  const handleDelete = async (category: Category) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await categoryService.deleteCategory(category.id);
      if (response.data?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

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
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Add / Edit Category Form */}
      {isFormOpen && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Restaurants, Hotels, Software"
                className={inputCls}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Category description..."
                rows={3}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Category"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-60"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeForm}
                disabled={submitting}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || uploadingImage}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : editingId ? (
                  "Save Changes"
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <DataTable
        columns={[
          {
            key: "imageUrl",
            label: "Image",
            width: "10%",
            render: (value) =>
              value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt=""
                  className="h-10 w-10 rounded-md object-cover border border-border"
                />
              ) : (
                <div className="h-10 w-10 rounded-md bg-secondary" />
              ),
          },
          {
            key: "name",
            label: "Category Name",
            width: "20%",
          },
          {
            key: "description",
            label: "Description",
            width: "35%",
            render: (value) => (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {value}
              </p>
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
        onEdit={openEditForm}
        onDelete={handleDelete}
      />
    </div>
  );
}
