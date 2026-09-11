'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export interface DaySchedule {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

export interface BlackoutItem {
  id: string;
  name: string;
  dateRange: string;
  colorClass: string;
}

export interface AddGroundStep1 {
  groundName: string;
  facilityType: string;
  primarySport: string;
  description: string;
  address: string;
  city: string;
  amenities: string[];
  photos: string[];
  latitude: string;
  longitude: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
}

export interface AddGroundStep2 {
  basePrice: string;
  currency: string;
  peakEnabled: boolean;
  peakStart: string;
  peakEnd: string;
  peakPrice: string;
  sportPrices: { football: string; padel: string; badminton: string };
  schedule: DaySchedule[];
  advancePercent: number;
  cancellationPolicy: 'no' | 'partial' | 'full';
  blackouts: BlackoutItem[];
  minDuration: string;
}

export interface AddGroundData {
  step1: AddGroundStep1;
  step2: AddGroundStep2;
}

export const DEFAULT_WEEK_SCHEDULE: DaySchedule[] = [
  { day: 'Monday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Tuesday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Wednesday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Thursday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Friday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Saturday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  { day: 'Sunday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
];

export const DEFAULT_ADD_GROUND_DATA: AddGroundData = {
  step1: {
    groundName: '',
    facilityType: 'Cricket Ground',
    primarySport: 'Cricket',
    description: '',
    address: '',
    city: 'Lahore',
    amenities: [],
    photos: [],
    latitude: '',
    longitude: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
  },
  step2: {
    basePrice: '45.00',
    currency: 'PKR',
    peakEnabled: true,
    peakStart: '05:00 PM',
    peakEnd: '10:00 PM',
    peakPrice: '65.00',
    sportPrices: { football: '45.00', padel: '60.00', badminton: '30.00' },
    schedule: DEFAULT_WEEK_SCHEDULE,
    advancePercent: 50,
    cancellationPolicy: 'no',
    blackouts: [
      {
        id: '1',
        name: 'Independence Day',
        dateRange: 'Aug 15, 2026',
        colorClass: 'bg-red-50/80 border-red-100 text-red-900',
      },
      {
        id: '2',
        name: 'Annual Maintenance',
        dateRange: 'Oct 02 - Oct 05',
        colorClass: 'bg-slate-100/80 border-slate-200 text-slate-900',
      },
    ],
    minDuration: '1 Hour',
  },
};

interface AddGroundContextType {
  data: AddGroundData;
  updateStep1: (patch: Partial<AddGroundStep1>) => void;
  updateStep2: (patch: Partial<AddGroundStep2>) => void;
  resetAddGround: () => void;
}

const AddGroundContext = createContext<AddGroundContextType | undefined>(undefined);

export const AddGroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AddGroundData>(DEFAULT_ADD_GROUND_DATA);

  const updateStep1 = (patch: Partial<AddGroundStep1>) => {
    setData((prev) => ({ ...prev, step1: { ...prev.step1, ...patch } }));
  };

  const updateStep2 = (patch: Partial<AddGroundStep2>) => {
    setData((prev) => ({
      ...prev,
      step2: { ...prev.step2, ...patch, schedule: patch.schedule ?? prev.step2.schedule },
    }));
  };

  const resetAddGround = () => {
    setData(DEFAULT_ADD_GROUND_DATA);
  };

  const value = useMemo(
    () => ({ data, updateStep1, updateStep2, resetAddGround }),
    [data]
  );

  return <AddGroundContext.Provider value={value}>{children}</AddGroundContext.Provider>;
};

export const useAddGround = (): AddGroundContextType => {
  const context = useContext(AddGroundContext);
  if (!context) {
    throw new Error('useAddGround must be used within an AddGroundProvider');
  }
  return context;
};