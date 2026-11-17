import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ITEMS = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

interface Props {
  initials: string;
  status: "open" | "limited" | "booked";
  onStudio: () => void;
}

export default function Nav({ initials, status, onStudio }: Props) {
  const [active, setActive] = useState("top");
  const containerRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    if (el && containerRef.current) {
      const cr = containerRef.current.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      setPill({ x: er.left - cr.left, w: er.width, ready: true });
    }
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      for (const item of [...ITEMS].reverse()) {
        const section = document.getElementById(item.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActive(item.id);
            return;
          }
        }
      }
      setActive("top");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <div className="nav-island" ref={containerRef} role="navigation" aria-label="Main">
      {pill.ready && (
        <span
          className="nav-pill"
          style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
        />
      )}
      <span className="nav-logo" aria-hidden>
        {initials}
      </span>
      {ITEMS.map((item) => (
        <button
          key={item.id}
          ref={(el) => {
            itemRefs.current[item.id] = el;
          }}
          className={`nav-item${active === item.id ? " active" : ""}`}
          onClick={() => jump(item.id)}
        >
          {item.label}
        </button>
      ))}
      <button
        className="nav-item"
        style={{ display: "none" }}
        onClick={onStudio}
        aria-hidden
        tabIndex={-1}
      />
      <button className="nav-cta" onClick={() => jump("contact")}>
        <span className="dot" data-s={status} />
        Start a project
      </button>
    </div>
  );
}
