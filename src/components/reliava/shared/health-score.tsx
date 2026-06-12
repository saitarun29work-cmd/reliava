'use client';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// HealthScoreRing — circular SVG health score indicator
// ---------------------------------------------------------------------------

interface HealthScoreRingProps {
  /** Score between 0 and 100 */
  score: number;
  /** Visual size of the ring */
  size?: 'sm' | 'md' | 'lg';
  /** Show "Health Score" label beneath the ring */
  showLabel?: boolean;
  /** Additional CSS classes on the wrapper */
  className?: string;
}

const SIZE_MAP = { sm: 60, md: 80, lg: 120 } as const;
const STROKE_MAP = { sm: 4, md: 6, lg: 8 } as const;

function getScoreColor(score: number): string {
  if (score >= 75) return 'oklch(0.765 0.177 163.223)'; // emerald-400
  if (score >= 50) return 'oklch(0.828 0.189 84.429)';  // amber-400
  if (score >= 25) return 'oklch(0.805 0.177 47.604)';  // orange-400
  return 'oklch(0.704 0.191 22.216)';                      // red-400
}

function getScoreLabelColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  if (score >= 25) return 'text-orange-400';
  return 'text-red-400';
}

export function HealthScoreRing({
  score,
  size = 'md',
  showLabel = false,
  className,
}: HealthScoreRingProps) {
  const px = SIZE_MAP[size];
  const stroke = STROKE_MAP[size];
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);
  const labelColor = getScoreLabelColor(clampedScore);

  // Center of the SVG
  const center = px / 2;

  return (
    <div className={cn('inline-flex flex-col items-center gap-1.5', className)}>
      <div className="relative" style={{ width: px, height: px }}>
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted-foreground/15"
          />
          {/* Foreground arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        {/* Centered score number */}
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold tabular-nums select-none',
            labelColor,
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-xl',
          )}
        >
          {Math.round(clampedScore)}
        </span>
      </div>

      {showLabel && (
        <span className="text-xs text-muted-foreground">Health Score</span>
      )}
    </div>
  );
}