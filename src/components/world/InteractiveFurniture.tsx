"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FurnitureItem } from '@/data/world-layout';
import type { DepartmentId } from '@/types/departments';
import { useDomains } from './DomainContext';

interface InteractiveFurnitureProps {
  item: FurnitureItem;
  domain: DepartmentId;
  tileSize: number;
  index: number;
}

const FURNITURE_INFO: Record<FurnitureItem['type'], { label: string; description: string }> = {
  desk:            { label: 'Estacao de Trabalho', description: 'Workspace focado do agente' },
  monitor:         { label: 'Monitor', description: 'Dashboard e metricas' },
  whiteboard:      { label: 'Quadro Branco', description: 'Area de brainstorming e planejamento' },
  plant:           { label: 'Planta', description: 'Um toque de natureza' },
  coffee:          { label: 'Maquina de Cafe', description: 'Combustivel essencial' },
  bookshelf:       { label: 'Estante', description: 'Biblioteca de conhecimento' },
  serverRack:      { label: 'Rack de Servidores', description: 'Infraestrutura de processamento' },
  camera:          { label: 'Camera', description: 'Setup de gravacao e streaming' },
  chartBoard:      { label: 'Painel de Graficos', description: 'Visualizacao de dados' },
  rug:             { label: 'Tapete', description: 'Marcador de zona confortavel' },
  lamp:            { label: 'Luminaria', description: 'Iluminacao ambiente' },
  couch:           { label: 'Sofa', description: 'Reuniao casual e descanso' },
  meetingTable:    { label: 'Mesa de Reuniao', description: 'Area de colaboracao da equipe' },
  waterCooler:     { label: 'Bebedouro', description: 'Hidratacao e bate-papo' },
  printer:         { label: 'Impressora', description: 'Estacao de saida de documentos' },
  stickyWall:      { label: 'Mural de Post-its', description: 'Kanban e rastreador de ideias' },
  cabinet:         { label: 'Arquivo', description: 'Armazenamento de documentos' },
  projectorScreen: { label: 'Tela do Projetor', description: 'Apresentacoes e demos' },
};

const FURNITURE_SIZES: Record<FurnitureItem['type'], { w: number; h: number }> = {
  desk: { w: 48, h: 36 },
  monitor: { w: 42, h: 36 },
  whiteboard: { w: 48, h: 42 },
  plant: { w: 30, h: 42 },
  coffee: { w: 24, h: 30 },
  bookshelf: { w: 48, h: 48 },
  serverRack: { w: 32, h: 48 },
  camera: { w: 36, h: 32 },
  chartBoard: { w: 44, h: 40 },
  rug: { w: 80, h: 48 },
  lamp: { w: 20, h: 44 },
  couch: { w: 56, h: 30 },
  meetingTable: { w: 64, h: 44 },
  waterCooler: { w: 24, h: 44 },
  printer: { w: 40, h: 32 },
  stickyWall: { w: 56, h: 44 },
  cabinet: { w: 32, h: 44 },
  projectorScreen: { w: 60, h: 44 },
};

export function InteractiveFurniture({ item, domain, tileSize }: InteractiveFurnitureProps) {
  const [hovered, setHovered] = useState(false);
  const domains = useDomains();
  const info = FURNITURE_INFO[item.type];
  const size = FURNITURE_SIZES[item.type];
  const d = domains[domain];

  if (item.type === 'rug' || item.type === 'lamp' || item.type === 'plant') {
    return null;
  }

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: item.x * tileSize,
        top: item.y * tileSize,
        width: size.w,
        height: size.h,
        zIndex: item.y + 3,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <>
            <motion.div
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{ border: `1.5px solid ${d.tileColor}66`, background: `${d.tileColor}11` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              className="absolute pointer-events-none"
              style={{ bottom: size.h + 6, left: '50%', transform: 'translateX(-50%)', zIndex: 45 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
            >
              <div
                className="rounded-md px-2 py-1 whitespace-nowrap"
                style={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-[8px] font-semibold text-white" style={{ fontFamily: 'monospace' }}>
                  {info.label}
                </div>
                <div className="text-[7px] text-white/50" style={{ fontFamily: 'monospace' }}>
                  {info.description}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
