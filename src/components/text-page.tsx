import type { ReactNode } from "react";

/** Layout for simple text pages such as policies. */
export function TextPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">{title}</h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      <p className="mt-8 max-w-2xl rounded-md border border-dashed border-[#cfc6b8] bg-panel px-4 py-3 text-sm text-muted">
        <strong className="font-medium text-ink">Placeholder text.</strong> Replace everything in [brackets] and review
        this page before the shop starts taking orders.
      </p>
      <div className="prose-page mt-10">{children}</div>
    </div>
  );
}
