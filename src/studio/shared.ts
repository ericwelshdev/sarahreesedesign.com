import { useCallback, useEffect, useState } from "react";
import { studioApi, studioLogin, clearSession, loadSession } from "../lib/studio-client";
import type { MediaItem, Project } from "../types";
import type { ResourceKey } from "./resources";

export { studioApi, clearSession, loadSession };
export type { MediaItem, Project, ResourceKey };

export interface Toast {
  msg: string;
  err?: boolean;
}

export function useToast(): [Toast | null, (msg: string, err?: boolean) => void] {
  const [toast, setToast] = useState<Toast | null>(null);
  const show = useCallback((msg: string, err?: boolean) => {
    setToast({ msg, err });
    window.setTimeout(() => setToast(null), 2600);
  }, []);
  return [toast, show];
}

export function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || ""
  );
}

export async function doLogin(password: string): Promise<void> {
  await studioLogin(password);
}
