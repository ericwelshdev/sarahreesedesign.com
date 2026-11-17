import { useState } from "react";
import StudioInner from "./Studio";
import { doLogin, loadSession } from "./shared";

interface Props {
  onClose: () => void;
}

export default function Studio({ onClose }: Props) {
  const [authed, setAuthed] = useState<boolean>(() => loadSession() !== null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
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
          <p className="eyebrow" style={{ marginBottom: 10 }}>Director Studio — private workspace</p>
          <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 6 }}>
            Sign in
          </h1>
          <p style={{ fontSize: 14, color: "var(--graphite)", marginBottom: 20 }}>
            This is the content-management area — visitors never see this page. Enter the studio password to manage site content.
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
            <button type="button" className="st-btn st-btn-ghost" onClick={onClose}>
              Back to site
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <StudioInner
      onClose={onClose}
      onSignOut={() => {
        import("./shared").then((m) => m.clearSession());
        setAuthed(false);
      }}
    />
  );
}
