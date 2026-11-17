/*
# Add studio_sessions table for CMS login

1. Purpose
   The Studio CMS signs its owner in with a shared password (no user
   accounts). On login, an edge function issues a random bearer token and
   stores only its SHA-256-style HMAC hash here. Every subsequent CMS write
   presents the token; the server hashes it and looks it up, so a database
   leak never exposes live session tokens.

2. New Tables
   - `studio_sessions`
     - `id` (uuid, primary key)
     - `token_hash` (text, unique) — keyed hash of the issued token
     - `expires_at` (timestamptz) — session expiry
     - `created_at` (timestamptz)

3. Security
   - RLS enabled; no policies are granted to anon or authenticated because
     only the service role (server code) reads and writes this table. The
     table is therefore invisible to browser clients.
   - Expired rows are deleted opportunistically on each login.
*/

CREATE TABLE IF NOT EXISTS studio_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE studio_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON studio_sessions FROM anon, authenticated;
GRANT ALL ON studio_sessions TO service_role;
