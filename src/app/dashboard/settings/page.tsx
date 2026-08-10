'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: user?.name || 'Ahmad Khan',
    email: user?.email || 'ahmad@example.com',
    phone: '+92 300 1234567',
    businessName: 'Royal Sports Complex',
  });

  // Notification Form State
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    smsAlerts: false,
    dailySummary: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Settings updated successfully!</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#0b3327] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#0b3327] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#0b3327] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* Tab 1: Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Personal & Business Information</h3>
            <p className="text-xs text-gray-500 mt-0.5">Update your owner account details and facility branding.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              label="Business / Complex Name"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
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
            <p className="text-xs text-gray-500 mt-0.5">Control how you receive updates about ground bookings.</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/80 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-900">Email Booking Confirmation</p>
                <p className="text-[11px] text-gray-500">Receive instant email alerts whenever a customer books a slot.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailBooking}
                onChange={(e) => setNotifications({ ...notifications, emailBooking: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/80 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-gray-900">Daily Revenue & Schedule Summary</p>
                <p className="text-[11px] text-gray-500">Receive a daily digest of total bookings and earnings.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailySummary}
                onChange={(e) => setNotifications({ ...notifications, dailySummary: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Password & Security</h3>
            <p className="text-xs text-gray-500 mt-0.5">Update your password to keep your account safe.</p>
          </div>

          <div className="space-y-4 max-w-md">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}