import { ListMotosParams, OrdenacaoVeiculo } from "@/lib/clickgarage/types";

export interface QueryValueMap {
  [key: string]: string | string[] | undefined;
}

const firstValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const toOptionalNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isOrdenacao = (value: string | undefined): value is OrdenacaoVeiculo =>
  value === "cadastro" ||
  value === "atualizacao" ||
  value === "valor" ||
  value === "km";

export const homeGridMatchesBaseEstoque = (
  params: ListMotosParams,
  baseOrder: OrdenacaoVeiculo,
): boolean => {
  const hasFilter =
    Boolean(params.busca?.trim()) ||
    Boolean(params.marca?.trim()) ||
    Boolean(params.modelo?.trim()) ||
    params.anoMin !== undefined ||
    params.anoMax !== undefined ||
    params.valorMin !== undefined ||
    params.valorMax !== undefined ||
    params.kmMax !== undefined;
  const order = params.ordenar ?? baseOrder;
  return !hasFilter && order === baseOrder;
};

/** Links antigos `/?moto=ID` (antes das rotas interceptadas) redirecionam para a ficha. */
export const parseLegacyMotoId = (query: QueryValueMap): string | undefined => {
  const raw = firstValue(query.moto)?.trim();
  return raw ? raw : undefined;
};

export const buildMotoDetailHref = (motoId: string): string =>
  `/motos/${encodeURIComponent(motoId)}`;

export const parseEstoqueParams = (query: QueryValueMap): ListMotosParams => {
  const ordenarRaw = firstValue(query.ordenar);
  return {
    busca: firstValue(query.busca),
    marca: firstValue(query.marca),
    modelo: firstValue(query.modelo),
    anoMin: toOptionalNumber(firstValue(query.anoMin)),
    anoMax: toOptionalNumber(firstValue(query.anoMax)),
    valorMin: toOptionalNumber(firstValue(query.valorMin)),
    valorMax: toOptionalNumber(firstValue(query.valorMax)),
    kmMax: toOptionalNumber(firstValue(query.kmMax)),
    ordenar: isOrdenacao(ordenarRaw) ? ordenarRaw : undefined,
  };
};
