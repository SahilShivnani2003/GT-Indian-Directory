"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { subCategoryService } from "@/service/apis/subCategory.service";
import { categoryService } from "@/service/apis/category.service";
import { Subcategory, CreateSubcategory } from "@/types/SubCategory";
import { Category } from "@/types/Category";

const EMPTY_FORM: CreateSubcategory = {
  name: "",
  categoryId: "",
  slug: "",
  description: "",
};

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [editForm, setEditForm] = useState<CreateSubcategory>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Add modal
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<CreateSubcategory>(EMPTY_FORM);
  const [adding, setAdding] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Subcategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        subCategoryService.getSubCategories(),
        categoryService.getCategories({ isAcitve: true }),
      ]);
      const subData = subRes.data?.data;
      setSubcategories(
        Array.isArray(subData) ? subData : (subData?.items ?? []),
      );
      const catData = catRes.data?.data?.data;
      setCategories(Array.isArray(catData) ? catData : (catData?.items ?? []));
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Auto-generate slug from name ──────────────────────────────────────────
  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAddNew = async () => {
    if (
      !newForm.name ||
      !newForm.categoryId ||
      !newForm.slug ||
      !newForm.description
    ) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setAdding(true);
    try {
      await subCategoryService.createSubCategory(newForm);
      showToast(`"${newForm.name}" added successfully.`);
      setIsAddingNew(false);
      setNewForm(EMPTY_FORM);
      fetchData();
    } catch (err) {
      console.error("Error adding subcategory:", err);
      showToast("Failed to add subcategory.", "error");
    } finally {
      setAdding(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (item: Subcategory) => {
    setSelectedSubcategory(item);
    setEditForm({
      name: item.name,
      categoryId: item.categoryId,
      slug: item.slug,
      description: item.description,
    });
  };

  const handleEditSave = async () => {
    if (!selectedSubcategory) return;
    if (
      !editForm.name ||
      !editForm.categoryId ||
      !editForm.slug ||
      !editForm.description
    ) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setSaving(true);
    try {
      await subCategoryService.updateSubCategory(
        selectedSubcategory.id,
        editForm,
      );
      showToast(`"${editForm.name}" updated successfully.`);
      setSelectedSubcategory(null);
      fetchData();
    } catch (err) {
      console.error("Error updating subcategory:", err);
      showToast("Failed to update subcategory.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (item: Subcategory) => setDeleteTarget(item);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      console.log('Delete target : ',deleteTarget);
      const response = await subCategoryService.deleteSubCategory(
        deleteTarget.id,
      );
      if (response.data?.success) {
        showToast(`"${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      showToast("Failed to delete subcategory.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "Unknown";

  const CategoryDropdown = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );

  const FormFields = ({
    form,
    onChange,
    autoSlug = false,
  }: {
    form: CreateSubcategory;
    onChange: (f: CreateSubcategory) => void;
    autoSlug?: boolean;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Subcategory Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter subcategory name"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            onChange({
              ...form,
              name,
              ...(autoSlug ? { slug: toSlug(name) } : {}),
            });
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Parent Category <span className="text-destructive">*</span>
        </label>
        <CategoryDropdown
          value={form.categoryId}
          onChange={(v) => onChange({ ...form, categoryId: v })}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Slug <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., fine-dining"
          value={form.slug}
          onChange={(e) => onChange({ ...form, slug: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {autoSlug && form.name && (
          <p className="mt-1 text-xs text-muted-foreground">
            Auto-generated from name. You can edit it manually.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          placeholder="Enter description"
          rows={4}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[100] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === "success" ? "bg-india-green" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Subcategories Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage business subcategories
          </p>
        </div>
        <button
          onClick={() => {
            setNewForm(EMPTY_FORM);
            setIsAddingNew(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Subcategory
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Subcategories</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {subcategories.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {categories.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">
            {subcategories.length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Loading subcategories…
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Subcategory Name", width: "25%" },
            {
              key: "categoryId",
              label: "Parent Category",
              width: "25%",
              render: (value) => (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {getCategoryName(value)}
                </span>
              ),
            },
            { key: "slug", label: "Slug", width: "20%" },
            {
              key: "description",
              label: "Description",
              width: "30%",
              render: (value) => (
                <span className="line-clamp-2 text-sm text-muted-foreground">
                  {value}
                </span>
              ),
            },
          ]}
          data={subcategories}
          onEdit={(item) => handleEdit(item)}
          onDelete={(item) => handleDelete(item)}
        />
      )}

      {/* ── Add Modal ─────────────────────────────────────────────────────── */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Add New Subcategory
              </h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FormFields form={newForm} onChange={setNewForm} autoSlug />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsAddingNew(false)}
                disabled={adding}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                disabled={adding}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {selectedSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Edit Subcategory
              </h2>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FormFields form={editForm} onChange={setEditForm} />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedSubcategory(null)}
                disabled={saving}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ──────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              Delete Subcategory
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deleteTarget.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
