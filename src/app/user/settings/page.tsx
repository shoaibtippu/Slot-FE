'use client';

import React, { useState, useEffect } from 'react';
import { User, Save, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getProfile, updateProfile, changePassword } from '@/services/profileService';

export default function UserSettingsPage() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const [profile, setProfile] = useState({ fullName: '', email: '', phoneNumber: '' });
  const [profileLoading, setProfileLoading] = useState(true);

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getProfile()
      .then((data) => setProfile({ fullName: data.fullName ?? '', email: data.email ?? '', phoneNumber: data.phoneNumber ?? '' }))
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const showMessage = (status: 'saved' | 'error', msg: string) => {
    setSaveStatus(status);
    setSaveMessage(msg);
    setTimeout(() => { setSaveStatus('idle'); setSaveMessage(''); }, 3500);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateProfile({ fullName: profile.fullName || null, phoneNumber: profile.phoneNumber || null, imageUrl: null });
      showMessage('saved', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to update profile.');
    }
  };

  const validatePassword = (): boolean => {
    const errs: Record<string, string> = {};
    if (!security.currentPassword.trim()) errs.currentPassword = 'Current password is required.';
    if (!security.newPassword.trim()) errs.newPassword = 'New password is required.';
    else if (security.newPassword.length < 8) errs.newPassword = 'Min 8 characters.';
    else if (!/\d/.test(security.newPassword)) errs.newPassword = 'Must include a number.';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(security.newPassword)) errs.newPassword = 'Must include a special character.';
    if (!security.confirmPassword.trim()) errs.confirmPassword = 'Please confirm your password.';
    else if (security.confirmPassword !== security.newPassword) errs.confirmPassword = 'Passwords do not match.';
    setSecurityErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSaveStatus('saving');
    try {
      await changePassword({ currentPassword: security.currentPassword, newPassword: security.newPassword });
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('saved', 'Password updated successfully!');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account profile and security.</p>
      </div>

      {saveStatus === 'saved' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveMessage}</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-sm shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{saveMessage}</span>
        </div>
      )}

      {/* Profile */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Personal Information</h3>
            <p className="text-xs text-gray-500">Update your account details.</p>
          </div>
        </div>
        {profileLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Your full name" />
            <Input label="Email Address" type="email" value={profile.email} disabled helperText="Contact support to change email." />
            <Input label="Phone Number" value={profile.phoneNumber} onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })} placeholder="+92 300 1234567" />
          </div>
        )}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={saveStatus === 'saving'} disabled={profileLoading}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Password */}
      <form onSubmit={handleSecuritySubmit} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Change Password</h3>
            <p className="text-xs text-gray-500">Keep your account secure with a strong password.</p>
          </div>
        </div>
        <div className="space-y-4 max-w-sm">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={security.currentPassword}
            onChange={(e) => { setSecurity({ ...security, currentPassword: e.target.value }); if (securityErrors.currentPassword) setSecurityErrors((p) => ({ ...p, currentPassword: '' })); }}
            error={securityErrors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={security.newPassword}
            onChange={(e) => { setSecurity({ ...security, newPassword: e.target.value }); if (securityErrors.newPassword) setSecurityErrors((p) => ({ ...p, newPassword: '' })); }}
            error={securityErrors.newPassword}
            helperText="Min 8 chars, a number, and a special character."
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={security.confirmPassword}
            onChange={(e) => { setSecurity({ ...security, confirmPassword: e.target.value }); if (securityErrors.confirmPassword) setSecurityErrors((p) => ({ ...p, confirmPassword: '' })); }}
            error={securityErrors.confirmPassword}
          />
        </div>
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Button type="submit" variant="primary" isLoading={saveStatus === 'saving'}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
