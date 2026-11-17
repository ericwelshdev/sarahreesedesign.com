"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Measures the active item inside a relatively-positioned container so a pill can slide to it. */
export function useIndicator(activeKey: string | null) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const [rect, setRect] = useState({ x: 0, w: 0, visible: false });

  const measure = useCallback(() => {
    const el = activeKey ? items.current.get(activeKey) : null;
    if (!el) {
      setRect((r) => (r.visible ? { ...r, visible: false } : r));
      return;
    }
    setRect((r) => (r.x === el.offsetLeft && r.w === el.offsetWidth && r.visible ? r : { x: el.offsetLeft, w: el.offsetWidth, visible: true }));
  }, [activeKey]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const register = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) items.current.set(key, el);
      else items.current.delete(key);
    },
    [],
  );

  const style = {
    transform: `translateX(${rect.x}px)`,
    width: rect.w,
    opacity: rect.visible ? 1 : 0,
  };

  return { containerRef, register, style };
}
