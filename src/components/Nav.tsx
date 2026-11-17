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
  name: string;
  status: "open" | "limited" | "booked";
  onHome?: () => void;
  onContact?: () => void;
  showSections?: boolean;
}

export default function Nav({ initials, name, status, onHome, onContact, showSections = true }: Props) {
  const [active, setActive] = useState("top");
  const containerRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [scrolled, setScrolled] = useState(false);

  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    if (el && containerRef.current) {
      const cr = containerRef.current.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      setPill({ x: er.left - cr.left, w: er.width, ready: true });
    }
  }, [active, showSections]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (!showSections) return;
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
  }, [showSections]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="site-header-inner">
        <button className="nav-logo" aria-label="Back to home" onClick={() => (onHome ? onHome() : window.scrollTo({ top: 0, behavior: "smooth" }))}>
          {initials}
        </button>
        <button
          className="site-name"
          aria-label={`${name}, independent creative director`}
          onClick={() => (onHome ? onHome() : window.scrollTo({ top: 0, behavior: "smooth" }))}
        >
          <span className="site-name-main">
            <span>{name.split(" ")[0]}</span>
            <em>{name.split(" ").slice(1).join(" ")}</em>
          </span>
          <span className="site-name-role">Independent creative director</span>
        </button>
        {showSections && (
          <nav className="nav-island" ref={containerRef} aria-label="Sections">
            {pill.ready && (
              <span
                className="nav-pill"
                style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
              />
            )}
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
          </nav>
        )}
        <button className="nav-cta" onClick={() => (onContact ? onContact() : jump("contact"))}>
          <span className="dot" data-s={status} />
          Start a project
        </button>
      </div>
    </header>
  );
}
