import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { getPaintingById } from "@/lib/paintings";
import { canSave } from "@/lib/paintings-store";

import { updatePainting } from "../../../actions";
import { PaintingForm } from "../../../painting-form";

export const metadata: Metadata = { title: "Edit painting" };

export default async function EditPaintingPage({ params }: PageProps<"/admin/paintings/[id]/edit">) {
  await requireAdmin();
  const { id } = await params;
  const painting = await getPaintingById(id);
  if (!painting) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="link text-sm text-muted">
        ← All paintings
      </Link>
      <h1 className="mt-4 font-serif text-4xl">Edit “{painting.title}”</h1>
      <p className="mt-1 text-sm text-muted">
        On the site at{" "}
        <Link href={`/paintings/${painting.slug}`} className="link">
          /paintings/{painting.slug}
        </Link>
      </p>
      <PaintingForm action={updatePainting.bind(null, painting.id)} painting={painting} canSave={canSave} />
    </div>
  );
}
