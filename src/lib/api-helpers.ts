import type { ApiResponse, Meta, PaginatedResponse } from "@/types/api";

const emptyMeta: Meta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  totalPage: 0,
};

type ListPayload<T> = PaginatedResponse<T> | T[] | null | undefined;

export function unwrapList<T>(response: ApiResponse<ListPayload<T>>): {
  items: T[];
  meta: Meta;
} {
  const data = response.data;
  const topMeta: Partial<Meta> = response.meta ?? {};

  if (Array.isArray(data)) {
    return {
      items: data,
      meta: {
        ...emptyMeta,
        ...topMeta,
        total: topMeta.total ?? data.length,
      },
    };
  }

  if (data && Array.isArray(data.data)) {
    return {
      items: data.data,
      meta: {
        ...emptyMeta,
        ...(data.meta ?? {}),
        ...topMeta,
      },
    };
  }

  return { items: [], meta: { ...emptyMeta, ...topMeta } };
}
