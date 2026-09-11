'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getProfile, updateProfile, changePassword } from '@/services/profileService';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // Security Form State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  // Notification Form State
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    dailySummary: true,
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile({
          fullName: data.fullName ?? '',
          email: data.email ?? '',
          phoneNumber: data.phoneNumber ?? '',
        });
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const showMessage = (status: 'saved' | 'error', msg: string) => {
    setSaveStatus(status);
    setSaveMessage(msg);
    setTimeout(() => {
      setSaveStatus('idle');
      setSaveMessage('');
    }, 3500);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateProfile({
        fullName: profile.fullName || null,
        phoneNumber: profile.phoneNumber || null,
        imageUrl: null,
      });
      showMessage('saved', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to update profile.');
    }
  };

  const validatePassword = (): boolean => {
    const errs: Record<string, string> = {};
    if (!security.currentPassword.trim()) errs.currentPassword = 'Current password is required.';
    if (!security.newPassword.trim()) {
      errs.newPassword = 'New password is required.';
    } else if (security.newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters.';
    } else if (!/\d/.test(security.newPassword)) {
      errs.newPassword = 'Password must include at least one number.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(security.newPassword)) {
      errs.newPassword = 'Password must include at least one special character.';
    }
    if (!security.confirmPassword.trim()) {
      errs.confirmPassword = 'Please confirm your new password.';
    } else if (security.confirmPassword !== security.newPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setSecurityErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSaveStatus('saving');
    try {
      await changePassword({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('saved', 'Password updated successfully!');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to update password.');
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile Settings', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Alert */}
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

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-[#0b3327] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Profile Settings */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6"
        >
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Personal Information</h3>
            <p className="text-xs text-gray-500 mt-0.5">Update your account details.</p>
          </div>

          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                type="email"
                value={profile.email}
                disabled
                helperText="Contact support to change your account email."
              />
              <Input
                label="Phone Number"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="+92 300 1234567"
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={saveStatus === 'saving'}
              disabled={profileLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Notification Preferences</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Control how you receive updates about ground bookings.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/80 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-900">Email Booking Confirmation</p>
                <p className="text-[11px] text-gray-500">
                  Receive instant email alerts whenever a customer books a slot.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailBooking}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailBooking: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/80 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-900">Daily Revenue &amp; Schedule Summary</p>
                <p className="text-[11px] text-gray-500">
                  Receive a daily digest of total bookings and earnings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailySummary}
                onChange={(e) =>
                  setNotifications({ ...notifications, dailySummary: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleSecuritySubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6"
        >
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Password &amp; Security</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your password to keep your account safe.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={security.currentPassword}
              onChange={(e) => {
                setSecurity({ ...security, currentPassword: e.target.value });
                if (securityErrors.currentPassword)
                  setSecurityErrors((prev) => ({ ...prev, currentPassword: '' }));
              }}
              error={securityErrors.currentPassword}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={security.newPassword}
              onChange={(e) => {
                setSecurity({ ...security, newPassword: e.target.value });
                if (securityErrors.newPassword)
                  setSecurityErrors((prev) => ({ ...prev, newPassword: '' }));
              }}
              error={securityErrors.newPassword}
              helperText="Min 8 chars, must include a number and a special character."
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={security.confirmPassword}
              onChange={(e) => {
                setSecurity({ ...security, confirmPassword: e.target.value });
                if (securityErrors.confirmPassword)
                  setSecurityErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              error={securityErrors.confirmPassword}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={saveStatus === 'saving'}
            >
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
