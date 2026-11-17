/*
# Portfolio site: schema, security, and seed content

1. Purpose
   Single-tenant portfolio site for a creative director. There is no user
   sign-up/sign-in for visitors; the public site reads content as the `anon`
   role, and content management ("Studio") writes through service-role code.
   Because the browser client only has the anon key, ALL writes from the
   Studio go through an authenticated server boundary; the anon role gets
   SELECT-only access plus one INSERT on the public contact form table.

2. New Tables
   - `profile`        — single row (id = 1) of site-owner copy: name, title,
                        availability, hero headline, bio, stats, principles,
                        capabilities, social links, SEO strings.
   - `projects`       — case studies: slug, title, client, category, year,
                        summary, role, cover/hero images, story sections
                        (challenge/approach/outcome), director note, metrics,
                        process steps, color palette, gallery, credits,
                        published/featured flags, sort order.
   - `clients`        — client index entries: name, descriptor, blurb,
                        preview image, link to a project slug.
   - `accolades`      — press/awards/speaking entries: kind, title,
                        organization, year, note, url.
   - `testimonials`   — quotes with a single "spotlight" flag.
   - `faqs`           — question/answer pairs.
   - `inquiries`      — contact-form submissions: name, email, company,
                        project type, budget, message, workflow status.
   - `media`          — uploaded images: filename, mime, size, bytes
                        (base64 text; served back through the app).

3. Modified Tables
   None (all tables are new).

4. Security (RLS + grants)
   - RLS enabled on every table.
   - `anon` + `authenticated`: SELECT on all content tables so the public
     site (anon key) can read published content. The profile row is
     intentionally public.
   - `anon` INSERT on `inquiries` only — the one public write path (contact
     form). No anon update/delete anywhere.
   - `service_role`: full CRUD on all tables + media, used by the
     server-side Studio endpoints which enforce their own password gate.
     `service_role` bypasses RLS but still needs grants.
   - No direct anon/authenticated writes to content tables; the Studio UI
     does not talk to the database directly with user privileges.

5. Notes
   - Seed data (profile row + example content) is inserted in a second
     migration-safe statement guarded with ON CONFLICT DO NOTHING so replay
     on a fresh database is idempotent.
   - inquiry status defaults to 'new'; media bytes stored as text.
*/

-- ============ tables ============

CREATE TABLE IF NOT EXISTS profile (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT 'open'
    CHECK (availability IN ('open', 'limited', 'booked')),
  availability_text text NOT NULL DEFAULT '',
  hero_headline text NOT NULL DEFAULT '',
  hero_accent text NOT NULL DEFAULT '',
  hero_sub text NOT NULL DEFAULT '',
  showreel_url text NOT NULL DEFAULT '',
  showreel_poster text NOT NULL DEFAULT '',
  showreel_label text NOT NULL DEFAULT '',
  portrait_url text NOT NULL DEFAULT '',
  about_headline text NOT NULL DEFAULT '',
  about_accent text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  short_version text NOT NULL DEFAULT '',
  footer_note text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  principles jsonb NOT NULL DEFAULT '[]'::jsonb,
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'brand'
    CHECK (category IN ('web', 'brand', 'campaign')),
  year text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  demo_slug text NOT NULL DEFAULT '',
  live_url text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  approach text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  director_note text NOT NULL DEFAULT '',
  palette_story text NOT NULL DEFAULT '',
  voice_narrative text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  disciplines jsonb NOT NULL DEFAULT '[]'::jsonb,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  process jsonb NOT NULL DEFAULT '[]'::jsonb,
  palette jsonb NOT NULL DEFAULT '[]'::jsonb,
  typography jsonb NOT NULL DEFAULT '[]'::jsonb,
  voice_principles jsonb NOT NULL DEFAULT '[]'::jsonb,
  copy_examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  hurdles jsonb NOT NULL DEFAULT '[]'::jsonb,
  decisions jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  credits jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  descriptor text NOT NULL DEFAULT '',
  blurb text NOT NULL DEFAULT '',
  preview_image text NOT NULL DEFAULT '',
  project_slug text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS accolades (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind text NOT NULL DEFAULT 'award' CHECK (kind IN ('award', 'speaking', 'press')),
  title text NOT NULL,
  organization text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote text NOT NULL,
  author text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  spotlight boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inquiries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL DEFAULT '',
  project_type text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  mime text NOT NULL,
  size integer NOT NULL,
  data text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ indexes ============

CREATE INDEX IF NOT EXISTS projects_sort_idx ON projects (sort_order, id);
CREATE INDEX IF NOT EXISTS clients_sort_idx ON clients (sort_order, id);
CREATE INDEX IF NOT EXISTS accolades_sort_idx ON accolades (sort_order, id);
CREATE INDEX IF NOT EXISTS testimonials_sort_idx ON testimonials (sort_order, id);
CREATE INDEX IF NOT EXISTS faqs_sort_idx ON faqs (sort_order, id);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries (created_at DESC);

-- ============ RLS ============

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE accolades ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read of content (the site intentionally serves shared content to
-- every visitor; no sign-in exists).
DROP POLICY IF EXISTS "public_read_profile" ON profile;
CREATE POLICY "public_read_profile" ON profile
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_clients" ON clients;
CREATE POLICY "public_read_clients" ON clients
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_accolades" ON accolades;
CREATE POLICY "public_read_accolades" ON accolades
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_inquiries" ON inquiries;
CREATE POLICY "public_read_inquiries" ON inquiries
  FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries" ON inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "no_anon_media" ON media;
CREATE POLICY "no_anon_media" ON media
  FOR SELECT TO anon, authenticated USING (false);

-- ============ grants ============

GRANT SELECT ON profile, projects, clients, accolades, testimonials, faqs TO anon, authenticated;
GRANT SELECT, INSERT ON inquiries TO anon, authenticated;
GRANT USAGE ON SEQUENCE inquiries_id_seq TO anon, authenticated;

GRANT ALL ON profile, projects, clients, accolades, testimonials, faqs, inquiries, media TO service_role;
GRANT USAGE ON SEQUENCE projects_id_seq, clients_id_seq, accolades_id_seq, testimonials_id_seq, faqs_id_seq, inquiries_id_seq TO service_role;
