"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TouristPlace, CreateTouristPlace } from "@/types/TouristPlaces";
import { DataTable } from "@/components/admin/DataTable";
import { touristService } from "@/service/apis/tourist.service";

const EMPTY_FORM: CreateTouristPlace = {
  name: "",
  description: "",
  longDescription: "",
  category: "",
  location: "",
  city: "",
  state: "",
  latitude: 0,
  longitude: 0,
  image: "",
  bestTimeToVisit: "",
  entryFee: "",
  openingHours: "",
  website: "",
  contactNumber: "",
  images: [],
  featured: false,
};

function toFormData(place: TouristPlace): CreateTouristPlace {
  return {
    name: place.name ?? "",
    description: place.description ?? "",
    longDescription: place.longDescription ?? "",
    category: place.category ?? "",
    location: place.location ?? "",
    city: place.city ?? "",
    state: place.state ?? "",
    latitude: place.latitude ?? 0,
    longitude: place.longitude ?? 0,
    image: place.image ?? "",
    bestTimeToVisit: place.bestTimeToVisit ?? "",
    entryFee: place.entryFee ?? "",
    openingHours: place.openingHours ?? "",
    website: place.website ?? "",
    contactNumber: place.contactNumber ?? "",
    images: Array.isArray(place.images) ? place.images : [],
    featured: !!place.featured,
  };
}

export default function AdminTouristPlacesPage() {
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<CreateTouristPlace>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadPlaces = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await touristService.getTouristPlaces({
        pageNumber: 1,
        pageSize: 1000,
      });
      setPlaces(res.data?.data?.data);
    } catch (err) {
      console.error("Failed to load tourist places", err);
      setLoadError("Couldn't load tourist places. Try refreshing the page.");
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleAddPlace = () => {
    setFormData(EMPTY_FORM);
    setSaveError(null);
    setIsAddingNew(true);
    setSelectedPlace(null);
  };

  const handleEditClick = (place: TouristPlace) => {
    setFormData(toFormData(place));
    setSaveError(null);
    setSelectedPlace(place);
    setIsAddingNew(false);
  };

  const closeModal = () => {
    setSelectedPlace(null);
    setIsAddingNew(false);
    setSaveError(null);
  };

  const handleFormChange = <K extends keyof CreateTouristPlace>(
    field: K,
    value: CreateTouristPlace[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleVisibility = async (place: TouristPlace) => {
    const newStatus = place.status === "active" ? "inactive" : "active";
    setPlaces((prev) =>
      prev.map((p) => (p.id === place.id ? { ...p, status: newStatus } : p)),
    );
    try {
      const response = await touristService.updateTouristPlace(place.id, {
        ...toFormData(place),
        status: newStatus,
      } as CreateTouristPlace);

      if(response.data?.success){
        await loadPlaces();
      }
    } catch (err) {
      console.error("Failed to update status", err);
      setPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
      alert("Couldn't update the status. Please try again.");
    }
  };

  const handleToggleFeatured = async (place: TouristPlace) => {
    const featured = !place.featured;
    setPlaces((prev) =>
      prev.map((p) => (p.id === place.id ? { ...p, featured } : p)),
    );
    try {
      await touristService.updateTouristPlace(place.id, {
        ...toFormData(place),
        featured,
      });
    } catch (err) {
      console.error("Failed to update featured flag", err);
      setPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
      alert("Couldn't update the featured flag. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tourist place?")) return;
    const previous = places;
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    try {
      await touristService.deleteTouristPlace(id);
    } catch (err) {
      console.error("Failed to delete place", err);
      setPlaces(previous);
      alert("Couldn't delete this place. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSaveError("Name is required.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      if (selectedPlace) {
        const res = await touristService.updateTouristPlace(
          selectedPlace.id,
          formData,
        );
        const updated = res.data?.data ?? {};
        setPlaces((prev) =>
          prev.map((p) =>
            p.id === selectedPlace.id ? { ...p, ...formData, ...updated } : p,
          ),
        );
      } else {
        const res = await touristService.createTouristPlace(formData);
        const created = res.data?.data;
        if (created?.id) {
          setPlaces((prev) => [created as TouristPlace, ...prev]);
        } else {
          // Backend didn't echo back the created record — refetch instead.
          await loadPlaces();
        }
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save tourist place", err);
      setSaveError("Couldn't save changes. Check the fields and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isModalOpen = isAddingNew || selectedPlace !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tourist Places</h2>
          <p className="mt-1 text-muted-foreground">
            Manage tourist destinations and attractions
          </p>
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
          <p className="mt-2 text-3xl font-bold text-foreground">
            {places.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-bold text-india-green">
            {places.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="mt-2 text-3xl font-bold text-saffron">
            {places.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="mt-2 text-3xl font-bold text-destructive">
            {places.filter((p) => p.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading tourist places...</span>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">{loadError}</p>
          <button
            onClick={loadPlaces}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Place Name", width: "23%" },
            {
              key: "category",
              label: "Category",
              width: "14%",
              render: (value) => (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {value}
                </span>
              ),
            },
            { key: "city", label: "City", width: "14%" },
            { key: "state", label: "State", width: "14%" },
            {
              key: "status",
              label: "Status",
              width: "11%",
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
              width: "14%",
              render: (_, row: TouristPlace) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(row)}
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
                    onClick={() => handleToggleFeatured(row)}
                    className={`hover:text-saffron ${
                      row.featured ? "text-saffron" : "text-muted-foreground"
                    }`}
                    title={row.featured ? "Unfeature" : "Feature"}
                  >
                    <Star
                      className={`h-4 w-4 ${row.featured ? "fill-saffron" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => handleEditClick(row)}
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
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {selectedPlace
                ? `Edit: ${selectedPlace.name}`
                : "Add New Tourist Place"}
            </h2>

            <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Place Name">
                  <input
                    type="text"
                    placeholder="e.g., Taj Mahal"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Category">
                  <input
                    type="text"
                    placeholder="e.g., Historical Monument"
                    value={formData.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="City">
                  <input
                    type="text"
                    placeholder="e.g., Agra"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="State">
                  <input
                    type="text"
                    placeholder="e.g., Uttar Pradesh"
                    value={formData.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Location / Address">
                  <input
                    type="text"
                    placeholder="e.g., Dharmapuri, Forest Colony"
                    value={formData.location}
                    onChange={(e) =>
                      handleFormChange("location", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Best Time to Visit">
                  <input
                    type="text"
                    placeholder="e.g., October to March"
                    value={formData.bestTimeToVisit}
                    onChange={(e) =>
                      handleFormChange("bestTimeToVisit", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Latitude">
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) =>
                      handleFormChange(
                        "latitude",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) =>
                      handleFormChange(
                        "longitude",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Entry Fee">
                  <input
                    type="text"
                    placeholder="e.g., ₹50 (Indians), ₹600 (Foreigners)"
                    value={formData.entryFee}
                    onChange={(e) =>
                      handleFormChange("entryFee", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Opening Hours">
                  <input
                    type="text"
                    placeholder="e.g., 6:00 AM - 6:30 PM"
                    value={formData.openingHours}
                    onChange={(e) =>
                      handleFormChange("openingHours", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) =>
                      handleFormChange("website", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
                <Field label="Contact Number">
                  <input
                    type="text"
                    placeholder="e.g., +91 98765 43210"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleFormChange("contactNumber", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </Field>
              </div>

              <Field label="Short Description">
                <textarea
                  placeholder="Brief description shown on listing cards"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground h-16"
                />
              </Field>

              <Field label="Long Description">
                <textarea
                  placeholder="Full description shown on the detail page"
                  value={formData.longDescription}
                  onChange={(e) =>
                    handleFormChange("longDescription", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground h-24"
                />
              </Field>

              <Field label="Main Image URL">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleFormChange("image", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </Field>

              <Field label="Additional Image URLs (comma-separated)">
                <input
                  type="text"
                  placeholder="https://.../1.jpg, https://.../2.jpg"
                  value={(formData.images ?? []).join(", ")}
                  onChange={(e) =>
                    handleFormChange(
                      "images",
                      e.target.value
                        .split(",")
                        .map((url) => url.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </Field>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleFormChange("featured", e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-foreground">
                  Featured
                </span>
              </label>

              {saveError && (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {saveError}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-border pt-4">
              <button
                onClick={closeModal}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {selectedPlace ? "Save Changes" : "Add Place"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
