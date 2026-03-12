import React from 'react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  size?: number;
  hideText?: boolean;
}
export function Logo({ className, size = 32, hideText = false }: LogoProps) {
  // SVG size is increased by 20% relative to the base size to provide more visual weight
  const svgSize = size * 1.2;
  const fontSize = Math.max(size * 0.55, 14);
  const suffixSize = Math.max(size * 0.3, 10);
  return (
    <div className={cn("flex items-center gap-3 shrink-0", className)}>
      <div style={{ width: svgSize, height: svgSize }} className="shrink-0 transition-transform duration-300">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]"
        >
          {/* Monitor Frame */}
          <rect
            x="5"
            y="10"
            width="90"
            height="70"
            rx="8"
            className="fill-slate-900 stroke-slate-700"
            strokeWidth="4"
          />
          {/* Screen Area */}
          <rect
            x="12"
            y="17"
            width="76"
            height="50"
            rx="4"
            className="fill-slate-950"
          />
          {/* ECG Waveform - Increased stroke width for better legibility at scale */}
          <path
            d="M15 42H25L32 25L45 65L52 42H62L68 35L75 42H85"
            className="stroke-orange-500"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hardware Knobs */}
          <circle cx="25" cy="87" r="4" className="fill-slate-700" />
          <circle cx="50" cy="87" r="4" className="fill-slate-700" />
          <circle cx="75" cy="87" r="4" className="fill-slate-700" />
          {/* Active Status Light */}
          <circle cx="85" cy="22" r="2.5" className="fill-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" />
        </svg>
      </div>
      {!hideText && (
        <div className="flex items-baseline gap-0.5">
          <span
            style={{ fontSize }}
            className="font-display font-black tracking-tighter select-none whitespace-nowrap uppercase bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 text-transparent bg-clip-text drop-shadow-sm"
          >
            BCT Akademi
          </span>
          <span
            style={{ fontSize: suffixSize }}
            className="font-display font-bold text-slate-500 select-none opacity-50"
          >
            .com
          </span>
        </div>
      )}
    </div>
  );
}