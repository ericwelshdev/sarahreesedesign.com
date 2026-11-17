"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    setError("");
    const res = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/studio");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <div>
        <label className="st-label" htmlFor="pw">Password</label>
        <input id="pw" name="password" type="password" className="st-input" autoComplete="current-password" autoFocus required />
      </div>
      {error && <p role="alert" className="text-sm" style={{ color: "#d70015" }}>{error}</p>}
      <button className="st-btn st-btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
