import React from 'react';
import { Badge } from '../ui/Badge';
import { StadiumCard } from '../common/StadiumCard';

export const AuthHero: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-center items-center p-6 lg:p-10 xl:p-12 h-full w-full bg-[#0b3327] text-white overflow-hidden select-none">
      {/* Background Decorative Ambient Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a7f3d0]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full my-auto space-y-4">
        {/* Top Tagline Badge */}
        <Badge variant="mint" size="sm">ELEVATE YOUR GAME</Badge>

        {/* Main Headline */}
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
          Secure Your Slot on the Pitch.
        </h1>

        {/* Subtitle */}
        <p className="text-xs lg:text-sm text-emerald-100/80 leading-relaxed max-w-sm">
          Join thousands of athletes and facility owners managing professional sports grounds with Slot&apos;s high-performance digital infrastructure.
        </p>

        {/* Visual Stadium Showcase Card */}
        <div className="pt-3 w-full">
          <StadiumCard />
        </div>
      </div>
    </div>
  );
};
