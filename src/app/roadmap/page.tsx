// src/app/roadmap/page.tsx
import { RoadmapView } from '@/components/roadmap/RoadmapView';

export const metadata = {
  title: 'Roadmap | Kairus OS',
  description: 'Roadmap do produto com priorização MoSCoW',
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
