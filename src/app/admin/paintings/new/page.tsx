import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { canSave } from "@/lib/paintings-store";

import { createPainting } from "../../actions";
import { PaintingForm } from "../../painting-form";

export const metadata: Metadata = { title: "Add painting" };

export default async function NewPaintingPage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="link text-sm text-muted">
        ← All paintings
      </Link>
      <h1 className="mt-4 font-serif text-4xl">Add a painting</h1>
      <PaintingForm action={createPainting} canSave={canSave} />
    </div>
  );
}
