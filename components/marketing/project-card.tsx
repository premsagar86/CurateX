// Project Card — represents one portfolio project. Service tags link back to
// the relevant Service page (§22 internal-linking requirement). PLAN.md §16.5.
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services } from "@/config/services";
import type { ServiceType, CaseStudy } from "@prisma/client";

export function ProjectCard({ caseStudy }: { caseStudy: Pick<CaseStudy, "slug" | "title" | "services"> }) {
  const serviceTypes = (caseStudy.services as ServiceType[] | null) ?? [];

  return (
    <Link href={`/work/${caseStudy.slug}`}>
      <Card interactive className="h-full">
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-surface-elevated text-sm text-text-muted">
          Project visual
        </div>
        <h3 className="mt-4 font-display text-lg">{caseStudy.title}</h3>
        {serviceTypes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {serviceTypes.map((type) => {
              const service = services.find((s) => s.type === type);
              return service ? <Badge key={type}>{service.name}</Badge> : null;
            })}
          </div>
        )}
      </Card>
    </Link>
  );
}
