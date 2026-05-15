export type UserRole = 'User' | 'Employee' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  aadharNumber?: string;
  panNumber?: string;
  agreementCopyUrl?: string;
  businessLicenseUrl?: string;
  latitude?: number;
  longitude?: number;
  role: UserRole;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface CreateUser {
  name: string;
  email: string;
  contactNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  aadharNumber?: string;
  panNumber?: string;
  agreementCopyUrl?: string;
  businessLicenseUrl?: string;
  latitude?: number;
  longitude?: number;
  role: UserRole;
}