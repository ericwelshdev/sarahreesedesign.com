"use client";

import { useIndicator } from "./useIndicator";

export interface SegOption {
  value: string;
  label: string;
}

export default function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const { containerRef, register, style } = useIndicator(value);
  return (
    <div className="seg-scroll">
      <div className="seg" role="group" aria-label={label} ref={containerRef}>
        <span className="seg-thumb" style={style} aria-hidden />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            ref={register(o.value)}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
