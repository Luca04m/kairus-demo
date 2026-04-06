"use client";

import { useState, useEffect } from 'react';

export interface DayNightState {
  progress: number;
  period: 'night' | 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'evening';
  overlayColor: string;
  overlayOpacity: number;
}

function getTimeState(hour: number, minute: number): DayNightState {
  const progress = (hour + minute / 60) / 24;

  if (hour >= 22 || hour < 5) {
    return { progress, period: 'night', overlayColor: '#0a1628', overlayOpacity: 0.25 };
  }
  if (hour >= 5 && hour < 7) {
    const t = (hour - 5 + minute / 60) / 2;
    return { progress, period: 'dawn', overlayColor: '#FF9F43', overlayOpacity: 0.08 * (1 - t) };
  }
  if (hour >= 7 && hour < 12) {
    return { progress, period: 'morning', overlayColor: '#87CEEB', overlayOpacity: 0.02 };
  }
  if (hour >= 12 && hour < 17) {
    return { progress, period: 'afternoon', overlayColor: '#FFD700', overlayOpacity: 0.03 };
  }
  if (hour >= 17 && hour < 19) {
    const t = (hour - 17 + minute / 60) / 2;
    return { progress, period: 'dusk', overlayColor: '#FF6B6B', overlayOpacity: 0.05 + t * 0.08 };
  }
  const t = (hour - 19 + minute / 60) / 3;
  return { progress, period: 'evening', overlayColor: '#1a1a4e', overlayOpacity: 0.1 + t * 0.12 };
}

export function useDayNightCycle(): DayNightState {
  const [state, setState] = useState<DayNightState>(() => {
    const now = new Date();
    return getTimeState(now.getHours(), now.getMinutes());
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setState(getTimeState(now.getHours(), now.getMinutes()));
    };
    const interval = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
