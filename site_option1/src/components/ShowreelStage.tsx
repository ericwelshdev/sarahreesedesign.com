"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Showreel with an Apple-style scroll-linked scale expansion and
 * a custom glass mute / play control.
 */
export default function ShowreelStage({ src, poster, label }: { src: string; poster: string; label: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  // Scroll-linked scale: 0 -> 1 as the stage rises into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Pause when off-screen to save battery.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && playing) v.play().catch(() => {});
    else v.pause();
  }, [inView, playing]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      setPlaying(true);
      v.play().catch(() => {});
    }
  };

  const hasVideo = Boolean(src);

  return (
    <div className="stage-wrap" data-reveal>
      <div className="stage" ref={stageRef}>
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="stage-poster" src={poster} alt="" />
        )}
        {hasVideo && (
          <video ref={videoRef} src={src} poster={poster || undefined} autoPlay muted loop playsInline preload="metadata" aria-label={label || "Showreel"} />
        )}
        <div className="stage-ui">
          <span className="glass glass-btn" style={{ cursor: "default", paddingLeft: 16 }}>
            <span className="dot" data-s="open" style={{ background: "#ff453a", color: "#ff453a" }} />
            {label || "Showreel"}
          </span>
          {hasVideo && (
            <div className="flex items-center gap-2">
              <button type="button" className="glass glass-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause showreel" : "Play showreel"} style={{ padding: 0, width: 44, justifyContent: "center" }}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1.5" width="3.5" height="11" rx="1" /><rect x="8.5" y="1.5" width="3.5" height="11" rx="1" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" /></svg>
                )}
              </button>
              <button type="button" className="glass glass-btn" onClick={toggleMute} aria-pressed={!muted} aria-label={muted ? "Unmute showreel" : "Mute showreel"}>
                <span className="eq" data-on={!muted} aria-hidden>
                  <i /><i /><i />
                </span>
                {muted ? "Sound off" : "Sound on"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
