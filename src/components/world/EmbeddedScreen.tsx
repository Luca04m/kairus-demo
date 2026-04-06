"use client";

import { motion } from 'framer-motion';
import type { DepartmentId } from '@/types/departments';
import { useDomains } from './DomainContext';

interface EmbeddedScreenProps {
  domain: DepartmentId;
  type: 'monitor' | 'projectorScreen';
  x: number;
  y: number;
  tileSize: number;
}

const SCREEN_SIZES = {
  monitor: { w: 32, h: 20, offsetX: 5, offsetY: 6 },
  projectorScreen: { w: 48, h: 28, offsetX: 6, offsetY: 8 },
};

export function EmbeddedScreen({ domain, type, x, y, tileSize }: EmbeddedScreenProps) {
  const domains = useDomains();
  const cfg = SCREEN_SIZES[type];
  const d = domains[domain];

  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: x * tileSize + cfg.offsetX,
        top: y * tileSize + cfg.offsetY,
        width: cfg.w,
        height: cfg.h,
        borderRadius: 2,
        zIndex: y + 2,
      }}
    >
      <svg width={cfg.w} height={cfg.h} viewBox={`0 0 ${cfg.w} ${cfg.h}`}>
        <rect width={cfg.w} height={cfg.h} fill="#0a0a0a" rx="1" />
        {domain === 'financeiro' && <DataScreenContent w={cfg.w} h={cfg.h} color={d.tileColor} />}
        {domain === 'marketing' && <ContentScreenContent w={cfg.w} h={cfg.h} color={d.tileColor} />}
        {domain === 'vendas' && <SalesScreenContent w={cfg.w} h={cfg.h} color={d.tileColor} />}
        {domain === 'operacoes' && <OpsScreenContent w={cfg.w} h={cfg.h} color={d.tileColor} />}
        {domain === 'atendimento' && <DevScreenContent w={cfg.w} h={cfg.h} color={d.tileColor} />}
        <rect width={cfg.w} height={cfg.h} fill="url(#screenGlare)" rx="1" />
        <defs>
          <linearGradient id="screenGlare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.06" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.03" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DevScreenContent({ w, h, color }: { w: number; h: number; color: string }) {
  const lineWidths = [18, 12, 22, 8, 16, 20, 14, 10, 24, 6];
  return (
    <g>
      <motion.g animate={{ y: [0, -30] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        {lineWidths.map((lw, i) => (
          <rect key={i} x={3} y={i * 4 + 2} width={Math.min(lw, w - 6)} height={2} fill={i % 3 === 0 ? color : i % 3 === 1 ? '#6C5CE7' : '#636E72'} opacity={0.7} rx="0.5" />
        ))}
        {lineWidths.map((lw, i) => (
          <rect key={`b-${i}`} x={3} y={(i + lineWidths.length) * 4 + 2} width={Math.min(lw, w - 6)} height={2} fill={i % 3 === 0 ? color : i % 3 === 1 ? '#6C5CE7' : '#636E72'} opacity={0.7} rx="0.5" />
        ))}
      </motion.g>
      <rect x={0} y={0} width={2} height={h} fill={color} opacity={0.15} />
    </g>
  );
}

function DataScreenContent({ w, h, color }: { w: number; h: number; color: string }) {
  const bars = 6;
  const barW = Math.floor((w - 8) / bars) - 1;
  return (
    <g>
      <line x1={2} y1={h - 3} x2={w - 2} y2={h - 3} stroke="#333" strokeWidth="0.5" />
      {Array.from({ length: bars }).map((_, i) => {
        const maxH = h - 6;
        const barH = (maxH * (0.3 + Math.sin(i * 1.2) * 0.35 + 0.35));
        return (
          <motion.rect
            key={i}
            x={3 + i * (barW + 1)}
            width={barW}
            rx="0.5"
            fill={i % 2 === 0 ? color : `${color}88`}
            opacity={0.8}
            animate={{ y: [h - 3 - barH, h - 3 - barH * 0.7, h - 3 - barH], height: [barH, barH * 0.7, barH] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        );
      })}
    </g>
  );
}

function ContentScreenContent({ w, h, color }: { w: number; h: number; color: string }) {
  const cx = w / 2;
  const cy = h / 2;
  return (
    <g>
      <rect x={2} y={2} width={w - 4} height={h - 4} fill="#1a1a1a" rx="1" />
      <motion.circle cx={cx} cy={cy} r={6} fill={color} opacity={0.8} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <polygon points={`${cx - 2},${cy - 3} ${cx - 2},${cy + 3} ${cx + 3},${cy}`} fill="white" opacity={0.9} />
      <rect x={3} y={h - 4} width={w - 6} height={1.5} fill="#333" rx="0.5" />
      <motion.rect x={3} y={h - 4} height={1.5} fill={color} rx="0.5" animate={{ width: [0, w - 6] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
    </g>
  );
}

function SalesScreenContent({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={2} y={2} width={w / 2 - 3} height={h / 2 - 2} fill="#1a1a1a" rx="1" />
      <rect x={w / 2 + 1} y={2} width={w / 2 - 3} height={h / 2 - 2} fill="#1a1a1a" rx="1" />
      <polygon points={`${w / 4},${4} ${w / 4 - 2},${7} ${w / 4 + 2},${7}`} fill="#2ED573" />
      <rect x={w / 4 - 4} y={8} width={8} height={1.5} fill={color} opacity={0.5} rx="0.5" />
      <motion.text x={w * 3 / 4} y={9} fill={color} fontSize="5" textAnchor="middle" fontFamily="monospace" fontWeight="bold" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>$</motion.text>
      <polyline
        points={Array.from({ length: 8 }, (_, i) => `${3 + i * ((w - 6) / 7)},${h - 4 - Math.sin(i * 0.8) * 4 - 2}`).join(' ')}
        fill="none" stroke={color} strokeWidth="1" opacity={0.6}
      />
    </g>
  );
}

function OpsScreenContent({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={5} fill="#2a2a2a" />
      <circle cx={3} cy={2.5} r={1} fill="#FF5F56" />
      <circle cx={6} cy={2.5} r={1} fill="#FFBD2E" />
      <circle cx={9} cy={2.5} r={1} fill="#27CA40" />
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
        <rect x={2} y={7} width={4} height={1.5} fill={color} opacity={0.8} />
        <rect x={7} y={7} width={14} height={1.5} fill="#636E72" opacity={0.6} />
        <rect x={2} y={10} width={6} height={1.5} fill="#2ED573" opacity={0.6} />
        <rect x={9} y={10} width={10} height={1.5} fill="#636E72" opacity={0.5} />
        <rect x={2} y={13} width={3} height={1.5} fill={color} opacity={0.8} />
        <rect x={6} y={13} width={18} height={1.5} fill="#636E72" opacity={0.5} />
      </motion.g>
      <motion.rect x={2} y={h - 5} width={3} height={1.5} fill={color} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </g>
  );
}
