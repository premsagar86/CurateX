// Accordion — progressive disclosure for FAQs (§16.4, §20.9). Native
// <details>/<summary> gives correct keyboard/a11y behavior with zero JS,
// which is why this doesn't need a Radix dependency.
export interface AccordionItemData {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {items.map((item) => (
        <details key={item.question} className="group px-4 py-3">
          <summary className="cursor-pointer list-none font-medium marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <span className="shrink-0 text-text-muted transition-transform group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-2 text-sm text-text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
