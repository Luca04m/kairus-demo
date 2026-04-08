"use client";
import { useRouter } from "next/navigation";
import { AGENT_META } from "@/lib/ai/agent-meta";

const CARD_W = 200;
const CARD_H = 90;
const GAP_X = 40;
const GAP_Y = 80;
const PADDING = 40;

interface TreeNode {
  id: string;
  children: TreeNode[];
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  children: LayoutNode[];
}

const HIERARCHY: TreeNode = {
  id: "orquestrador",
  children: [
    { id: "financeiro", children: [] },
    { id: "ecommerce", children: [] },
    { id: "estoque", children: [] },
  ],
};

function subtreeWidth(node: TreeNode): number {
  if (node.children.length === 0) return CARD_W;
  return (
    node.children.reduce((sum, child) => sum + subtreeWidth(child), 0) +
    (node.children.length - 1) * GAP_X
  );
}

function layoutTree(node: TreeNode, x: number, y: number): LayoutNode {
  const width = subtreeWidth(node);
  const result: LayoutNode = {
    id: node.id,
    x: x + width / 2 - CARD_W / 2,
    y,
    children: [],
  };

  let childX = x;
  for (const child of node.children) {
    const childWidth = subtreeWidth(child);
    result.children.push(layoutTree(child, childX, y + CARD_H + GAP_Y));
    childX += childWidth + GAP_X;
  }

  return result;
}

function collectEdges(node: LayoutNode): React.ReactNode[] {
  const edges: React.ReactNode[] = [];
  const parentCx = node.x + CARD_W / 2;
  const parentBy = node.y + CARD_H;

  for (const child of node.children) {
    const childCx = child.x + CARD_W / 2;
    const childTy = child.y;
    const midY = parentBy + GAP_Y / 2;

    edges.push(
      <path
        key={`edge-${node.id}-${child.id}`}
        d={`M ${parentCx} ${parentBy} L ${parentCx} ${midY} L ${childCx} ${midY} L ${childCx} ${childTy}`}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    );
    edges.push(...collectEdges(child));
  }
  return edges;
}

function collectCards(
  node: LayoutNode,
  onNavigate: (id: string) => void
): React.ReactNode[] {
  const meta = AGENT_META[node.id];
  if (!meta) return [];
  const Icon = meta.icon;
  const cards: React.ReactNode[] = [];

  cards.push(
    <g
      key={`card-${node.id}`}
      onClick={() => onNavigate(node.id)}
      className="cursor-pointer"
    >
      <rect
        x={node.x}
        y={node.y}
        width={CARD_W}
        height={CARD_H}
        rx={12}
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />
      {/* Status dot */}
      <circle
        cx={node.x + CARD_W - 12}
        cy={node.y + 12}
        r={4}
        fill="#34d399"
      />
      <foreignObject
        x={node.x}
        y={node.y}
        width={CARD_W}
        height={CARD_H}
      >
        <div className="h-full flex flex-col items-center justify-center gap-1 pointer-events-none">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: meta.cor + "20" }}
          >
            <Icon size={16} style={{ color: meta.cor }} />
          </div>
          <span className="text-sm font-medium text-white">{meta.nome}</span>
          <span className="text-[10px] text-white/40">
            {meta.descricao.split("—")[1]?.trim()}
          </span>
        </div>
      </foreignObject>
    </g>
  );

  for (const child of node.children) {
    cards.push(...collectCards(child, onNavigate));
  }

  return cards;
}

export function OrgChart() {
  const router = useRouter();
  const layout = layoutTree(HIERARCHY, PADDING, PADDING);
  const totalW = subtreeWidth(HIERARCHY) + PADDING * 2;
  const totalH = PADDING * 2 + CARD_H * 2 + GAP_Y;

  const handleNavigate = (id: string) => {
    router.push(`/agent/${id}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="mx-auto"
      >
        {collectEdges(layout)}
        {collectCards(layout, handleNavigate)}
      </svg>
    </div>
  );
}
