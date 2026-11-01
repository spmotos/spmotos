import { cache } from "react";
import { z } from "zod";
import { getClickGarageFeedUrl } from "@/lib/env";
import { SiteFeedRequestError } from "./errors";
import { SiteFeedItem, siteFeedItemSchema } from "./schema";

const FEED_TIMEOUT_MS = 30_000;

export const fetchSiteFeedItems = cache(async (): Promise<SiteFeedItem[]> => {
  const url = getClickGarageFeedUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 300 },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new SiteFeedRequestError(408, "Tempo esgotado ao carregar o estoque.");
    }
    throw new SiteFeedRequestError(503, "Não foi possível conectar ao feed de estoque.");
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404) {
    throw new SiteFeedRequestError(404, "Feed de estoque não encontrado.");
  }
  if (!response.ok) {
    throw new SiteFeedRequestError(response.status, `Feed de estoque retornou HTTP ${response.status}.`);
  }

  const json: unknown = await response.json();
  const rawItems = z.array(z.unknown()).parse(json);
  return rawItems.flatMap((raw) => {
    const result = siteFeedItemSchema.safeParse(raw);
    if (result.success) {
      return [result.data];
    }
    /** Cadastro incompleto no Click Garage (ex.: km/valor nulos) não derruba o estoque inteiro. */
    console.warn("Feed: item ignorado por dados inválidos", result.error.issues);
    return [];
  });
});
