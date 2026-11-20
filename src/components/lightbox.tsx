"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon, ShrinkIcon } from "./icons";

export type Slide = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title?: string;
  caption?: string;
  /** Link to the painting's own page. */
  href?: string;
};

type LightboxProps = {
  slides: Slide[];
  /** Index of the slide to show, or null when closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

const SWIPE_DISTANCE = 50;

function subscribeToFullscreen(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}
const noSubscription = () => () => {};

function exitBrowserFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

/** Fullscreen image viewer: arrow keys / swipe to move, Esc to close. */
export function Lightbox({ slides, index, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const count = slides.length;
  const isOpen = index !== null && count > 0;
  const current = isOpen ? Math.min(index, count - 1) : 0;
  const slide = isOpen ? slides[current] : null;

  const canGoFullscreen = useSyncExternalStore(
    noSubscription,
    () => document.fullscreenEnabled,
    () => false,
  );
  const isBrowserFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    () => document.fullscreenElement !== null,
    () => false,
  );

  // Open and close the native <dialog> to match `index`. The cleanup also closes it when
  // this component is hidden or removed (e.g. after following "View details"), so the
  // page underneath never stays locked.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const go = useCallback(
    (step: number) => {
      if (index === null || count < 2) return;
      onIndexChange((current + step + count) % count);
    },
    [index, count, current, onIndexChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, go]);

  const close = () => {
    exitBrowserFullscreen();
    onIndexChange(null);
  };

  const toggleBrowserFullscreen = () => {
    if (document.fullscreenElement) exitBrowserFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const neighbours = count > 1 ? [slides[(current + 1) % count], slides[(current - 1 + count) % count]] : [];

  return (
    <dialog
      ref={dialogRef}
      aria-label={slide?.title ? `${slide.title}, fullscreen view` : "Fullscreen view"}
      onClose={() => {
        exitBrowserFullscreen();
        onIndexChange(null);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-[#11100e] p-0 text-[#f3efe8] backdrop:bg-black"
    >
      {slide && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
            <p className="pl-1 text-sm text-white/60 tabular-nums">
              {count > 1 ? `${current + 1} / ${count}` : ""}
            </p>
            <div className="flex items-center gap-1">
              {canGoFullscreen && (
                <button
                  type="button"
                  onClick={toggleBrowserFullscreen}
                  className="rounded-full p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label={isBrowserFullscreen ? "Exit full screen" : "Full screen"}
                  title={isBrowserFullscreen ? "Exit full screen" : "Full screen"}
                >
                  {isBrowserFullscreen ? <ShrinkIcon className="size-5" /> : <ExpandIcon className="size-5" />}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={close}
                className="rounded-full p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
                title="Close (Esc)"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20"
            style={{ touchAction: "pan-y pinch-zoom" }}
            onPointerDown={(event) => {
              pointerStart.current = { x: event.clientX, y: event.clientY };
              swiped.current = false;
            }}
            onPointerUp={(event) => {
              const start = pointerStart.current;
              pointerStart.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped.current = true;
                go(dx < 0 ? 1 : -1);
              }
            }}
            onClick={(event) => {
              // Clicking the dark area around the painting closes the viewer.
              if (event.target === event.currentTarget && !swiped.current) close();
            }}
          >
            <Image
              key={slide.src}
              src={slide.src}
              width={slide.width}
              height={slide.height}
              alt={slide.alt}
              sizes="100vw"
              quality={90}
              draggable={false}
              className="h-auto max-h-full w-auto max-w-full select-none object-contain"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full bg-black/30 p-3 text-white/80 transition hover:bg-white/15 hover:text-white sm:left-5 sm:block"
                  aria-label="Previous"
                >
                  <ArrowLeftIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full bg-black/30 p-3 text-white/80 transition hover:bg-white/15 hover:text-white sm:right-5 sm:block"
                  aria-label="Next"
                >
                  <ArrowRightIcon className="size-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            {count > 1 ? (
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-full p-2.5 text-white/80 hover:bg-white/10 sm:hidden"
                aria-label="Previous"
              >
                <ArrowLeftIcon className="size-6" />
              </button>
            ) : (
              <span className="sm:hidden" />
            )}
            <div className="min-w-0 flex-1 text-center">
              {slide.title && <p className="truncate font-serif text-xl sm:text-2xl">{slide.title}</p>}
              {slide.caption && <p className="mt-0.5 text-sm text-white/60">{slide.caption}</p>}
              {slide.href && (
                <Link
                  href={slide.href}
                  onClick={close}
                  className="mt-1 inline-block text-sm text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  View details →
                </Link>
              )}
            </div>
            {count > 1 ? (
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-full p-2.5 text-white/80 hover:bg-white/10 sm:hidden"
                aria-label="Next"
              >
                <ArrowRightIcon className="size-6" />
              </button>
            ) : (
              <span className="sm:hidden" />
            )}
          </div>

          {/* Load the next and previous paintings in the background so arrows feel instant. */}
          {neighbours.map((n) => (
            <Image
              key={`preload-${n.src}`}
              src={n.src}
              width={n.width}
              height={n.height}
              alt=""
              aria-hidden
              sizes="100vw"
              quality={90}
              loading="eager"
              className="hidden"
            />
          ))}
        </div>
      )}
    </dialog>
  );
}
