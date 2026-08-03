export type UserRole = 'user' | 'owner';

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
