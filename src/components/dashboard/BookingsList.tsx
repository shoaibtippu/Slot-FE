// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Download,
//   SlidersHorizontal,
//   ChevronDown,
//   Eye,
//   MessageSquare,
//   MoreHorizontal,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Wallet,
//   CreditCard,
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

// interface Booking {
//   id: string;
//   player: { name: string; role: string; initials: string; avatarColor: string };
//   facility: string;
//   pitch?: string;
//   sport: 'Cricket' | 'Football' | 'Tennis' | 'Badminton';
//   date: string;
//   startTime: string;
//   endTime: string;
//   durationHrs: number;
//   totalPKR: number;
//   advancePKR: number;
//   advancePaid: boolean;
//   status: BookingStatus;
// }

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const GROUNDS = [
//   'Green Valley Cricket Ground',
//   'Elite Arena',
//   'City Sports Complex',
//   'North Lahore Ground',
// ];

// const BOOKINGS: Booking[] = [
//   {
//     id: 'BK-0042',
//     player: { name: 'James Duckworth', role: '4.8 · New User', initials: 'JD', avatarColor: 'bg-blue-100 text-blue-700' },
//     facility: 'Elite Arena', pitch: 'Pitch A', sport: 'Cricket',
//     date: 'Aug 10, 2024', startTime: '06:00 PM', endTime: '08:00 PM', durationHrs: 2,
//     totalPKR: 5000, advancePKR: 1500, advancePaid: true, status: 'Confirmed',
//   },
//   {
//     id: 'BK-0043',
//     player: { name: 'Salman Ali', role: 'Regular Player', initials: 'SA', avatarColor: 'bg-emerald-100 text-emerald-700' },
//     facility: 'Green Valley Main', pitch: undefined, sport: 'Football',
//     date: 'Aug 12, 2024', startTime: '09:00 PM', endTime: '09:30 PM', durationHrs: 0.5,
//     totalPKR: 3500, advancePKR: 1000, advancePaid: false, status: 'Pending',
//   },
//   {
//     id: 'BK-0044',
//     player: { name: 'Ayesha Tariq', role: 'New User', initials: 'AT', avatarColor: 'bg-purple-100 text-purple-700' },
//     facility: 'City Sports Complex', pitch: 'Court 2', sport: 'Tennis',
//     date: 'Aug 14, 2024', startTime: '10:00 AM', endTime: '11:00 AM', durationHrs: 1,
//     totalPKR: 2000, advancePKR: 500, advancePaid: true, status: 'Completed',
//   },
//   {
//     id: 'BK-0045',
//     player: { name: 'Hamza Malik', role: 'Regular Player', initials: 'HM', avatarColor: 'bg-amber-100 text-amber-700' },
//     facility: 'Elite Arena', pitch: 'Pitch B', sport: 'Cricket',
//     date: 'Aug 15, 2024', startTime: '04:00 PM', endTime: '07:00 PM', durationHrs: 3,
//     totalPKR: 7500, advancePKR: 2500, advancePaid: false, status: 'Cancelled',
//   },
//   {
//     id: 'BK-0046',
//     player: { name: 'Omar Farooq', role: 'Captain', initials: 'OF', avatarColor: 'bg-rose-100 text-rose-700' },
//     facility: 'Green Valley Main', pitch: undefined, sport: 'Football',
//     date: 'Aug 18, 2024', startTime: '08:00 PM', endTime: '10:00 PM', durationHrs: 2,
//     totalPKR: 4500, advancePKR: 1500, advancePaid: false, status: 'Pending',
//   },
// ];

// const SPORT_ICONS: Record<string, string> = {
//   Cricket: '🏏',
//   Football: '⚽',
//   Tennis: '🎾',
//   Badminton: '🏸',
// };

// const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; icon: React.ReactNode }> = {
//   Confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
//   Pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border border-amber-200',     icon: <Clock className="w-3 h-3" /> },
//   Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-200',           icon: <XCircle className="w-3 h-3" /> },
//   Completed: { label: 'Completed', className: 'bg-sky-50 text-sky-700 border border-sky-200',           icon: <CheckCircle className="w-3 h-3" /> },
// };

// const TABS = ['All Bookings', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

// const TAB_BADGE: Record<string, string> = {
//   'All Bookings': 'bg-gray-100 text-gray-600',
//   Pending:        'bg-amber-100 text-amber-700',
//   Confirmed:      'bg-emerald-100 text-emerald-700',
//   Completed:      'bg-sky-100 text-sky-700',
//   Cancelled:      'bg-red-100 text-red-600',
// };

// // ─── Calendar ─────────────────────────────────────────────────────────────────

// const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// interface CalProps {
//   startDate: Date | null;
//   endDate: Date | null;
//   onChange: (s: Date, e: Date | null) => void;
// }

// const CalendarPicker: React.FC<CalProps> = ({ startDate, endDate, onChange }) => {
//   const [vy, setVy] = useState(2024);
//   const [vm, setVm] = useState(7);
//   const [picking, setPicking] = useState<'start' | 'end'>('start');

//   const firstDay   = new Date(vy, vm, 1).getDay();
//   const daysInMon  = new Date(vy, vm + 1, 0).getDate();
//   const cells      = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMon }, (_, i) => i + 1)];

//   const prev = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1);
//   const next = () => vm === 11 ? (setVm(0), setVy(y => y + 1)) : setVm(m => m + 1);

//   const same = (a: Date | null, b: Date | null) =>
//     !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

//   const between = (day: number) => {
//     if (!startDate || !endDate) return false;
//     const d = new Date(vy, vm, day);
//     return d > startDate && d < endDate;
//   };

//   const pick = (day: number) => {
//     const clicked = new Date(vy, vm, day);
//     if (picking === 'start' || !startDate) {
//       onChange(clicked, null);
//       setPicking('end');
//     } else {
//       onChange(clicked < startDate ? clicked : startDate, clicked < startDate ? startDate : clicked);
//       setPicking('start');
//     }
//   };

//   return (
//     <div className="w-64 p-3 select-none">
//       <div className="flex items-center justify-between mb-3">
//         <button onClick={prev} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
//         <span className="text-sm font-semibold text-gray-800">{MONTHS[vm]} {vy}</span>
//         <button onClick={next} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronRight className="w-4 h-4" /></button>
//       </div>
//       <div className="grid grid-cols-7 mb-1">
//         {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>)}
//       </div>
//       <div className="grid grid-cols-7 gap-y-0.5">
//         {cells.map((day, i) => {
//           if (!day) return <div key={`e-${i}`} />;
//           const thisDate = new Date(vy, vm, day);
//           const isStart  = same(thisDate, startDate);
//           const isEnd    = same(thisDate, endDate);
//           const inRange  = between(day);
//           return (
//             <button
//               key={day}
//               onClick={() => pick(day)}
//               className={[
//                 'w-full aspect-square text-xs flex items-center justify-center transition-colors font-medium',
//                 isStart || isEnd ? 'bg-emerald-600 text-white rounded-full' : '',
//                 inRange          ? 'bg-emerald-50 text-emerald-700 rounded-none' : '',
//                 !isStart && !isEnd && !inRange ? 'text-gray-700 hover:bg-gray-100 rounded-full' : '',
//               ].join(' ')}
//             >
//               {day}
//             </button>
//           );
//         })}
//       </div>
//       <p className="text-[10px] text-gray-400 text-center mt-3">
//         {picking === 'start' ? 'Pick start date' : 'Now pick end date'}
//       </p>
//     </div>
//   );
// };

// // ─── Click-outside hook ───────────────────────────────────────────────────────

// function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
//   useEffect(() => {
//     const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, [ref, cb]);
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export const BookingsList: React.FC = () => {
//   const [activeTab,      setActiveTab]      = useState('All Bookings');
//   const [selectedGround, setSelectedGround] = useState(GROUNDS[0]);
//   const [startDate,      setStartDate]      = useState<Date | null>(new Date(2024, 7, 1));
//   const [endDate,        setEndDate]        = useState<Date | null>(new Date(2024, 7, 31));
//   const [groundOpen,     setGroundOpen]     = useState(false);
//   const [calOpen,        setCalOpen]        = useState(false);
//   const [moreOpen,       setMoreOpen]       = useState<string | null>(null);

//   const groundRef = useRef<HTMLDivElement>(null);
//   const calRef    = useRef<HTMLDivElement>(null);
//   useClickOutside(groundRef, () => setGroundOpen(false));
//   useClickOutside(calRef,    () => setCalOpen(false));

//   const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   const dateLabel = !startDate ? 'Select dates' : endDate ? `${fmtDate(startDate)} – ${fmtDate(endDate)}` : fmtDate(startDate);

//   const filtered  = activeTab === 'All Bookings' ? BOOKINGS : BOOKINGS.filter(b => b.status === activeTab);
//   const tabCount  = (t: string) => t === 'All Bookings' ? BOOKINGS.length : BOOKINGS.filter(b => b.status === t).length;
//   const revenue   = filtered.reduce((s, b) => s + b.totalPKR, 0);

//   // same pixel widths in header and rows
//   const COL = '56px 1fr 150px 195px 175px 135px 170px';

//   return (
//     <div className="w-full space-y-0">

//       {/* ── Header ── */}
//       <div className="flex items-start justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             Manage and track all facility <span className="text-emerald-600 font-medium">reservations</span>.
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center gap-2 flex-shrink-0">

//           {/* Ground dropdown */}
//           <div ref={groundRef} className="relative">
//             <button
//               onClick={() => { setGroundOpen(o => !o); setCalOpen(false); }}
//               className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-emerald-400 transition-colors font-medium"
//             >
//               <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
//               <span className="max-w-[150px] truncate">{selectedGround}</span>
//               <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${groundOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {groundOpen && (
//               <div className="absolute right-0 top-[calc(100%+6px)] w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1">
//                 {GROUNDS.map(g => (
//                   <button
//                     key={g}
//                     onClick={() => { setSelectedGround(g); setGroundOpen(false); }}
//                     className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
//                       g === selectedGround ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
//                     <span className="truncate">{g}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Date range calendar */}
//           <div ref={calRef} className="relative">
//             <button
//               onClick={() => { setCalOpen(o => !o); setGroundOpen(false); }}
//               className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-emerald-400 transition-colors font-medium"
//             >
//               <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
//               </svg>
//               <span className="whitespace-nowrap">{dateLabel}</span>
//               <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${calOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {calOpen && (
//               <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-xl shadow-lg z-40">
//                 <CalendarPicker
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
//                 />
//                 <div className="flex items-center justify-end gap-2 px-3 pb-3 border-t border-gray-100 pt-2">
//                   <button
//                     onClick={() => { setStartDate(null); setEndDate(null); }}
//                     className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                   >Clear</button>
//                   <button
//                     onClick={() => setCalOpen(false)}
//                     className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
//                   >Apply</button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Icon buttons */}
//           <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
//             <SlidersHorizontal className="w-4 h-4" />
//           </button>
//           <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
//             <Download className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* ── Tabs — no scrollbar, hidden overflow ── */}
//       <div className="flex items-center border-b border-gray-200 mb-5">
//         {TABS.map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
//               activeTab === tab
//                 ? 'border-emerald-600 text-emerald-700'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             {tab}
//             <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${TAB_BADGE[tab]}`}>
//               {tabCount(tab)}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* ── Revenue card ── */}
//       <div className="mb-5">
//         <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
//             <p className="text-lg font-bold text-gray-900">PKR {revenue.toLocaleString()}</p>
//           </div>
//           <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
//             <Wallet className="w-4 h-4 text-emerald-600" />
//           </div>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

//         {/* Header row */}
//         <div
//           className="grid px-5 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
//           style={{ gridTemplateColumns: COL }}
//         >
//           <span>ID</span>
//           <span>Player</span>
//           <span>Facility / Sport</span>
//           <span>Date &amp; Time</span>
//           <span>Financials</span>
//           <span>Status</span>
//           <span className="text-right">Actions</span>
//         </div>

//         {/* Data rows */}
//         {filtered.length === 0 ? (
//           <div className="py-16 text-center">
//             <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
//               <line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>
//             </svg>
//             <p className="text-gray-400 text-sm font-medium">No bookings found</p>
//           </div>
//         ) : filtered.map((b, idx) => {
//           const st = STATUS_CONFIG[b.status];
//           return (
//             <div
//               key={b.id}
//               className={`grid px-5 py-4 items-center hover:bg-gray-50/60 transition-colors ${idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}
//               style={{ gridTemplateColumns: COL }}
//             >
//               {/* ID */}
//               <span className="text-xs font-bold text-gray-400">#{b.id.split('-')[1]}</span>

//               {/* Player */}
//               <div className="flex items-center gap-2.5 min-w-0 pr-3">
//                 <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${b.player.avatarColor}`}>
//                   {b.player.initials}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 truncate">{b.player.name}</p>
//                   <p className="text-xs text-gray-400">{b.player.role}</p>
//                 </div>
//               </div>

//               {/* Facility / Sport */}
//               <div className="min-w-0 pr-3">
//                 <p className="text-sm font-semibold text-gray-800 truncate">{b.facility}</p>
//                 <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                   <span>{SPORT_ICONS[b.sport]}</span>
//                   <span>{b.sport}</span>
//                   {b.pitch && <span className="text-gray-300">· {b.pitch}</span>}
//                 </p>
//               </div>

//               {/* Date & Time */}
//               <div className="pr-3">
//                 <p className="text-sm font-semibold text-gray-800">{b.date}</p>
//                 <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
//                   <span className="whitespace-nowrap">{b.startTime} – {b.endTime}</span>
//                   <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{b.durationHrs}h</span>
//                 </p>
//               </div>

//               {/* Financials */}
//               <div className="pr-3">
//                 <p className="text-sm font-bold text-gray-900">PKR {b.totalPKR.toLocaleString()}</p>
//                 <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
//                   <span>Adv: PKR {b.advancePKR.toLocaleString()}</span>
//                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${b.advancePaid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
//                     {b.advancePaid ? 'Paid' : 'Unpaid'}
//                   </span>
//                 </p>
//               </div>

//               {/* Status */}
//               <div>
//                 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
//                   {st.icon}{st.label}
//                 </span>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-1 justify-end">
//                 {b.status === 'Pending' && (
//                   <button
//                     onClick={() => alert(`Booking ${b.id} confirmed ✅`)}
//                     className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
//                   >
//                     Confirm
//                   </button>
//                 )}
//                 {b.status === 'Pending' && !b.advancePaid && (
//                   <button
//                     title="Request advance payment"
//                     onClick={() => alert(`Advance requested for ${b.id}`)}
//                     className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//                   >
//                     <CreditCard className="w-4 h-4" />
//                   </button>
//                 )}
//                 <button title="Message" className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
//                   <MessageSquare className="w-4 h-4" />
//                 </button>
//                 <button title="View details" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Eye className="w-4 h-4" />
//                 </button>
//                 <div className="relative">
//                   <button
//                     title="More"
//                     onClick={() => setMoreOpen(moreOpen === b.id ? null : b.id)}
//                     className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <MoreHorizontal className="w-4 h-4" />
//                   </button>
//                   {moreOpen === b.id && (
//                     <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-sm">
//                       <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">View receipt</button>
//                       <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">Send reminder</button>
//                       <button className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600">Cancel booking</button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Pagination ── */}
//       <div className="flex items-center justify-between pt-4">
//         <p className="text-sm text-gray-500">
//           Showing <span className="font-semibold text-gray-700">1 to {filtered.length}</span> of{' '}
//           <span className="font-semibold text-gray-700">{filtered.length}</span> bookings
//         </p>
//         <div className="flex items-center gap-1">
//           <button disabled className="p-2 text-gray-300 border border-gray-200 rounded-lg disabled:opacity-40">
//             <ChevronLeft className="w-4 h-4" />
//           </button>
//           <button className="w-8 h-8 text-sm font-bold bg-emerald-600 text-white rounded-lg">1</button>
//           <button className="w-8 h-8 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
//           <button className="w-8 h-8 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
//           <span className="px-1 text-gray-400 text-sm">…</span>
//           <button className="p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone,
  CalendarDays,
  Hash,
  ReceiptText
} from 'lucide-react';
import { SideDrawer } from '../common/SideDrawer'; // Adjust this path if necessary

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

interface Booking {
  id: string;
  player: { name: string; role: string; initials: string; avatarColor: string; phone: string };
  facility: string;
  pitch?: string;
  sport: 'Cricket' | 'Football' | 'Tennis' | 'Badminton';
  date: string;
  startTime: string;
  endTime: string;
  durationHrs: number;
  totalPKR: number;
  advancePKR: number;
  advancePaid: boolean;
  status: BookingStatus;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROUNDS = [
  'Green Valley Cricket Ground',
  'Elite Arena',
  'City Sports Complex',
  'North Lahore Ground',
];

const BOOKINGS: Booking[] = [
  {
    id: 'BK-0042',
    player: { name: 'James Duckworth', role: '4.8 · New User', initials: 'JD', avatarColor: 'bg-slate-800 text-white', phone: '+92 300 1234567' },
    facility: 'Elite Arena', pitch: 'Pitch A (Cricket) • Hardball allowed', sport: 'Cricket',
    date: 'Saturday, Aug 10, 2024', startTime: '06:00 PM', endTime: '08:00 PM', durationHrs: 2,
    totalPKR: 5000, advancePKR: 1500, advancePaid: true, status: 'Confirmed',
  },
  {
    id: 'BK-0043',
    player: { name: 'Salman Ali', role: 'Regular Player', initials: 'SA', avatarColor: 'bg-emerald-800 text-white', phone: '+92 321 7654321' },
    facility: 'Green Valley Main', pitch: undefined, sport: 'Football',
    date: 'Monday, Aug 12, 2024', startTime: '09:00 PM', endTime: '09:30 PM', durationHrs: 0.5,
    totalPKR: 3500, advancePKR: 1000, advancePaid: false, status: 'Pending',
  },
];

const SPORT_ICONS: Record<string, string> = {
  Cricket: '🏏',
  Football: '⚽',
  Tennis: '🎾',
  Badminton: '🏸',
};

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
  Pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border border-amber-200',     icon: <Clock className="w-3 h-3" /> },
  Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-200',           icon: <XCircle className="w-3 h-3" /> },
  Completed: { label: 'Completed', className: 'bg-sky-50 text-sky-700 border border-sky-200',           icon: <CheckCircle className="w-3 h-3" /> },
};

const TABS = ['All Bookings', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

const TAB_BADGE: Record<string, string> = {
  'All Bookings': 'bg-gray-100 text-gray-600',
  Pending:        'bg-amber-100 text-amber-700',
  Confirmed:      'bg-emerald-100 text-emerald-700',
  Completed:      'bg-sky-100 text-sky-700',
  Cancelled:      'bg-red-100 text-red-600',
};

// ─── Click-outside hook ───────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

// ─── Main List Component ──────────────────────────────────────────────────────

export const BookingsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [selectedGround, setSelectedGround] = useState(GROUNDS[0]);
  const [groundOpen, setGroundOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState<string | null>(null);
  
  // State for the SideDrawer
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const groundRef = useRef<HTMLDivElement>(null);
  useClickOutside(groundRef, () => setGroundOpen(false));

  const filtered = activeTab === 'All Bookings' ? BOOKINGS : BOOKINGS.filter(b => b.status === activeTab);
  const tabCount = (t: string) => t === 'All Bookings' ? BOOKINGS.length : BOOKINGS.filter(b => b.status === t).length;
  const revenue = filtered.reduce((s, b) => s + b.totalPKR, 0);

  const COL = '56px 1fr 150px 195px 175px 135px 170px';

  return (
    <div className="w-full space-y-0 relative">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track all facility <span className="text-emerald-600 font-medium">reservations</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div ref={groundRef} className="relative">
            <button
              onClick={() => setGroundOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-emerald-400 transition-colors font-medium"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="max-w-[150px] truncate">{selectedGround}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${groundOpen ? 'rotate-180' : ''}`} />
            </button>
            {groundOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1">
                {GROUNDS.map(g => (
                  <button
                    key={g}
                    onClick={() => { setSelectedGround(g); setGroundOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${g === selectedGround ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{g}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center border-b border-gray-200 mb-5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${TAB_BADGE[tab]}`}>{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* ── Revenue card ── */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">PKR {revenue.toLocaleString()}</p>
          </div>
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="grid px-5 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns: COL }}>
          <span>ID</span>
          <span>Player</span>
          <span>Facility / Sport</span>
          <span>Date &amp; Time</span>
          <span>Financials</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {filtered.map((b, idx) => {
          const st = STATUS_CONFIG[b.status];
          return (
            <div key={b.id} className={`grid px-5 py-4 items-center hover:bg-gray-50/60 transition-colors ${idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`} style={{ gridTemplateColumns: COL }}>
              <span className="text-xs font-bold text-gray-400">#{b.id.split('-')[1]}</span>
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${b.player.avatarColor}`}>{b.player.initials}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{b.player.name}</p>
                  <p className="text-xs text-gray-400">{b.player.role}</p>
                </div>
              </div>
              <div className="min-w-0 pr-3">
                <p className="text-sm font-semibold text-gray-800 truncate">{b.facility}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <span>{SPORT_ICONS[b.sport]}</span><span>{b.sport}</span>
                </p>
              </div>
              <div className="pr-3">
                <p className="text-sm font-semibold text-gray-800">{b.date.split(',')[1]}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <span className="whitespace-nowrap">{b.startTime} – {b.endTime}</span>
                </p>
              </div>
              <div className="pr-3">
                <p className="text-sm font-bold text-gray-900">PKR {b.totalPKR.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <span>Adv: PKR {b.advancePKR.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${b.advancePaid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{b.advancePaid ? 'Paid' : 'Unpaid'}</span>
                </p>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>{st.icon}{st.label}</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <button title="Message" className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                {/* ── Eye Icon triggers Drawer ── */}
                <button 
                  title="View details" 
                  onClick={() => setSelectedBooking(b)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button title="More" onClick={() => setMoreOpen(moreOpen === b.id ? null : b.id)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {moreOpen === b.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-sm">
                      <button className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600">Cancel booking</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Generic SideDrawer for Booking Details ── */}
      <SideDrawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        headerRight={
          selectedBooking && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {selectedBooking.status}
            </div>
          )
        }
        footer={
          <div className="grid grid-cols-2 gap-3 w-full">
            <button className="w-full py-2.5 bg-[#eff6ff] text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors">
              Mark Completed
            </button>
            <button className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 text-sm font-semibold rounded-xl hover:bg-rose-50 transition-colors">
              Cancel Booking
            </button>
          </div>
        }
      >
        {selectedBooking && (
          <>
            {/* User Info Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${selectedBooking.player.avatarColor}`}>
                  {selectedBooking.player.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedBooking.player.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.player.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reservation Details</h4>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Ground & Pitch</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedBooking.facility}</p>
                    {selectedBooking.pitch && <p className="text-xs text-gray-500">{selectedBooking.pitch}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><CalendarDays className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date & Time</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedBooking.date}</p>
                    <div className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md mt-1">
                      {selectedBooking.startTime} – {selectedBooking.endTime} ({selectedBooking.durationHrs} hrs)
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400"><Hash className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Booking ID</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">#{selectedBooking.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Breakdown</h4>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Base Rate ({selectedBooking.durationHrs} hrs @ {(selectedBooking.totalPKR / selectedBooking.durationHrs).toLocaleString()}/hr)</span>
                  <span className="font-semibold text-gray-900">PKR {selectedBooking.totalPKR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Equipment Rental (Lights)</span>
                  <span className="font-semibold text-gray-900">Included</span>
                </div>
                
                <div className="h-px bg-gray-100 w-full" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="text-base font-bold text-gray-900">PKR {selectedBooking.totalPKR.toLocaleString()}</span>
                </div>

                {selectedBooking.advancePaid && (
                  <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-800">Advance Paid</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">PKR {selectedBooking.advancePKR.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-emerald-600/80">Paid via Bank Transfer on Aug 5, 10:42 AM</p>
                    <button className="flex items-center gap-2 w-max text-xs font-semibold text-emerald-700 bg-white/60 hover:bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors">
                      <ReceiptText className="w-3.5 h-3.5" /> View Receipt
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">Remaining Balance</span>
                  <span className="text-sm font-bold text-rose-500">PKR {(selectedBooking.totalPKR - selectedBooking.advancePKR).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="space-y-3 pb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline</h4>
                <div className="flex items-start gap-3">
                    <div className="mt-1"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Booking Requested</p>
                      <p className="text-xs text-gray-400">Aug 5, 10:30 AM</p>
                    </div>
                </div>
            </div>
          </>
        )}
      </SideDrawer>
    </div>
  );
};