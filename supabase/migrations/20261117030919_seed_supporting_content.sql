/*
# Seed remaining starter content (clients, accolades, testimonials, FAQs)

1. Purpose
   Fill the remaining content tables, each guarded by an emptiness check so
   replaying the migration never duplicates rows.

2. Tables touched
   - `clients`: eight client-index entries.
   - `accolades`: seven press/award/speaking entries.
   - `testimonials`: five quotes, one spotlight.
   - `faqs`: five questions.

3. Security
   No policy changes.
*/

INSERT INTO clients (name, descriptor, blurb, preview_image, project_slug, published, sort_order)
SELECT * FROM (VALUES
  ('Google', 'Keynote storytelling', 'Executive narrative systems for global product launches.', '', '', true, 1),
  ('Volvo', 'Campaign & education', 'Fleet electrification education for boardroom audiences.', '/images/projects/volvo-mobility.jpg', 'sustainable-mobility-education', true, 2),
  ('Microsoft', 'Executive storytelling', 'Leadership keynotes and product-story systems.', '', '', true, 3),
  ('eHealth', 'Brand development', 'Dii: a family-care brand built around warmth.', '/images/projects/dii-brand.jpg', 'dii-brand-development', true, 4),
  ('Lyst', 'Digital & editorial', 'Fashion platform content systems and campaigns.', '', '', true, 5),
  ('Natural Highs', 'Community brand', 'A wellness identity with street-level energy.', '/images/projects/natural-highs.jpg', 'natural-highs-brand-identity', true, 6),
  ('A.E. Wells', 'Publishing identity', 'A literary imprint built on one serif and two inks.', '/images/projects/serendipity.jpg', 'serendipity-by-ae-wells', true, 7),
  ('Restore OT', 'Identity & web', 'A practice rebuilt from business cards to booking flow.', '/images/projects/restore-ot.jpg', 'restore-ot-brand-and-web', true, 8)
) AS v(name, descriptor, blurb, preview_image, project_slug, published, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM clients);

INSERT INTO accolades (kind, title, organization, year, note, url, published, sort_order)
SELECT * FROM (VALUES
  ('award', 'Design Distinction', 'ID Annual Review', '2024', 'Dii brand development', '', true, 1),
  ('award', 'Brand Identity of the Year, Shortlist', 'National Design Awards', '2024', 'Serendipity cover system', '', true, 2),
  ('award', 'Excellence in Campaign Design', 'The Brand Guild', '2023', 'Nordic Mobility education campaign', '', true, 3),
  ('speaking', 'Designing Brands That Remember', 'OFFSET Conference', '2025', 'Main stage', '', true, 4),
  ('speaking', 'The Independent''s Toolkit', 'AIGA California', '2024', 'Panel moderator', '', true, 5),
  ('press', 'Ten Independent Directors to Watch', 'Design Week', '2024', 'Profile feature', '', true, 6),
  ('press', 'The Case Against Category Conventions', 'It''s Nice That', '2023', 'Essay', '', true, 7)
) AS v(kind, title, organization, year, note, url, published, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM accolades);

INSERT INTO testimonials (quote, author, role, company, spotlight, published, sort_order)
SELECT * FROM (VALUES
  ('Sarah works the way our best product teams do: small rooms, fast decisions, and a standard nothing gets under. She rebuilt how a century-old brand shows up — and made the whole company proud of it.', 'Marissa Salazar', 'VP, Brand & Communications', 'Microsoft', true, true, 1),
  ('The identity landed with families exactly as designed. Our conversion numbers moved, but the bigger change is that the team finally has words for who we are.', 'James Okafor', 'CEO', 'eHealth', false, true, 2),
  ('She delivered a system our volunteers can actually run — two quarters later, sign-ups have doubled and the posters still stop people on the sidewalk.', 'Dana Whitfield', 'Program Director', 'Natural Highs', false, true, 3),
  ('The keynote got the first standing ovation this room has given in a decade. The device she built now runs through everything we publish.', 'Henrik Sollie', 'Chief Marketing Officer', 'Enterprise Investment', false, true, 4),
  ('Covers that sell books at thumbnail size, produced in a day each. The system is smarter than our budget was big — exactly what she promised.', 'Adaeze Wells', 'Publisher', 'A.E. Wells', false, true, 5)
) AS v(quote, author, role, company, spotlight, published, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

INSERT INTO faqs (question, answer, published, sort_order)
SELECT * FROM (VALUES
  ('What does an engagement look like?', 'Most engagements run six to ten weeks and are scoped around a single deliverable: an identity system, a campaign, or a digital product direction. I work embedded with your team — small rooms, senior people, decisions made fast.', true, 1),
  ('Do you work with startups or only big brands?', 'Both. Roughly half my work is with founders naming and shaping a company for the first time; the other half is with enterprise teams rethinking how an established brand shows up.', true, 2),
  ('Can you build the website too?', 'Yes — for most identity engagements I design and ship the site as well, either directly or with a small trusted build team depending on the scope.', true, 3),
  ('What do you need from me to start?', 'A decision-maker in the room and an honest brief. The first week is discovery: interviews, category teardown, and a shared definition of what "distinct" means for your market.', true, 4),
  ('How do we begin?', 'Start a conversation below with a sentence or two about the challenge. I reply to every inquiry within two business days.', true, 5)
) AS v(question, answer, published, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faqs);
