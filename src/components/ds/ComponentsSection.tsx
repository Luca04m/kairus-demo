import { Section } from "@/components/ds/Section";
import { CARDS_DATA } from "@/data/ds-data";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ComponentsSection() {
  return (
    <Section id="components" label="Components" heading="Components">
      <div className="space-y-16">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Buttons</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="h-11 rounded-full px-6 text-sm font-semibold">Primary</Button>
            <Button variant="outline" className="glass-light h-11 rounded-full px-6 text-sm font-medium text-white/80 border-0" style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }}>Secondary</Button>
            <Button variant="ghost" className="h-11 rounded-full px-6 text-sm font-medium text-white/60">Ghost</Button>
            <Button className="h-11 rounded-full bg-kairus-blue px-6 text-sm font-semibold text-white hover:opacity-90">Accent</Button>
            <Button variant="destructive" className="h-11 rounded-full bg-danger px-6 text-sm font-semibold text-white hover:opacity-90">Destructive</Button>
            <Button variant="outline" className="glass-light size-11 rounded-full p-0 text-white/70 border-0" style={{ boxShadow: "rgba(255,255,255,0.1) 0 0 0 1px inset" }} aria-label="Next"><ArrowRight size={16} /></Button>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Cards</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARDS_DATA.slice(0, 3).map((card) => (
              <Card key={card.title} variant="default" size="default" className="flex flex-col gap-4">
                <Badge variant={card.badgeVariant} className="w-fit">{card.badge}</Badge>
                <CardHeader>
                  <CardTitle className="mb-2">{card.title}</CardTitle>
                  <CardDescription>{card.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            {CARDS_DATA.slice(3).map((card) => (
              <Card key={card.title} variant="default" size="default" className="flex flex-col gap-4">
                <Badge variant={card.badgeVariant} className="w-fit">{card.badge}</Badge>
                <CardHeader>
                  <CardTitle className="mb-2">{card.title}</CardTitle>
                  <CardDescription>{card.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Badges</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="green">Green</Badge>
            <Badge variant="blue">Blue</Badge>
            <Badge variant="purple">Purple</Badge>
            <Badge dot>Active</Badge>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-6">Inputs</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1">
              <label htmlFor="ds-search" className="sr-only">Search agents</label>
              <Input id="ds-search" type="text" placeholder="Search agents..." />
            </div>
            <div>
              <label htmlFor="ds-type-filter" className="sr-only">Filter by type</label>
              <Select id="ds-type-filter">
                <option value="" className="bg-black">All types</option>
                <option value="llm" className="bg-black">LLM</option>
                <option value="tool" className="bg-black">Tool</option>
                <option value="workflow" className="bg-black">Workflow</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
