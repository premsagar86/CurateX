"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { markPaidSchema, type MarkPaidInput } from "@/lib/validation/mark-paid";

// The form collects a single flat line item; the API expects `lineItems[]`
// (see lib/validation/create-invoice.ts) — validate the form's own shape
// here and map it into that array shape on submit, same as before.
const invoiceFormSchema = z.object({
  clientId: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().min(0),
  dueDate: z.coerce.date(),
});
type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;

export function CreateInvoiceForm({ clients }: { clients: { id: string; companyName: string }[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormInput>({ resolver: zodResolver(invoiceFormSchema) });

  async function onSubmit(values: InvoiceFormInput) {
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: values.clientId,
        dueDate: values.dueDate,
        lineItems: [{ description: values.description, quantity: 1, unitAmount: values.amount }],
      }),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the invoice." });
      return;
    }
    reset();
    router.refresh();
  }

  if (clients.length === 0) return <p className="text-sm text-text-muted">No clients yet.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-2">
      <select className="rounded-md border border-border px-2 py-2 text-sm" {...register("clientId")}>
        {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
      </select>
      <input placeholder="Line item description" className="rounded-md border border-border px-3 py-2 text-sm" {...register("description")} />
      <input type="number" min={0} step="0.01" placeholder="Amount (₹)" className="w-32 rounded-md border border-border px-3 py-2 text-sm" {...register("amount")} />
      <input type="date" className="rounded-md border border-border px-3 py-2 text-sm" {...register("dueDate")} />
      <Button type="submit" loading={isSubmitting} size="sm">Create invoice</Button>
      {(errors.root || errors.description || errors.amount || errors.dueDate) && (
        <p className="w-full text-sm text-error">
          {errors.root?.message ?? errors.description?.message ?? errors.amount?.message ?? errors.dueDate?.message}
        </p>
      )}
    </form>
  );
}

export function MarkPaidForm({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MarkPaidInput>({ resolver: zodResolver(markPaidSchema) });

  async function onSubmit(payload: MarkPaidInput) {
    await fetch(`/api/admin/invoices/${invoiceId}/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-1">
      <input placeholder="Payment ref" className="w-28 rounded-md border border-border px-2 py-1 text-xs" {...register("reference")} />
      <Button type="submit" size="sm" loading={isSubmitting}>Confirm</Button>
    </form>
  );
}
