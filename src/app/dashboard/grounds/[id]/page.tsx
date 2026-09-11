'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Pencil, CheckCircle2, Loader2, MapPin, Phone, Star, Clock,
  Save, X, ImagePlus, AlertCircle,
} from 'lucide-react';
import {
  getOwnerGroundById, updateGround, updateGroundSchedules, uploadGroundImages,
} from '@/services/groundsService';
import { GroundDetailResponse } from '@/types/grounds';
import { LocationMapPicker } from '@/components/dashboard/LocationMapPicker';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ScheduleRow {
  dayOfWeek: number;
  openingTime: string; // HH:mm
  closingTime: string; // HH:mm
  isClosed: boolean;
}

function toHHmm(t: string): string {
  return t ? t.slice(0, 5) : '08:00';
}
function toHHmmss(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function groundToScheduleRows(
  schedules: GroundDetailResponse['schedules'],
): ScheduleRow[] {
  return DAY_NAMES.map((_, i) => {
    const s = schedules.find((x) => x.dayOfWeek === i);
    return {
      dayOfWeek: i,
      openingTime: s ? toHHmm(s.openingTime) : '08:00',
      closingTime: s ? toHHmm(s.closingTime) : '22:00',
      isClosed: s ? s.isClosed : false,
    };
  });
}

export default function GroundDetailEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const startInEdit = searchParams.get('edit') === 'true';

  const [ground, setGround] = useState<GroundDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState(startInEdit);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [advancePercentage, setAdvancePercentage] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);

  // Image upload
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    getOwnerGroundById(id)
      .then((g) => {
        setGround(g);
        resetForm(g);
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const resetForm = (g: GroundDetailResponse) => {
    setName(g.name ?? '');
    setDescription(g.description ?? '');
    setAddress(g.address ?? '');
    setPhoneNumber(g.phoneNumber ?? '');
    setAlternatePhoneNumber(g.alternatePhoneNumber ?? '');
    setHourlyRate(String(g.hourlyRate));
    setAdvancePercentage(String(g.advancePercentage));
    setLatitude(g.latitude);
    setLongitude(g.longitude);
    setSchedules(groundToScheduleRows(g.schedules));
  };

  const handleSave = async () => {
    if (!name.trim()) { setSaveError('Ground name is required.'); return; }
    if (!phoneNumber.trim()) { setSaveError('Phone number is required.'); return; }
    if (!latitude || !longitude) { setSaveError('Please set a location on the map.'); return; }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await updateGround(id, {
        name: name.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        latitude: Math.round(latitude * 1e7) / 1e7,
        longitude: Math.round(longitude * 1e7) / 1e7,
        phoneNumber: phoneNumber.trim(),
        alternatePhoneNumber: alternatePhoneNumber.trim() || null,
        hourlyRate: parseFloat(hourlyRate) || 0,
        advancePercentage: parseFloat(advancePercentage) || 0,
      });

      await updateGroundSchedules(id, schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        openingTime: toHHmmss(s.openingTime),
        closingTime: toHHmmss(s.closingTime),
        isClosed: s.isClosed,
      })));

      setGround(updated);
      resetForm(updated);
      setSaveSuccess(true);
      setIsEdit(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    setImageError(null);
    try {
      await uploadGroundImages(id, Array.from(files));
      const refreshed = await getOwnerGroundById(id);
      setGround(refreshed);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingImages(false);
    }
  };

  const updateScheduleRow = (i: number, patch: Partial<ScheduleRow>) => {
    setSchedules((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
      </div>
    );
  }
  if (loadError || !ground) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
        {loadError ?? 'Ground not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/grounds')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> My Grounds
        </button>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          {isEdit ? (
            <>
              <button
                type="button"
                onClick={() => { resetForm(ground); setIsEdit(false); setSaveError(null); }}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Ground
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {saveError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
        </div>
      )}

      {/* Hero / cover image */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="h-52 bg-gradient-to-br from-[#0b3327] to-emerald-600 relative overflow-hidden">
          {ground.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ground.images[0].imageUrl} alt={ground.name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-14 h-14 text-emerald-200/30" />
            </div>
          )}
        </div>

        <div className="p-6 space-y-2">
          {isEdit ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ground name"
              className="w-full text-xl font-black text-gray-900 border-b-2 border-[#0b3327]/30 focus:border-[#0b3327] focus:outline-none pb-1 bg-transparent"
            />
          ) : (
            <h1 className="text-xl font-black text-gray-900">{ground.name}</h1>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{ground.address ?? 'No address set'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{ground.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{ground.averageRating} ({ground.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Description" span="full">
            {isEdit ? (
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your ground…"
                className={INPUT + ' resize-none'}
              />
            ) : (
              <p className="text-xs text-gray-700">{ground.description || <span className="text-gray-400 italic">No description</span>}</p>
            )}
          </Field>
          <Field label="Phone Number">
            {isEdit ? (
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+92 3XX XXXXXXX" className={INPUT} />
            ) : (
              <p className="text-xs text-gray-800 font-medium">{ground.phoneNumber || '—'}</p>
            )}
          </Field>
          <Field label="Alternate Phone">
            {isEdit ? (
              <input value={alternatePhoneNumber} onChange={(e) => setAlternatePhoneNumber(e.target.value)} placeholder="Optional" className={INPUT} />
            ) : (
              <p className="text-xs text-gray-800 font-medium">{ground.alternatePhoneNumber || '—'}</p>
            )}
          </Field>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Hourly Rate (PKR)">
            {isEdit ? (
              <input
                type="number"
                min={0}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className={INPUT}
              />
            ) : (
              <p className="text-sm font-black text-gray-900">PKR {ground.hourlyRate.toLocaleString()} <span className="text-[11px] font-normal text-gray-400">/ hr</span></p>
            )}
          </Field>
          <Field label="Advance Payment (%)">
            {isEdit ? (
              <input
                type="number"
                min={0}
                max={100}
                value={advancePercentage}
                onChange={(e) => setAdvancePercentage(e.target.value)}
                className={INPUT}
              />
            ) : (
              <p className="text-sm font-black text-gray-900">{ground.advancePercentage}%</p>
            )}
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        {isEdit ? (
          <div className="space-y-3">
            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                className={INPUT}
              />
            </Field>
            <LocationMapPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng, addr) => {
                setLatitude(lat);
                setLongitude(lng);
                if (addr && !address) setAddress(addr);
              }}
            />
            {latitude && longitude && (
              <p className="text-[11px] text-gray-400 font-mono">
                {latitude.toFixed(7)}, {longitude.toFixed(7)}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-700">{ground.address || <span className="text-gray-400 italic">No address</span>}</p>
            {ground.latitude && ground.longitude && (
              <p className="text-[11px] text-gray-400 font-mono">
                {Number(ground.latitude).toFixed(7)}, {Number(ground.longitude).toFixed(7)}
              </p>
            )}
          </div>
        )}
      </Section>

      {/* Schedule */}
      <Section title="Weekly Schedule">
        {isEdit ? (
          <div className="space-y-1">
            {schedules.map((row, i) => (
              <div key={row.dayOfWeek} className={`grid grid-cols-[120px_1fr_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl border text-xs transition-all ${row.isClosed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-emerald-100'}`}>
                <span className="font-bold text-gray-800">{DAY_NAMES[row.dayOfWeek]}</span>
                <input
                  type="time"
                  value={row.openingTime}
                  disabled={row.isClosed}
                  onChange={(e) => updateScheduleRow(i, { openingTime: e.target.value })}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-[#0b3327] disabled:opacity-40 bg-white"
                />
                <input
                  type="time"
                  value={row.closingTime}
                  disabled={row.isClosed}
                  onChange={(e) => updateScheduleRow(i, { closingTime: e.target.value })}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-[#0b3327] disabled:opacity-40 bg-white"
                />
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <div
                    onClick={() => updateScheduleRow(i, { isClosed: !row.isClosed })}
                    className={`w-8 h-4.5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${row.isClosed ? 'bg-gray-200' : 'bg-emerald-500'}`}
                    style={{ height: '18px' }}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${row.isClosed ? '' : 'translate-x-3'}`} />
                  </div>
                  <span className={`text-[10px] font-bold ${row.isClosed ? 'text-gray-400' : 'text-emerald-600'}`}>
                    {row.isClosed ? 'Closed' : 'Open'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {schedules.map((row) => (
              <div
                key={row.dayOfWeek}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs ${row.isClosed ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-emerald-50/50 border-emerald-100'}`}
              >
                <span className="font-bold text-gray-800">{DAY_NAMES[row.dayOfWeek]}</span>
                {row.isClosed ? (
                  <span className="text-gray-400 font-medium">Closed</span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Clock className="w-3 h-3" />
                    {formatTime(row.openingTime)} – {formatTime(row.closingTime)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Images */}
      <Section title="Photos">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ground.images.map((img) => (
            <div key={img.id} className="aspect-video rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt="Ground" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Upload tile */}
          <label className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-[#0b3327] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            {uploadingImages ? (
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5 text-gray-400 group-hover:text-[#0b3327] transition-colors" />
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#0b3327] transition-colors">Add Photos</span>
              </>
            )}
          </label>
        </div>
        {imageError && <p className="text-xs text-red-600 font-medium mt-2">{imageError}</p>}
      </Section>

      {/* Sports */}
      {ground.sports.length > 0 && (
        <Section title="Sports">
          <div className="flex flex-wrap gap-2">
            {ground.sports.map((s) => (
              <span
                key={s.sportId}
                className="text-[11px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full"
              >
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Bottom save bar (shown in edit mode) */}
      {isEdit && (
        <div className="sticky bottom-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { resetForm(ground); setIsEdit(false); setSaveError(null); }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl shadow-md hover:bg-gray-50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-60 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

const INPUT = 'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327]';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  span,
  children,
}: {
  label: string;
  span?: 'full';
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${span === 'full' ? 'sm:col-span-2' : ''}`}>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
