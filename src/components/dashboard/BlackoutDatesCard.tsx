'use client';

import React, { useState } from 'react';
import { CalendarX, X, Plus } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

export const BlackoutDatesCard: React.FC = () => {
  const { data, updateStep2 } = useAddGround();
  const blackouts = data.step2.blackouts;

  const [showAddInput, setShowAddInput] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDates, setNewDates] = useState('');

  const handleRemove = (id: string) => {
    updateStep2({ blackouts: blackouts.filter((item) => item.id !== id) });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDates.trim()) return;

    updateStep2({
      blackouts: [
        ...blackouts,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: newName.trim(),
          dateRange: newDates.trim(),
          colorClass: 'bg-emerald-50/80 border-emerald-100 text-emerald-900',
        },
      ],
    });

    setNewName('');
    setNewDates('');
    setShowAddInput(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-900">
        <CalendarX className="w-4 h-4 text-red-500" />
        <h3 className="text-xs font-bold">Blackout Dates</h3>
      </div>

      {/* List Items */}
      <div className="space-y-2.5">
        {blackouts.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${item.colorClass}`}
          >
            <div>
              <h4 className="text-xs font-bold">{item.name}</h4>
              <p className="text-[11px] opacity-75 font-medium">{item.dateRange}</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="p-1 hover:opacity-100 opacity-60 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Blackout Input Form / Button */}
      {showAddInput ? (
        <form onSubmit={handleAdd} className="space-y-2 pt-1">
          <input
            type="text"
            placeholder="Event Name (e.g. Holiday)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
          />
          <input
            type="text"
            placeholder="Date Range (e.g. Dec 25)"
            value={newDates}
            onChange={(e) => setNewDates(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#0b3327] text-white py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Add Date
            </button>
            <button
              type="button"
              onClick={() => setShowAddInput(false)}
              className="px-3 bg-gray-100 text-gray-600 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddInput(true)}
          className="w-full border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Blackout Date
        </button>
      )}
    </div>
  );
};