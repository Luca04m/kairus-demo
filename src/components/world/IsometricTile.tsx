"use client";

import { motion } from 'framer-motion';
import { TILE_WIDTH, TILE_HEIGHT } from '@/data/world-layout';

interface IsometricTileProps {
  col: number;
  row: number;
  color: string;
  borderColor?: string;
  highlighted?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  offsetX?: number;
  offsetY?: number;
}

export function IsometricTile({
  col,
  row,
  color,
  borderColor,
  highlighted,
  pulse,
  onClick,
  children,
  className,
  offsetX = 0,
  offsetY = 0,
}: IsometricTileProps) {
  const px = (col - row) * (TILE_WIDTH / 2) + offsetX;
  const py = (col + row) * (TILE_HEIGHT / 2) + offsetY;

  return (
    <motion.div
      className={`absolute flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      style={{
        left: px,
        top: py,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
      }}
      whileHover={onClick ? { scale: 1.08, zIndex: 10 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      <svg
        viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      >
        <polygon
          points={`${TILE_WIDTH / 2},0 ${TILE_WIDTH},${TILE_HEIGHT / 2} ${TILE_WIDTH / 2},${TILE_HEIGHT} 0,${TILE_HEIGHT / 2}`}
          fill={color}
          stroke={borderColor || color}
          strokeWidth="1.5"
          opacity={highlighted ? 1 : 0.85}
        />
        {pulse && (
          <polygon
            points={`${TILE_WIDTH / 2},0 ${TILE_WIDTH},${TILE_HEIGHT / 2} ${TILE_WIDTH / 2},${TILE_HEIGHT} 0,${TILE_HEIGHT / 2}`}
            fill={color}
            opacity={0.4}
          >
            <animate
              attributeName="opacity"
              values="0.4;0.1;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </polygon>
        )}
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}
