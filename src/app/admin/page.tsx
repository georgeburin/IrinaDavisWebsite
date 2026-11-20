import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { formatCompleted, formatPrice, formatSizeIn } from "@/lib/format";
import { getPaintings } from "@/lib/paintings";
import { canSave } from "@/lib/paintings-store";

import { deletePainting, setPaintingStatus } from "./actions";
import { SubmitButton } from "./form-buttons";

const READ_ONLY_TITLE = "Turned off on the live site for now";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const [paintings, params] = await Promise.all([getPaintings(), searchParams]);

  const saved = typeof params.saved === "string" ? paintings.find((p) => p.slug === params.saved) : undefined;
  const deleted = typeof params.deleted === "string" ? params.deleted : undefined;
  const count = (status: string) => paintings.filter((p) => p.status === status).length;

  return (
    <>
      {saved && (
        <p role="status" className="mb-6 rounded-lg border border-[#cfe3d3] bg-[#eef7f0] px-4 py-3 text-sm">
          Saved “{saved.title}”.{" "}
          <Link href={`/paintings/${saved.slug}`} className="link">
            View it on the site →
          </Link>
        </p>
      )}
      {deleted && (
        <p role="status" className="mb-6 rounded-lg border border-line bg-white px-4 py-3 text-sm">
          Deleted “{deleted}”.
        </p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Paintings</h1>
          <p className="mt-1 text-sm text-muted">
            {paintings.length} in total · {count("available")} available · {count("reserved")} reserved ·{" "}
            {count("sold")} sold
          </p>
        </div>
        <Link href="/admin/paintings/new" className="btn btn-primary">
          + Add painting
        </Link>
      </div>

      {paintings.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-line bg-white p-10 text-center text-muted">
          No paintings yet. Add your first one.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {paintings.map((p) => {
            const image = p.images[0];
            const nextStatus = p.status === "sold" ? "available" : "sold";
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4 sm:flex-nowrap">
                <Link
                  href={`/admin/paintings/${p.id}/edit`}
                  className="flex size-16 shrink-0 items-center justify-center bg-panel p-1.5"
                  aria-label={`Edit “${p.title}”`}
                >
                  <Image
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt=""
                    sizes="64px"
                    className="h-auto max-h-full w-auto max-w-full"
                  />
                </Link>

                <div className="min-w-0 flex-1 basis-48">
                  <Link href={`/admin/paintings/${p.id}/edit`} className="font-serif text-xl hover:underline">
                    {p.title}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    {p.medium} · {formatSizeIn(p, { depth: false })} · {formatCompleted(p.completedOn)}
                  </p>
                </div>

                <div className="w-28 shrink-0 text-sm">
                  <p>{formatPrice(p.priceCents)}</p>
                  <StatusBadge status={p.status} className="text-muted" />
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <Link href={`/admin/paintings/${p.id}/edit`} className="link">
                    Edit
                  </Link>
                  <Link href={`/paintings/${p.slug}`} className="link">
                    View
                  </Link>
                  <form action={setPaintingStatus.bind(null, p.id, nextStatus)}>
                    <SubmitButton
                      pendingLabel="Saving…"
                      disabled={!canSave}
                      title={canSave ? undefined : READ_ONLY_TITLE}
                      className="link disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {nextStatus === "sold" ? "Mark sold" : "Mark available"}
                    </SubmitButton>
                  </form>
                  <form action={deletePainting.bind(null, p.id)}>
                    <SubmitButton
                      pendingLabel="Deleting…"
                      disabled={!canSave}
                      title={canSave ? undefined : READ_ONLY_TITLE}
                      confirmMessage={`Delete “${p.title}”? This can't be undone.`}
                      className="link text-sold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </SubmitButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
