import React from 'react';

export const StadiumCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group transition-all duration-500">
      {/* Stadium Floodlights & Atmosphere Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051c15] via-[#093529] to-[#041711]">
        {/* Glowing Floodlight Beams */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4/5 h-36 bg-gradient-to-b from-cyan-200/30 via-emerald-400/10 to-transparent blur-xl rounded-full pointer-events-none" />
        
        {/* Lights Source Fixtures */}
        <div className="absolute top-3 left-8 right-8 flex justify-between items-center z-10 opacity-90">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={`l-${i}`} className="w-2 h-1.5 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
            ))}
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={`r-${i}`} className="w-2 h-1.5 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
            ))}
          </div>
        </div>

        {/* Stadium Stands Vignette */}
        <div className="absolute top-8 left-0 right-0 h-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/60 via-[#0a2c22]/80 to-transparent" />
      </div>

      {/* Turf Field Perspective Grid */}
      <div className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-b from-[#15803d] via-[#166534] to-[#0f5128] border-t border-emerald-400/30 shadow-inner overflow-hidden">
        {/* Field Stripes */}
        <div className="absolute inset-0 flex flex-col">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-full flex-1 ${i % 2 === 0 ? 'bg-emerald-600/20' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Tactical Pitch Lines & Markings */}
        <div className="absolute inset-x-3 top-2 bottom-2 border border-white/60 rounded-sm">
          {/* Halfway Line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/60" />
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          {/* Left Penalty Area */}
          <div className="absolute inset-y-6 left-0 w-12 border-r border-y border-white/60" />

          {/* Right Penalty Area */}
          <div className="absolute inset-y-6 right-0 w-12 border-l border-y border-white/60" />
        </div>

        {/* Lighting Flare Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Glossy Reflection Card Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};
