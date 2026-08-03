'use client';

import React, { useState, useMemo } from 'react';
import { SignupFormData, UserRole, SystemRole } from '@/types/auth';
import { signupUser } from '@/services/authService';
import { AuthHeader } from './AuthHeader';
import { SocialAuth } from './SocialAuth';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { RoleSelector } from './RoleSelector';
import { PasswordRequirements } from './PasswordRequirements';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { MapPin, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const COUNTRY_CODES = [
  { value: '+1', label: '+1' },
  { value: '+44', label: '+44' },
  { value: '+971', label: '+971' },
  { value: '+92', label: '+92' },
  { value: '+91', label: '+91' },
  { value: '+61', label: '+61' },
  { value: '+49', label: '+49' },
];

interface SignupFormProps {
  onLoginClick?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    profilePhoto: null,
    profilePhotoPreview: null,
    role: 'user',
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    cityArea: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('Account Successfully Created');

  // Dynamic Password Validation
  const passwordValidation = useMemo(() => {
    const pwd = formData.password;
    return {
      hasMinLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  }, [formData.password]);

  const handleChange = (field: keyof SignupFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (apiError) setApiError(null);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.cityArea.trim()) {
      newErrors.cityArea = 'City or Area is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.hasMinLength || !passwordValidation.hasNumber || !passwordValidation.hasSpecialChar) {
      newErrors.password = 'Password does not meet security requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Map UI role to backend SystemRole enum (User = 2, GroundOwner = 3)
      const apiRole = formData.role === 'owner' ? SystemRole.GroundOwner : SystemRole.User;
      const formattedPhone = `${formData.countryCode} ${formData.phone.trim()}`;

      const response = await signupUser({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phoneNumber: formattedPhone,
        city: formData.cityArea.trim(),
        role: apiRole,
      });

      setSuccessMessage(response.message || 'Account Successfully Created');
      setIsSubmittedSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError('An error occurred while creating your account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Box Component
  if (isSubmittedSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-emerald-100 flex flex-col items-center text-center space-y-5 my-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-700" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Account Successfully Created!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {successMessage}. Welcome to <span className="font-bold text-[#0b3327]">Slot</span>! You can now log in with your email <span className="font-semibold text-emerald-800">{formData.email}</span>.
          </p>
        </div>

        <div className="w-full pt-2 flex flex-col gap-2">
          {onLoginClick && (
            <Button
              onClick={onLoginClick}
              variant="primary"
              fullWidth
              size="md"
            >
              Proceed to Sign In
            </Button>
          )}

          <Button
            onClick={() => {
              setIsSubmittedSuccess(false);
              setFormData({
                profilePhoto: null,
                profilePhotoPreview: null,
                role: 'user',
                fullName: '',
                email: '',
                countryCode: '+1',
                phone: '',
                cityArea: '',
                password: '',
                confirmPassword: '',
                agreeToTerms: false,
              });
            }}
            variant="outline"
            fullWidth
            size="md"
          >
            Create Another Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-6 sm:px-10 py-5 flex flex-col justify-between h-full max-h-screen overflow-hidden">
      <div className="space-y-3.5 my-auto">
        {/* Auth Top Branding & Title Header */}
        <AuthHeader onLoginClick={onLoginClick} />

        {/* API Error Notification Alert Box */}
        {apiError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-snug font-medium">{apiError}</span>
          </div>
        )}

        {/* Social Login Button */}
        <SocialAuth />

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Profile Photo Uploader (UI local state) */}
          <ProfilePhotoUpload
            photoPreview={formData.profilePhotoPreview}
            onPhotoChange={(file, previewUrl) => {
              handleChange('profilePhoto', file);
              handleChange('profilePhotoPreview', previewUrl);
            }}
          />

          {/* Role Selector Card Toggle */}
          <RoleSelector
            selectedRole={formData.role}
            onRoleSelect={(role: UserRole) => handleChange('role', role)}
          />

          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
          />

          {/* Email & Phone Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Phone Number
              </label>
              <div className="flex gap-2">
                <Select
                  options={COUNTRY_CODES}
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  containerClassName="w-24 shrink-0"
                />
                <Input
                  placeholder="123 456 789"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  containerClassName="flex-1"
                />
              </div>
            </div>
          </div>

          {/* City / Area with Location Pin Icon */}
          <Input
            label="City / Area"
            placeholder="e.g. Downtown Dubai"
            leftIcon={<MapPin className="w-4 h-4" />}
            value={formData.cityArea}
            onChange={(e) => handleChange('cityArea', e.target.value)}
            error={errors.cityArea}
          />

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {/* Password Validation Requirements Checklist */}
          <PasswordRequirements validation={passwordValidation} />

          {/* Terms Agreement Checkbox */}
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms}
            label={
              <span className="text-xs">
                By creating an account, I agree to Slot&apos;s{' '}
                <a href="#" className="font-semibold text-gray-800 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-gray-800 hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            }
          />

          {/* Submit CTA Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            isLoading={isSubmitting}
            className="mt-1.5"
          >
            Complete Registration
          </Button>
        </form>
      </div>

      {/* Footer copyright */}
      <footer className="py-1 text-center shrink-0">
        <p className="text-xs text-gray-400 font-medium">
          © 2024 Slot Sports Tech. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
