'use client';

import React, { useRef } from 'react';
import { MapPin, ImagePlus, X, Images } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAddGround } from '@/context/AddGroundContext';
import { LocationMapPicker } from '@/components/dashboard/LocationMapPicker';

const FACILITY_TYPES = [
  { value: 'Cricket Ground', label: 'Cricket Ground' },
  { value: 'Football Turf', label: 'Football Turf' },
  { value: 'Futsal Court', label: 'Futsal Court' },
  { value: 'Padel Court', label: 'Padel Court' },
  { value: 'Badminton Court', label: 'Badminton Court' },
  { value: 'Tennis Court', label: 'Tennis Court' },
  { value: 'Multi-Sports Complex', label: 'Multi-Sports Complex' },
];

const SPORTS = [
  { value: 'Cricket', label: 'Cricket' },
  { value: 'Football', label: 'Football' },
  { value: 'Futsal', label: 'Futsal' },
  { value: 'Padel', label: 'Padel' },
  { value: 'Badminton', label: 'Badminton' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Volleyball', label: 'Volleyball' },
];

const AMENITIES = [
  { id: 'floodlights', label: 'Floodlights' },
  { id: 'parking', label: 'Parking Space' },
  { id: 'changing', label: 'Changing Rooms' },
  { id: 'showers', label: 'Showers' },
  { id: 'canteen', label: 'Canteen / Refreshments' },
  { id: 'seating', label: 'Seating Area' },
  { id: 'wheelchair', label: 'Wheelchair Access' },
  { id: 'access', label: '24/7 Access' },
];

export const AddGroundBasicInfoForm: React.FC = () => {
  const { data, updateStep1 } = useAddGround();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const readers = files
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 6 - data.step1.photos.length)
      .map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

    Promise.all(readers).then((urls) => {
      updateStep1({ photos: [...data.step1.photos, ...urls] });
    });
  };

  const handleRemovePhoto = (index: number) => {
    const next = [...data.step1.photos];
    next.splice(index, 1);
    updateStep1({ photos: next });
  };

  const toggleAmenity = (id: string) => {
    const has = data.step1.amenities.includes(id);
    updateStep1({
      amenities: has
        ? data.step1.amenities.filter((a) => a !== id)
        : [...data.step1.amenities, id],
    });
  };

  return (
    <div className="divide-y divide-gray-100">
      {/* Basic Details */}
      <section className="p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900">Basic Details</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Tell customers what your facility is and what it offers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ground Name"
            placeholder="e.g. Green Valley Sports Complex"
            value={data.step1.groundName}
            onChange={(e) => updateStep1({ groundName: e.target.value })}
          />

          <Select
            label="Facility Type"
            value={data.step1.facilityType}
            onChange={(e) => updateStep1({ facilityType: e.target.value })}
            options={FACILITY_TYPES}
          />

          <Select
            label="Primary Sport"
            value={data.step1.primarySport}
            onChange={(e) => updateStep1({ primarySport: e.target.value })}
            options={SPORTS}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 tracking-wide">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe your facility, playing surface, and standout features..."
            value={data.step1.description}
            onChange={(e) => updateStep1({ description: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 shadow-2xs transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
          <p className="text-[11px] text-gray-400 font-medium">{data.step1.description.length}/300</p>
        </div>
      </section>

      {/* Contact */}
      <section className="p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900">Contact</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Phone numbers customers can reach you on.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number *"
            placeholder="e.g. +92 300 1234567"
            value={data.step1.phoneNumber}
            onChange={(e) => updateStep1({ phoneNumber: e.target.value })}
          />
          <Input
            label="Alternate Phone (optional)"
            placeholder="e.g. +92 321 7654321"
            value={data.step1.alternatePhoneNumber}
            onChange={(e) => updateStep1({ alternatePhoneNumber: e.target.value })}
          />
        </div>
      </section>

      {/* Map Location */}
      <section className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100/80 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#0b3327]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Pin Location on Map *</h3>
            <p className="text-[11px] text-gray-500">Search or click the map to set your facility&apos;s exact location.</p>
          </div>
        </div>
        <LocationMapPicker
          latitude={data.step1.latitude ? parseFloat(data.step1.latitude) : null}
          longitude={data.step1.longitude ? parseFloat(data.step1.longitude) : null}
          onLocationChange={(lat, lng, address) => {
            updateStep1({
              latitude: lat.toString(),
              longitude: lng.toString(),
              ...(address ? { address } : {}),
            });
          }}
        />

        {/* Address details — auto-filled by map, but still editable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              placeholder="Auto-filled when you pin a location above"
              value={data.step1.address}
              onChange={(e) => updateStep1({ address: e.target.value })}
            />
          </div>
          <Select
            label="City"
            value={data.step1.city}
            onChange={(e) => updateStep1({ city: e.target.value })}
            options={[
              { value: 'Lahore', label: 'Lahore' },
              { value: 'Karachi', label: 'Karachi' },
              { value: 'Islamabad', label: 'Islamabad' },
              { value: 'Rawalpindi', label: 'Rawalpindi' },
              { value: 'Faisalabad', label: 'Faisalabad' },
              { value: 'Multan', label: 'Multan' },
            ]}
          />
        </div>
      </section>

      {/* Amenities */}
      <section className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900">Amenities</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Select the facilities available at your ground.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5">
          {AMENITIES.map((amenity) => {
            const isSelected = data.step1.amenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`
                  flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                  }
                `}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                  {amenity.label}
                </span>
                <span
                  className={`
                    relative flex items-center justify-center w-4 h-4 rounded-full border transition-all
                    ${isSelected ? 'border-[#0b3327] bg-[#0b3327]' : 'border-gray-300 bg-white'}
                  `}
                >
                  {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Photos */}
      <section className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100/80 text-emerald-900 flex items-center justify-center">
            <Images className="w-4 h-4 text-[#0b3327]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Ground Photos</h3>
            <p className="text-[11px] text-gray-500">Upload up to 6 photos (JPG, PNG. Max 2MB each)</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          className="hidden"
          onChange={handlePhotosSelect}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.step1.photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`Ground photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-1.5 right-1.5 p-1 bg-gray-900/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {data.step1.photos.length < 6 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ImagePlus className="w-5 h-5 text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-500">Add Photos</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};