import { useEffect, useState } from "react";
import StudioInner from "./Studio";
import { doLogin, loadSession } from "./shared";

import type { StudioTab } from "./StudioTab";

export type { StudioTab };

interface Props {
  initialTab?: "projects" | "inquiries" | "media" | "profile";
  initialProjectId?: number | null;
  onClose: () => void;
  profile: unknown;
}

export default function Studio(props: Props) {
  const [authed, setAuthed] = useState<boolean>(() => loadSession() !== null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authed) setPassword("");
  }, [authed]);

  if (!authed) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "var(--obsidian)",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <form
          className="st-card"
          style={{ width: "min(420px, 100%)", padding: 34 }}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await doLogin(password);
              setAuthed(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Login failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 10 }}>Director Studio</p>
          <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 6 }}>
            Sign in
          </h1>
          <p style={{ fontSize: 14, color: "var(--graphite)", marginBottom: 20 }}>
            Enter the studio password to manage site content.
          </p>
          <input
            className="st-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Studio password"
            autoFocus
          />
          {error && (
            <p style={{ color: "#c93a2e", fontSize: 13.5, marginTop: 10 }}>{error}</p>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="st-btn st-btn-primary" disabled={busy || !password}>
              {busy ? "Checking…" : "Enter Studio"}
            </button>
            <button type="button" className="st-btn st-btn-ghost" onClick={props.onClose}>
              Back to site
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <StudioInner
      onClose={props.onClose}
      onSignOut={() => {
        import("./shared").then((m) => m.clearSession());
        setAuthed(false);
      }}
    />
  );
}
