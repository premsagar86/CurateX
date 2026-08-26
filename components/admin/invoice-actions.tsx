"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateInvoiceForm({ clients }: { clients: { id: string; companyName: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: String(formData.get("clientId")),
        dueDate: String(formData.get("dueDate")),
        lineItems: [{ description: String(formData.get("description")), quantity: 1, unitAmount: Number(formData.get("amount")) }],
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not create the invoice.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  if (clients.length === 0) return <p className="text-sm text-text-muted">No clients yet.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select name="clientId" required className="rounded-md border border-border px-2 py-2 text-sm">
        {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
      </select>
      <input name="description" required placeholder="Line item description" className="rounded-md border border-border px-3 py-2 text-sm" />
      <input name="amount" type="number" min={0} step="0.01" required placeholder="Amount (₹)" className="w-32 rounded-md border border-border px-3 py-2 text-sm" />
      <input name="dueDate" type="date" required className="rounded-md border border-border px-3 py-2 text-sm" />
      <Button type="submit" loading={loading} size="sm">Create invoice</Button>
      {error && <p className="w-full text-sm text-error">{error}</p>}
    </form>
  );
}

export function MarkPaidForm({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await fetch(`/api/admin/invoices/${invoiceId}/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: String(formData.get("reference")) }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Mark paid
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input name="reference" required placeholder="Payment ref" className="w-28 rounded-md border border-border px-2 py-1 text-xs" />
      <Button type="submit" size="sm" loading={loading}>Confirm</Button>
    </form>
  );
}
