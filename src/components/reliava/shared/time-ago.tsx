'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// TimeAgo — displays a human-readable relative timestamp
// ---------------------------------------------------------------------------

interface TimeAgoProps {
  /** ISO 8601 date string */
  date: string;
  className?: string;
}

function formatDate(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < 0) return formatDate(new Date(dateStr));

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(new Date(dateStr));
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  // Tick forces periodic re-renders so the computed label stays fresh.
  // setState is only called inside the interval callback (a subscription),
  // never synchronously in the effect body.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const label = relativeTime(date);

  return (
    <span className={cn('text-muted-foreground text-xs', className)}>
      {label}
    </span>
  );
}