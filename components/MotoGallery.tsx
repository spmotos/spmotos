"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { copy } from "@/lib/copy";

interface MotoGalleryProps {
  titulo: string;
  imagemPrincipal: string | null;
  galeria: string[];
  keyboardRootRef?: React.RefObject<HTMLElement | null>;
}

const buildPhotoAlt = (titulo: string, index: number, total: number): string =>
  total <= 1 ? titulo : `${titulo} — foto ${index + 1} de ${total}`;

const MAIN_PHOTO_SIZES = "(max-width: 1024px) 100vw, 768px";

const ChevronIcon: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "left" ? (
      <path d="M15 18l-6-6 6-6" />
    ) : (
      <path d="M9 18l6-6-6-6" />
    )}
  </svg>
);

export const MotoGallery: React.FC<MotoGalleryProps> = ({
  titulo,
  imagemPrincipal,
  galeria,
  keyboardRootRef,
}) => {
  const uniquePhotos = useMemo(() => {
    const photos = [imagemPrincipal, ...galeria].filter((photo): photo is string =>
      Boolean(photo),
    );
    return [...new Set(photos)];
  }, [galeria, imagemPrincipal]);
  const [current, setCurrent] = useState<string>(uniquePhotos[0] ?? "");
  const totalPhotos = uniquePhotos.length;
  const currentIndex = current ? Math.max(0, uniquePhotos.indexOf(current)) : 0;
  const hasMultiple = totalPhotos > 1;

  const goToIndex = useCallback(
    (index: number): void => {
      const photo = uniquePhotos[index];
      if (photo) {
        setCurrent(photo);
      }
    },
    [uniquePhotos],
  );

  const goPrev = useCallback((): void => {
    goToIndex((currentIndex - 1 + totalPhotos) % totalPhotos);
  }, [currentIndex, goToIndex, totalPhotos]);

  const goNext = useCallback((): void => {
    goToIndex((currentIndex + 1) % totalPhotos);
  }, [currentIndex, goToIndex, totalPhotos]);

  useEffect(() => {
    if (!hasMultiple) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      const scope = keyboardRootRef?.current;
      if (scope && !scope.contains(event.target as Node)) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultiple, keyboardRootRef]);

  /** Vizinhas só entram depois da foto principal, para não disputar banda com o LCP. */
  const [mainLoaded, setMainLoaded] = useState(false);
  const renderedIndexes = useMemo(() => {
    const indexes = new Set([currentIndex]);
    if (mainLoaded && hasMultiple) {
      indexes.add((currentIndex - 1 + totalPhotos) % totalPhotos);
      indexes.add((currentIndex + 1) % totalPhotos);
    }
    return indexes;
  }, [currentIndex, hasMultiple, mainLoaded, totalPhotos]);

  if (!current) {
    return (
      <div className="flex aspect-[4/3] min-w-0 max-w-full items-center justify-center rounded-2xl border border-stone bg-muted text-moss">
        {copy.card.noPhoto}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3">
      <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl border border-stone bg-muted">
        {uniquePhotos.map((photo, index) => {
          if (!renderedIndexes.has(index)) {
            return null;
          }
          const isActive = photo === current;
          const isFirst = index === 0;
          return (
            <Image
              key={photo}
              src={photo}
              alt={
                isActive ? buildPhotoAlt(titulo, currentIndex, totalPhotos) : ""
              }
              fill
              aria-hidden={!isActive}
              className={`object-cover transition-opacity duration-150 ${
                isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              sizes={MAIN_PHOTO_SIZES}
              loading="eager"
              fetchPriority={isFirst ? "high" : "low"}
              onLoad={isActive ? () => setMainLoaded(true) : undefined}
            />
          );
        })}
        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={copy.detail.galleryPrev}
              className="absolute top-1/2 left-2 z-20 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-accent/90 bg-accent text-accent-foreground shadow-md transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none sm:left-3"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={copy.detail.galleryNext}
              className="absolute top-1/2 right-2 z-20 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-accent/90 bg-accent text-accent-foreground shadow-md transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none sm:right-3"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>
      {uniquePhotos.length > 1 ? (
        <div className="relative min-w-0 max-w-full">
          <div className="flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {uniquePhotos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setCurrent(photo)}
                aria-label={buildPhotoAlt(titulo, index, totalPhotos)}
                aria-current={photo === current ? "true" : undefined}
                className={`relative aspect-square min-h-[44px] min-w-[4.5rem] shrink-0 snap-start overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none lg:min-w-0 ${
                  photo === current ? "border-coral" : "border-stone"
                }`}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
