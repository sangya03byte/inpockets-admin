"use client";
import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "./api";

export type Loaded<T> = { data: T | null; error: ApiError | null; loading: boolean; reload: () => void };

/** GET `path` (null = skip). `reload()` refetches, e.g. after an action. */
export function useApi<T>(path: string | null): Loaded<T> {
  const [state, setState] = useState<{ data: T | null; error: ApiError | null; loading: boolean }>({ data: null, error: null, loading: path !== null });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (path === null) return;
    let alive = true;
    api.get<T>(path).then(
      (data) => alive && setState({ data, error: null, loading: false }),
      (error: unknown) => alive && setState({ data: null, error: error instanceof ApiError ? error : new ApiError(0, "Unexpected error"), loading: false }),
    );
    return () => { alive = false; };
  }, [path, tick]);

  return { ...state, reload };
}
