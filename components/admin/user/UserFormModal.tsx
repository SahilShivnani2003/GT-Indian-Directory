"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { User, CreateUser, Status } from "@/types/User";
import { authService } from "@/service/apis/auth.service";

interface UserFormModalProps {
  user?: User | null;
  defaultRole?: User["role"];
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: CreateUser = {
  name: "",
  email: "",
  contactNumber: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  aadharNumber: "",
  panNumber: "",
  role: "User",
};

// ─── Field (text/email/etc.) ────────────────────────────────────────────────
interface FieldProps {
  label: string;
  name: keyof CreateUser;
  type?: string;
  disabled?: boolean;
  colSpan?: number;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({
  label,
  name,
  type = "text",
  disabled = false,
  colSpan = 1,
  value,
  error,
  onChange,
}: FieldProps) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground bg-background transition-colors
          ${error ? "border-red-500" : "border-border"}
          ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── PasswordField ──────────────────────────────────────────────────────────
interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  colSpan?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  label,
  name,
  value,
  error,
  colSpan = 1,
  onChange,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={name === "password" ? "new-password" : "off"}
          className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-foreground bg-background transition-colors
            ${error ? "border-red-500" : "border-border"}
            hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

export default function UserFormModal({
  user,
  defaultRole = "User",
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const isEditMode = Boolean(user);

  const [form, setForm] = useState<CreateUser>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("Active");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUser | "password" | "confirmPassword", string>>
  >({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2 ?? "",
        landmark: user.landmark ?? "",
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        aadharNumber: user.aadharNumber ?? "",
        panNumber: user.panNumber ?? "",
        role: user.role,
      });
      setStatus(user.status);
    } else {
      setForm({ ...EMPTY_FORM, role: defaultRole });
      setStatus("Active");
    }
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<
      Record<keyof CreateUser | "password" | "confirmPassword", string>
    > = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(form.contactNumber))
      newErrors.contactNumber = "Must be 10 digits";
    if (!form.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Must be 6 digits";

    // Password validation
    if (!isEditMode) {
      // Add mode — password required
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 8)
        newErrors.password = "Must be at least 8 characters";
      if (!confirmPassword)
        newErrors.confirmPassword = "Please confirm password";
      else if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    } else {
      // Edit mode — password optional, but if filled must be valid
      if (password) {
        if (password.length < 8)
          newErrors.password = "Must be at least 8 characters";
        if (!confirmPassword)
          newErrors.confirmPassword = "Please confirm new password";
        else if (password !== confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    // Always include status; merge password only when provided
    const payload: CreateUser = password
      ? { ...form, status, password }
      : { ...form, status };

    try {
      if (isEditMode && user) {
        const response = await authService.updateUser(user.id, payload);
        if (response.data?.success) {
          onSuccess();
        } else {
          alert("Failed to update user. Please try again.");
        }
      } else {
        const response = await authService.register(payload);
        if (response.data?.success) {
          onSuccess();
        } else {
          alert("Failed to create user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-card shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEditMode ? `Edit User: ${user?.name}` : "Add New User"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditMode
                ? "Update user details and account status"
                : "Fill in the details to register a new user"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {/* Basic Information */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                error={errors.name}
                onChange={handleChange}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
              <Field
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                error={errors.contactNumber}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isEditMode}
                  className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors
                    ${isEditMode ? "opacity-60 cursor-not-allowed" : "hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"}`}
                >
                  <option value="User">User</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </section>

          {/* Password */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {isEditMode ? "Change Password" : "Password"}
            </h3>
            {isEditMode && (
              <p className="text-xs text-muted-foreground mb-3">
                Leave blank to keep the current password.
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <PasswordField
                label={isEditMode ? "New Password" : "Password"}
                name="password"
                value={password}
                error={errors.password}
                onChange={handlePasswordChange}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Address Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Address Line 1"
                name="addressLine1"
                colSpan={2}
                value={form.addressLine1}
                error={errors.addressLine1}
                onChange={handleChange}
              />
              <Field
                label="Address Line 2"
                name="addressLine2"
                colSpan={2}
                value={form.addressLine2 ?? ""}
                onChange={handleChange}
              />
              <Field
                label="Landmark"
                name="landmark"
                colSpan={2}
                value={form.landmark ?? ""}
                onChange={handleChange}
              />
              <Field
                label="City"
                name="city"
                value={form.city}
                error={errors.city}
                onChange={handleChange}
              />
              <Field
                label="State"
                name="state"
                value={form.state}
                error={errors.state}
                onChange={handleChange}
              />
              <Field
                label="Pincode"
                name="pincode"
                value={form.pincode}
                error={errors.pincode}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Document Information */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Document Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Aadhar Number"
                name="aadharNumber"
                value={form.aadharNumber ?? ""}
                onChange={handleChange}
              />
              <Field
                label="PAN Number"
                name="panNumber"
                value={form.panNumber ?? ""}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Account Status */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Account Status
            </h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
            </select>
          </section>

          {/* Meta — Edit mode only */}
          {isEditMode && user?.createdAt && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Created Date</p>
              <p className="text-sm text-foreground mt-1">{user.createdAt}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}
