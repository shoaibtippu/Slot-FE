export type UserRole = 'user' | 'owner';

export enum SystemRole {
  Unknown = 0,
  Admin = 1,
  User = 2,
  GroundOwner = 3,
}

export interface SignupFormData {
  profilePhoto: File | null;
  profilePhotoPreview: string | null;
  role: UserRole;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  cityArea: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiSignupPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  role: SystemRole;
}

export interface ApiSignupResponse {
  message?: string;
  success?: boolean;
  token?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface PasswordValidationState {
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface CountryCodeOption {
  code: string;
  flag: string;
  label: string;
}
