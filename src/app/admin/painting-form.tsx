"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState, type FormEvent, type ReactNode } from "react";

import type { PaintingFieldName } from "@/lib/painting-form";
import { PAINTING_STATUSES, type Painting } from "@/lib/types";

import type { PaintingFormState } from "./actions";

type Props = {
  action: (state: PaintingFormState, formData: FormData) => Promise<PaintingFormState>;
  /** The painting being edited. Leave out when adding a new one. */
  painting?: Painting;
  canSave: boolean;
};

const MEDIUMS = [
  "Oil on canvas",
  "Oil on linen",
  "Oil on panel",
  "Acrylic on canvas",
  "Acrylic on paper",
  "Watercolor on paper",
  "Gouache on paper",
  "Pastel on paper",
  "Mixed media",
];

const STATUS_TEXT = { available: "Available", reserved: "Reserved (on hold)", sold: "Sold" };
const ACCEPT = "image/jpeg,image/png,image/webp";

const input =
  "mt-1.5 block w-full rounded-md border border-line bg-white px-3 py-2 text-base outline-none transition focus:border-ink aria-invalid:border-sold";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {hint && !error && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-sm font-normal text-sold">{error}</span>}
    </label>
  );
}

function usePreviewUrls() {
  const [urls, setUrls] = useState<string[]>([]);
  // Release the previous previews when they change or the form closes.
  useEffect(() => () => urls.forEach((url) => URL.revokeObjectURL(url)), [urls]);
  const fromFiles = (files: FileList | null) =>
    setUrls(files ? Array.from(files).map((file) => URL.createObjectURL(file)) : []);
  return [urls, fromFiles] as const;
}

export function PaintingForm({ action, painting, canSave }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [mainPreview, setMainPreview] = usePreviewUrls();
  const [extraPreviews, setExtraPreviews] = usePreviewUrls();
  const errors: Partial<Record<PaintingFieldName, string>> = state.errors ?? {};
  const existingExtras = painting?.images.slice(1) ?? [];

  // Submitting this way (instead of <form action>) keeps what was typed and the chosen
  // photos in place if the server sends back an error.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-8" encType="multipart/form-data">
      {state.message && (
        <p role="alert" className="rounded-lg border border-[#ecc9c2] bg-[#fbeeeb] px-4 py-3 text-sm">
          {state.message}
        </p>
      )}

      <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="font-serif text-2xl">Photos</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_1fr]">
          <div className="flex size-40 items-center justify-center bg-panel p-2">
            {mainPreview[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainPreview[0]} alt="New main photo" className="max-h-full max-w-full" />
            ) : painting ? (
              <Image
                src={painting.images[0].src}
                width={painting.images[0].width}
                height={painting.images[0].height}
                alt="Current main photo"
                sizes="160px"
                className="h-auto max-h-full w-auto max-w-full"
              />
            ) : (
              <span className="px-4 text-center text-xs text-muted">No photo yet</span>
            )}
          </div>
          <Field
            label={painting ? "Replace main photo" : "Main photo"}
            error={errors.mainImage}
            hint={
              painting
                ? "Choose a file only if you want to replace the current photo."
                : "JPG, PNG or WebP, up to 20 MB. A straight-on photo in daylight works best."
            }
          >
            <input
              name="mainImage"
              type="file"
              accept={ACCEPT}
              required={!painting}
              onChange={(e) => setMainPreview(e.target.files)}
              aria-invalid={!!errors.mainImage}
              className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-paper hover:file:bg-[#3a362f]"
            />
          </Field>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <Field
            label="Extra photos (optional)"
            error={errors.extraImages}
            hint="Close-ups, the painting framed or on a wall, the back of the canvas…"
          >
            <input
              name="extraImages"
              type="file"
              accept={ACCEPT}
              multiple
              onChange={(e) => setExtraPreviews(e.target.files)}
              aria-invalid={!!errors.extraImages}
              className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border file:border-ink file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-panel"
            />
          </Field>

          {(existingExtras.length > 0 || extraPreviews.length > 0) && (
            <ul className="mt-5 flex flex-wrap gap-4">
              {existingExtras.map((image) => (
                <li key={image.src} className="w-28">
                  <div className="flex size-28 items-center justify-center bg-panel p-1.5">
                    <Image
                      src={image.src}
                      width={image.width}
                      height={image.height}
                      alt=""
                      sizes="112px"
                      className="h-auto max-h-full w-auto max-w-full"
                    />
                  </div>
                  <label className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                    <input type="checkbox" name="removeImages" value={image.src} className="accent-sold" />
                    Remove
                  </label>
                </li>
              ))}
              {extraPreviews.map((url) => (
                <li key={url} className="w-28">
                  <div className="flex size-28 items-center justify-center bg-panel p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="max-h-full max-w-full" />
                  </div>
                  <p className="mt-1.5 text-xs text-available">New</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="font-serif text-2xl">About the painting</h2>

        <Field label="Title" error={errors.title}>
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={painting?.title}
            aria-invalid={!!errors.title}
            className={input}
          />
        </Field>

        <Field
          label="Description"
          error={errors.description}
          hint="What it shows, where it was painted, anything a buyer would love to know. Leave a blank line between paragraphs."
        >
          <textarea
            name="description"
            rows={6}
            maxLength={5000}
            defaultValue={painting?.description}
            aria-invalid={!!errors.description}
            className={input}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Medium" error={errors.medium}>
            <input
              name="medium"
              required
              list="mediums"
              placeholder="Oil on canvas"
              defaultValue={painting?.medium}
              aria-invalid={!!errors.medium}
              className={input}
            />
            <datalist id="mediums">
              {MEDIUMS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
          <Field label="Date completed" error={errors.completedOn}>
            <input
              name="completedOn"
              type="date"
              required
              defaultValue={painting?.completedOn}
              aria-invalid={!!errors.completedOn}
              className={input}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Size in inches</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-3">
            {(
              [
                ["widthIn", "Width", painting?.widthIn, true],
                ["heightIn", "Height", painting?.heightIn, true],
                ["depthIn", "Depth (optional)", painting?.depthIn ?? undefined, false],
              ] as const
            ).map(([name, label, value, required]) => (
              <Field key={name} label={label} error={errors[name]}>
                <input
                  name={name}
                  type="number"
                  inputMode="decimal"
                  step="0.25"
                  min="0"
                  required={required}
                  defaultValue={value}
                  aria-invalid={!!errors[name]}
                  className={input}
                />
              </Field>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="framed" defaultChecked={painting?.framed} className="size-4 accent-ink" />
          Sold framed
        </label>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="font-serif text-2xl">Price &amp; status</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Price (US dollars)" error={errors.price}>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 mt-[3px] -translate-y-1/2 text-muted">$</span>
              <input
                name="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                defaultValue={painting ? painting.priceCents / 100 : undefined}
                aria-invalid={!!errors.price}
                className={`${input} pl-7`}
              />
            </div>
          </Field>
          <Field label="Status" error={errors.status}>
            <select
              name="status"
              defaultValue={painting?.status ?? "available"}
              aria-invalid={!!errors.status}
              className={input}
            >
              {PAINTING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_TEXT[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!canSave || pending} className="btn btn-primary">
          {pending ? "Saving…" : painting ? "Save changes" : "Add painting"}
        </button>
        <Link href="/admin" className="btn btn-outline">
          Cancel
        </Link>
        {!canSave && <p className="text-sm text-muted">Saving is turned off on the live site for now.</p>}
      </div>
    </form>
  );
}
