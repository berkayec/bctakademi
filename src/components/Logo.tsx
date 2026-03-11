import React from 'react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  size?: number;
}
export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Academic Shield Shape */}
        <path
          d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z"
          className="fill-slate-900 stroke-teal-500"
          strokeWidth="4"
        />
        {/* ECG Pulse Wave */}
        <path
          d="M25 55H35L40 35L50 75L55 55H65L70 45L75 55H80"
          className="stroke-orange-500"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom Sparkle Detail */}
        <circle cx="50" cy="80" r="3" className="fill-teal-400 animate-pulse" />
      </svg>
    </div>
  );
}