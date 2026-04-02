'use client';

interface MilestoneMarkerProps {
  label: string;
  /** X position as percentage (0-100) */
  xPercent: number;
  color?: string;
}

export function MilestoneMarker({
  label,
  xPercent,
  color = '#f59e0b',
}: MilestoneMarkerProps) {
  return (
    <div
      className="absolute top-0 bottom-0 z-10 pointer-events-none"
      style={{ left: `${xPercent}%` }}
    >
      {/* Vertical dashed line */}
      <div
        className="absolute top-6 bottom-0 w-px"
        style={{
          background: `repeating-linear-gradient(to bottom, ${color}44 0px, ${color}44 4px, transparent 4px, transparent 8px)`,
        }}
      />
      {/* Diamond marker */}
      <div className="absolute -top-0.5 -translate-x-1/2 flex flex-col items-center pointer-events-auto group">
        <div
          className="h-3 w-3 rotate-45 rounded-[2px] border transition-transform duration-150 group-hover:scale-125"
          style={{
            background: `${color}33`,
            borderColor: `${color}88`,
          }}
        />
        {/* Tooltip */}
        <div className="absolute top-5 whitespace-nowrap rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] px-2 py-1 text-[10px] text-[rgba(255,255,255,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg">
          {label}
        </div>
      </div>
    </div>
  );
}
