// Work grid with a service-type filter control — PLAN.md §20.4. Reuses the
// same service tags as Service Cards (§16.5).
"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/marketing/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { services } from "@/config/services";
import type { CaseStudy, ServiceType } from "@prisma/client";

export function WorkGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [filter, setFilter] = useState<ServiceType | "ALL">("ALL");

  const filtered =
    filter === "ALL"
      ? caseStudies
      : caseStudies.filter((cs) => ((cs.services as ServiceType[] | null) ?? []).includes(filter));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`rounded-full border px-3 py-1 text-sm ${filter === "ALL" ? "border-primary bg-primary text-white" : "border-border"}`}
        >
          All
        </button>
        {services.map((service) => (
          <button
            key={service.type}
            onClick={() => setFilter(service.type)}
            className={`rounded-full border px-3 py-1 text-sm ${filter === service.type ? "border-primary bg-primary text-white" : "border-border"}`}
          >
            {service.name}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseStudy) => (
            <ProjectCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={caseStudies.length === 0 ? "First case studies coming soon" : "No projects for this service yet"}
          description={caseStudies.length === 0 ? "We're just getting started — check back soon." : undefined}
        />
      )}
    </div>
  );
}
