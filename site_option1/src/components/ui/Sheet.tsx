"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** iOS-style bottom sheet (UISheetPresentationController feel): drag handle, drag-to-dismiss, spring presentation. */
export default function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [on, setOn] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const drag = useRef({ active: false, startY: 0, dy: 0, t: 0, v: 0 });

  // Presentation lifecycle: mount, then animate in; animate out, then unmount.
  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          setOn(true);
          sheetRef.current?.focus({ preventScroll: true });
        });
      });
    } else {
      setOn(false);
      t1 = setTimeout(() => {
        setMounted(false);
        returnFocus.current?.focus?.({ preventScroll: true });
      }, 650);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (t1) clearTimeout(t1);
    };
  }, [open]);

  // Scroll lock + keyboard handling.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && sheetRef.current) {
        const f = sheetRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = sheetRef.current;
    if (!el) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { active: true, startY: e.clientY, dy: 0, t: performance.now(), v: 0 };
    el.style.transition = "none";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    const el = sheetRef.current;
    if (!d.active || !el) return;
    const dy = Math.max(0, e.clientY - d.startY);
    const now = performance.now();
    d.v = (dy - d.dy) / Math.max(1, now - d.t);
    d.dy = dy;
    d.t = now;
    el.style.transform = `translate(-50%, ${dy}px)`;
  }, []);

  const endDrag = useCallback(() => {
    const d = drag.current;
    const el = sheetRef.current;
    if (!d.active || !el) return;
    d.active = false;
    el.style.transition = "";
    el.style.transform = "";
    if (d.dy > 140 || d.v > 0.7) onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <>
      <div className={`sheet-backdrop ${on ? "on" : ""}`} onClick={onClose} aria-hidden />
      <div ref={sheetRef} className={`sheet ${on ? "on" : ""}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        <div
          className="sheet-grab"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <i />
        </div>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
