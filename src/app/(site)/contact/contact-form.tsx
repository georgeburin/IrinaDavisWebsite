"use client";

import Image from "next/image";
import { useActionState } from "react";

import type { PaintingImage } from "@/lib/types";

import { sendContactMessage, type ContactState } from "./actions";

type Props = {
  painting?: { slug: string; title: string; image: PaintingImage };
  topic?: "commission";
};

const field =
  "mt-1.5 block w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-ink";

export function ContactForm({ painting, topic }: Props) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContactMessage, {});

  if (state.sent) {
    return (
      <div role="status" className="rounded-lg border border-line bg-white p-6">
        <p className="font-serif text-2xl">Message received</p>
        <p className="mt-2 text-muted">{state.message ?? "Thank you!"}</p>
      </div>
    );
  }

  const defaultMessage = painting
    ? topic === "commission"
      ? `Hi Irina, I love “${painting.title}”. Would you paint something similar for me?`
      : `Hi Irina, I'm interested in “${painting.title}”.`
    : topic === "commission"
      ? "Hi Irina, I'd like to ask about a commission."
      : "";

  return (
    <form action={formAction} className="space-y-5">
      {painting && (
        <div className="flex items-center gap-4 rounded-lg border border-line bg-white p-3">
          <span className="flex size-16 shrink-0 items-center justify-center bg-panel p-1.5">
            <Image
              src={painting.image.src}
              width={painting.image.width}
              height={painting.image.height}
              alt=""
              sizes="64px"
              className="h-auto max-h-full w-auto max-w-full"
            />
          </span>
          <p className="text-sm">
            <span className="text-muted">About</span>
            <br />
            <span className="font-serif text-xl">{painting.title}</span>
          </p>
          <input type="hidden" name="painting" value={painting.slug} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            defaultValue={state.values?.name}
            className={field}
            aria-invalid={!!state.errors?.name}
          />
          {state.errors?.name && <span className="mt-1 block text-sm font-normal text-sold">{state.errors.name}</span>}
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            className={field}
            aria-invalid={!!state.errors?.email}
          />
          {state.errors?.email && <span className="mt-1 block text-sm font-normal text-sold">{state.errors.email}</span>}
        </label>
      </div>

      <label className="block text-sm font-medium">
        Message
        <textarea
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message ?? defaultMessage}
          className={field}
          aria-invalid={!!state.errors?.message}
        />
        {state.errors?.message && <span className="mt-1 block text-sm font-normal text-sold">{state.errors.message}</span>}
      </label>

      {/* Spam trap: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
