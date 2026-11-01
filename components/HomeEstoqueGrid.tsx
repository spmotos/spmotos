"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadEstoqueBatch } from "@/app/actions/estoque-batch";
import { MotoGrid } from "@/components/MotoGrid";
import { ESTOQUE_BATCH_SIZE } from "@/lib/clickgarage/constants";
import { ListMotosParams, PublicMotoListItem } from "@/lib/clickgarage/types";
import { copy } from "@/lib/copy";

interface HomeEstoqueGridProps {
  initialItems: PublicMotoListItem[];
  total: number;
  listParams: ListMotosParams;
}

const mergeUniqueItems = (
  prev: PublicMotoListItem[],
  incoming: PublicMotoListItem[],
): PublicMotoListItem[] => {
  const seen = new Set(prev.map((moto) => moto.id));
  const merged = [...prev];
  for (const item of incoming) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      merged.push(item);
    }
  }
  return merged;
};

export const HomeEstoqueGrid: React.FC<HomeEstoqueGridProps> = ({
  initialItems,
  total,
  listParams,
}) => {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const itemsLengthRef = useRef(initialItems.length);

  const hasMore = items.length < total;

  const loadMore = useCallback(async (): Promise<void> => {
    if (loadingRef.current || itemsLengthRef.current >= total) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    const offset = itemsLengthRef.current;
    try {
      const result = await loadEstoqueBatch({
        params: listParams,
        offset,
        limit: ESTOQUE_BATCH_SIZE,
      });
      setItems((prev) => {
        const merged = mergeUniqueItems(prev, result.items);
        itemsLengthRef.current = merged.length;
        return merged;
      });
      if (result.items.length > 0) {
        setLiveMessage(copy.home.loadedBatch(result.items.length));
      }
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : copy.home.loadMoreError;
      setError(message);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [listParams, total]);

  useEffect(() => {
    itemsLengthRef.current = items.length;
  }, [items.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-6">
      <MotoGrid motos={items} />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      {error ? (
        <p className="text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {hasMore ? (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-stone bg-surface px-8 py-3 text-sm font-semibold text-page-foreground hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? copy.home.loadingMore : copy.home.loadMore}
          </button>
          <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
        </div>
      ) : items.length > 0 && total > ESTOQUE_BATCH_SIZE ? (
        <p className="text-center text-sm text-moss">{copy.home.allLoaded}</p>
      ) : null}
    </div>
  );
};
