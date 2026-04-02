"use client";

import { useState } from "react";

interface AgentSpriteProps {
  id: string;
  nome: string;
  iniciais: string;
  status: "ativo" | "pausado" | "idle";
  cor: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

const statusColors: Record<string, string> = {
  ativo: "#22c55e",
  pausado: "#f59e0b",
  idle: "rgba(255,255,255,0.25)",
};

export function AgentSprite({
  nome,
  iniciais,
  status,
  cor,
  selected = false,
  onClick,
  size = "md",
}: AgentSpriteProps) {
  const [hovered, setHovered] = useState(false);
  const dim = size === "sm" ? 28 : 36;
  const fontSize = size === "sm" ? "9px" : "11px";

  return (
    <div
      className="relative cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Selection ring */}
      {selected && (
        <div
          className="absolute inset-[-3px] rounded-full border-2 animate-pulse-soft"
          style={{ borderColor: cor }}
        />
      )}

      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full text-white font-semibold transition-transform duration-150"
        style={{
          width: dim,
          height: dim,
          fontSize,
          backgroundColor: `${cor}33`,
          border: `1.5px solid ${cor}66`,
          transform: hovered ? "scale(1.12)" : "scale(1)",
        }}
      >
        {iniciais}
      </div>

      {/* Status dot */}
      <span
        className="absolute -bottom-0.5 -right-0.5 rounded-full border border-[#09090b]"
        style={{
          width: size === "sm" ? 7 : 9,
          height: size === "sm" ? 7 : 9,
          backgroundColor: statusColors[status] ?? statusColors.idle,
          animation: status === "ativo" ? "pulseSoft 2s ease-in-out infinite" : undefined,
        }}
      />

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg
            glass-card text-[10px] text-white whitespace-nowrap z-50
            animate-fade-in-up"
          style={{ animationDuration: "150ms" }}
        >
          <span className="font-medium">{nome}</span>
          <span className="mx-1 text-[rgba(255,255,255,0.3)]">|</span>
          <span
            className="capitalize"
            style={{ color: statusColors[status] }}
          >
            {status}
          </span>
        </div>
      )}
    </div>
  );
}
