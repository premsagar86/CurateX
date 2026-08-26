// Admin — Leads — PLAN.md §20.20 (pipeline detail).
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { services } from "@/config/services";

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Leads</h1>
      {leads.length === 0 ? (
        <EmptyState title="No leads yet" description="Contact form submissions will show up here." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Budget</th>
                <th className="py-2 pr-4">Received</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border">
                  <td className="py-2 pr-4">{lead.name}</td>
                  <td className="py-2 pr-4">{lead.email}</td>
                  <td className="py-2 pr-4">{services.find((s) => s.type === lead.service)?.name ?? lead.service}</td>
                  <td className="py-2 pr-4">{lead.budgetRange}</td>
                  <td className="py-2 pr-4">{lead.createdAt.toLocaleDateString("en-IN")}</td>
                  <td className="py-2"><LeadStatusSelect leadId={lead.id} status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
