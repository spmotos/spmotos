"use server";

import { z } from "zod";
import { ESTOQUE_BATCH_MAX, ESTOQUE_BATCH_SIZE } from "@/lib/clickgarage/constants";
import { listMotosBatch } from "@/lib/clickgarage/repository";
import { ListMotosParams, PublicMotoListItem } from "@/lib/clickgarage/types";

export interface LoadEstoqueBatchInput {
  params: ListMotosParams;
  offset: number;
  limit?: number;
}

export interface LoadEstoqueBatchResult {
  items: PublicMotoListItem[];
  total: number;
  nextOffset: number | null;
}

const MAX_TEXT_FILTER = 80;
const optionalText = z.string().trim().max(MAX_TEXT_FILTER).optional();
const optionalNumber = z.number().nonnegative().optional();

/** Server Action é endpoint público: o cliente pode mandar qualquer coisa. */
const listParamsSchema = z.object({
  busca: optionalText,
  marca: optionalText,
  modelo: optionalText,
  anoMin: optionalNumber,
  anoMax: optionalNumber,
  valorMin: optionalNumber,
  valorMax: optionalNumber,
  kmMax: optionalNumber,
  ordenar: z.enum(["cadastro", "atualizacao", "valor", "km"]).optional(),
});

const clampLimit = (limit: number | undefined): number => {
  const raw = limit ?? ESTOQUE_BATCH_SIZE;
  if (!Number.isFinite(raw) || raw < 1) {
    return ESTOQUE_BATCH_SIZE;
  }
  return Math.min(Math.floor(raw), ESTOQUE_BATCH_MAX);
};

const clampOffset = (offset: number): number => {
  if (!Number.isFinite(offset) || offset < 0) {
    return 0;
  }
  return Math.floor(offset);
};

export const loadEstoqueBatch = async (
  input: LoadEstoqueBatchInput,
): Promise<LoadEstoqueBatchResult> => {
  const parsed = listParamsSchema.safeParse(input.params);
  if (!parsed.success) {
    throw new Error("Filtro inválido.");
  }
  const offset = clampOffset(input.offset);
  const limit = clampLimit(input.limit);

  try {
    const { items, total } = await listMotosBatch(parsed.data, offset, limit);
    const nextOffset = offset + items.length < total ? offset + items.length : null;
    return { items, total, nextOffset };
  } catch {
    throw new Error("Não foi possível carregar mais motos. Tente de novo.");
  }
};
