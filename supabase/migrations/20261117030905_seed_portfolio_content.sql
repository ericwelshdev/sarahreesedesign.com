/*
# Seed portfolio content (retry 2: fixes VALUES column aliasing)

1. Purpose
   Insert the site-owner profile row and six starter case studies. All inserts
   use ON CONFLICT / stable-value guards so replay changes nothing.

2. Tables touched
   - `profile`: one row (id = 1).
   - `projects`: six case studies referenced by stable slug; published = true,
     sort_order assigned by listed order, Dii pinned as featured.

3. Security
   No policy changes.
*/

INSERT INTO profile (
  id, name, title, location, email, linkedin_url, instagram_url,
  availability, availability_text,
  hero_headline, hero_accent, hero_sub,
  showreel_url, showreel_poster, showreel_label,
  portrait_url, about_headline, about_accent, bio, short_version,
  footer_note, seo_title, seo_description,
  stats, principles, capabilities
) VALUES (
  1,
  'Sarah Reese',
  'Independent Creative Director',
  'California · Worldwide',
  'hi@sarahreesedesign.com',
  'https://www.linkedin.com',
  'https://www.instagram.com',
  'open',
  'Booking projects for next quarter',
  'Work, and the thinking',
  'behind it.',
  'Creative direction for brands, campaigns and products people remember. I lead identity, campaign and digital work from first brief to final ship — with the craft in the room, not on a slide.',
  '', '', 'Showreel 2025',
  '',
  'A few answers',
  'about the work.',
  E'Sarah Reese is an independent creative director with over a decade leading brand, campaign, and digital work for startups and Fortune 500 companies.\n\nShe has built identity systems for companies at every stage — from seed-stage founders naming their company to enterprise teams rethinking how a global brand shows up. Her work spans brand identity, campaigns, and digital product direction, always with the same focus: work that is unmistakably itself.\n\nShe partners directly with founders, CMOs, and product leaders as a embedded creative lead — small rooms, senior people, decisions made fast.',
  'Ten years in, the conviction is simple: brands are not what you say about yourself — they are what people walk away remembering. So I build memory: identity systems with a point of view, campaigns with a spine, digital work with real craft. The rest is discipline.',
  'Independent creative director — California, working worldwide.',
  'Sarah Reese — Independent Creative Director',
  'Case studies, process and live work from an independent creative director.',
  '[{"value":"10+","label":"Years leading creative"},{"value":"40+","label":"Brands shipped"},{"value":"6","label":"Industry recognitions"}]'::jsonb,
  '[{"title":"Craft is the strategy","body":"A brand is only as credible as its weakest artifact. I hold every touchpoint — deck, package, pixel — to the same standard, because audiences feel consistency before they can name it."},{"title":"Small rooms, senior people","body":"No account layers, no telephone game. The person you meet is the person who does the work, which means decisions happen in hours, not weeks."},{"title":"Distinct or invisible","body":"Category conventions are where brands go to disappear. I push every engagement toward something ownable — a color, a voice, a shape — that competitors cannot borrow without looking like the copy."},{"title":"Ship, then sharpen","body":"Work that never launches helps no one. I structure engagements so something real ships early, then we sharpen it in the wild with real audience feedback."}]'::jsonb,
  '["Brand identity systems","Art direction","Campaign development","Digital product direction","Typography & design systems","Executive storytelling","Pitch & keynote decks","Design team leadership"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (
  slug, title, client, category, year, summary, role,
  cover_image, hero_image, challenge, approach, outcome, director_note,
  palette_story, voice_narrative, published, featured, sort_order,
  disciplines, metrics, process, palette, typography, voice_principles,
  copy_examples, hurdles, decisions, gallery, credits
)
SELECT
  v.slug, v.title, v.client, v.category, v.year, v.summary, v.role,
  v.cover_image, v.hero_image, v.challenge, v.approach, v.outcome, v.director_note,
  v.palette_story, v.voice_narrative,
  true,
  v.slug = 'dii-brand-development',
  v.ord,
  v.disciplines, v.metrics, v.process, v.palette, v.typography, v.voice_principles,
  v.copy_examples, v.hurdles, v.decisions, v.gallery, v.credits
FROM (VALUES
  (
    'dii-brand-development', 1,
    'Dii — Brand Development', 'eHealth', 'brand', '2025',
    'A family-care brand built around warmth instead of worry — identity, voice and a design system that made a complicated service feel human.',
    'Creative Director, brand & voice',
    '/images/projects/dii-brand.jpg', '/images/projects/dii-hero.jpg',
    'eHealth was launching Dii, a service for families coordinating care for aging parents. The category speaks in anxious blues and stock hand-holding; the brief was to build a brand families would actually trust — warm, capable, and calm without being childish.',
    'We positioned Dii as "the capable friend" — the one who shows up with a plan. The identity pairs a rounded, humanist wordmark with a sun-warmed palette and documentary photography of real families. Voice guidelines rewrite category fear language ("don''t wait until it''s too late") into agency language ("here''s what we can do today").',
    'Dii launched with a full identity system, a 60-page design standard, and launch campaign across paid and organic. Sign-up conversion beat the category benchmark by 34% in the first quarter, and the voice system is now being extended into the parent brand.',
    'The warmth had to be earned, not decorated. We cut every stock smile and rebuilt the photography direction around real moments — which is what made the palette and voice land instead of float.',
    'Warmth before worry — the palette moves from morning gold to calm forest, with coral reserved for the moments the brand acts on your behalf.',
    'Dii sounds like the capable friend: plain sentences, active verbs, and never a scare without a next step.',
    '["Brand identity","Voice & messaging","Design system","Launch campaign"]'::jsonb,
    '[{"value":"34%","label":"Above category benchmark","detail":"First-quarter sign-up conversion vs. category average"},{"value":"60+","label":"Page design standard","detail":"Full system covering identity, voice and product UI"},{"value":"6 wks","label":"Brief to launch","detail":"Identity, voice and campaign in market"}]'::jsonb,
    '[{"title":"Discover","duration":"Wks 1–2","description":"Stakeholder interviews, family panels, and a category teardown across twelve competitor brands.","outputs":["Insight deck","Positioning territories"]},{"title":"Define","duration":"Wks 2–3","description":"Positioning, naming checks, and the voice foundation — who Dii is, in one page everyone can quote.","outputs":["Positioning statement","Voice principles"]},{"title":"Design","duration":"Wks 3–5","description":"Identity system: wordmark, palette, typography, photography direction and product UI tokens.","outputs":["Identity system","Design standard"]},{"title":"Deliver","duration":"Wks 5–6","description":"Launch campaign toolkits and team enablement so the internal crew could run the system without us.","outputs":["Campaign toolkit","Team playbook"]}]'::jsonb,
    '[{"name":"Morning Gold","hex":"#F2A94E","role":"Primary","rationale":"The color of the moment a day starts — optimism without neon."},{"name":"Calm Forest","hex":"#2F5D50","role":"Foundation","rationale":"Grounds the gold; reads clinical enough for a health-adjacent service."},{"name":"Warm Coral","hex":"#F26B4E","role":"Action","rationale":"Reserved for actions and moments of help — the brand''s hands."},{"name":"Paper","hex":"#FAF6EF","role":"Canvas","rationale":"Warm paper instead of clinical white; the whole system sits on it."}]'::jsonb,
    '[{"role":"Display","family":"Fraunces","classification":"serif","sample":"Aa","rationale":"A serif with warm ink traps — human, a little literary, never precious."},{"role":"Text","family":"Public Sans","classification":"sans","sample":"Aa","rationale":"Government-grade clarity; long-form reading for tired families."},{"role":"Detail","family":"JetBrains Mono","classification":"mono","sample":"Aa","rationale":"For forms, checklists and anything a family fills in together."}]'::jsonb,
    '["Plain sentences, always","A scare is never without a next step","Say the thing once, well","No jargon in the room"]'::jsonb,
    '[{"before":"Don''t wait until it''s too late.","after":"Here''s what you can do today.","note":"Category fear language replaced with agency."},{"before":"Our comprehensive suite of care solutions.","after":"One place for everything your parents need.","note":"Suite-speak traded for a single, concrete promise."}]'::jsonb,
    '[{"kind":"Regulatory","title":"Health claims review","constraint":"Every line of copy needed legal review, threatening the warm voice.","resolution":"Built a pre-approved phrase library with legal in week one — 90% of launch copy shipped unedited."},{"kind":"Brand","title":"Parent-brand gravity","constraint":"eHealth''s existing brand pulled toward anxious blue and stock photography.","resolution":"A bright-line rule: Dii never borrows the parent palette. Shared components, separate soul."}]'::jsonb,
    '[{"area":"Naming","decision":"Dii, lowercase","rationale":"Lowercase reads like a person, not an institution."},{"area":"Photography","decision":"Documentary over staged","rationale":"Real families forgive imperfect light; staged ones never look like yours."},{"area":"Palette","decision":"Gold over blue","rationale":"The category owns blue; warmth was the open territory."}]'::jsonb,
    '[{"src":"/images/projects/dii-brand.jpg","caption":"Identity system overview"},{"src":"/images/projects/dii-hero.jpg","caption":"Launch campaign key visual"},{"src":"/images/projects/dii-brand.jpg","caption":"Voice & tone standard"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction"},{"name":"Studio North","role":"Design & production"},{"name":"eHealth internal","role":"Product & marketing"}]'::jsonb
  ),
  (
    'natural-highs-brand-identity', 2,
    'Natural Highs — Brand Identity', 'Natural Highs', 'brand', '2024',
    'A wellness community center that refused to look like a spa — a hand-built identity with a street-level pulse.',
    'Creative Director',
    '/images/projects/natural-highs.jpg', '/images/projects/natural-highs.jpg',
    'Natural Highs runs community wellness programming — but its brand read either as spa-luxury or crunchy cliché, and neither matched the place''s street-level energy.',
    'We built the identity around hand-mixed color and a custom marker typeface, treating posters like the street art the neighborhood already speaks. Photography is candid, unretouched, and centered on participants rather than teachers.',
    'The rebrand doubled program sign-ups within two quarters and gave the center a poster system volunteers can produce themselves with a template kit.',
    'Community brands die when they look professionally distant. The deliberate roughness isn''t a style — it''s a handshake.',
    'Street-level color, mixed by hand — no pastels, no spa green.',
    'Natural Highs talks like a neighbor, not a brochure.',
    '["Brand identity","Signage & wayfinding","Poster system"]'::jsonb,
    '[{"value":"2x","label":"Program sign-ups","detail":"Two quarters post-launch vs. prior year"},{"value":"40+","label":"Poster templates","detail":"Volunteer-ready kit across program types"},{"value":"1","label":"Neighborhood","detail":"Every asset speaks the street''s visual language"}]'::jsonb,
    '[{"title":"Discover","duration":"Wks 1–2","description":"Weeks on-site; staff and participant interviews; poster archaeology of the neighborhood.","outputs":["Field notes","Territory sketches"]},{"title":"Design","duration":"Wks 3–6","description":"Identity built in the open — test posters pasted up and iterated in situ.","outputs":["Identity system","Poster kit"]},{"title":"Enable","duration":"Wks 7–8","description":"Template workshops so volunteers could run the system themselves.","outputs":["Template library","Workshop"]}]'::jsonb,
    '[{"name":"Pigment Pop","hex":"#E84B2C","role":"Primary","rationale":"Hardware-store red; the neighborhood''s color, not a brand book''s."},{"name":"Deep Moss","hex":"#3E4A2E","role":"Foundation","rationale":"Grounds the red; borrowed from the trailheads nearby."},{"name":"Chalk","hex":"#F4F0E6","role":"Canvas","rationale":"Every poster starts as chalk paint on paper."}]'::jsonb,
    '[{"role":"Display","family":"Custom marker","classification":"sans","sample":"Aa","rationale":"Drawn from the center''s own workshop signage."},{"role":"Text","family":"Inter","classification":"sans","sample":"Aa","rationale":"Plain workhorse for schedules and forms."}]'::jsonb,
    '["Talk like a neighbor","Candid over staged","Posters first"]'::jsonb,
    '[{"before":"Holistic wellness for mind, body and spirit.","after":"Show up. We''ll take it from there.","note":"Brochure-speak to an invitation."}]'::jsonb,
    '[{"kind":"Budget","title":"No photo budget","constraint":"No budget for photography.","resolution":"Trained staff on phone photography with a simple one-page brief; candid shots now anchor the brand."}]'::jsonb,
    '[{"area":"Posters","decision":"Street-first format","rationale":"The neighborhood''s existing visual language is wheatpasted paper, not web banners."}]'::jsonb,
    '[{"src":"/images/projects/natural-highs.jpg","caption":"Poster series in situ"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction"},{"name":"Natural Highs crew","role":"Production"}]'::jsonb
  ),
  (
    'serendipity-by-ae-wells', 3,
    'Serendipity — A.E. Wells', 'A.E. Wells', 'brand', '2024',
    'A literary fiction imprint for readers who judge a book by its cover — identity, cover system and voice from zero.',
    'Creative Director',
    '/images/projects/serendipity.jpg', '/images/projects/serendipity.jpg',
    'A new fiction imprint needed a cover system that could carry unknown authors and a bookshelf brand within eighteen months — with no photography budget and a two-person team.',
    'We built the imprint around typography: a single serif family, a strict grid, and a two-ink palette that flexes per genre. Covers are designed to be recognizable at thumbnail size, where most books are now bought.',
    'The first four titles all went to second printings; the imprint''s covers were shortlisted for a national design award, and the system now produces a cover in a day.',
    'Restraint was the whole idea. One typeface, two inks, and a grid — the system had to be smarter than the budget was big.',
    'Two inks and one serif — a system designed for the thumbnail economy.',
    'The imprint speaks in book-flap English: confident, literary, allergic to hype.',
    '["Brand identity","Editorial design","Cover system"]'::jsonb,
    '[{"value":"4/4","label":"Titles to second printing","detail":"Every launch title outgrew its first run"},{"value":"1 day","label":"Cover production","detail":"Per title, after system setup"},{"value":"2","label":"Ink palette","detail":"Strict two-ink system per genre"}]'::jsonb,
    '[{"title":"Define","duration":"Wks 1–2","description":"Genre teardown of 80 contemporary covers; thumbnail-legibility as the core constraint.","outputs":["System principles","Genre map"]},{"title":"Design","duration":"Wks 3–6","description":"Grid, serif family selection, ink palette per genre; templates for every trim size.","outputs":["Cover system","Production guide"]},{"title":"Launch","duration":"Wks 7–8","description":"First four titles produced and the internal team trained on the system.","outputs":["Four covers","Training"]}]'::jsonb,
    '[{"name":"Ink Navy","hex":"#1E2A3A","role":"Primary","rationale":"Reads as literature, survives cheap paper."},{"name":"Ember","hex":"#D65A31","role":"Accent","rationale":"One hot ink per genre keeps the shelf coherent and distinct."},{"name":"Book Cream","hex":"#F5EFE2","role":"Canvas","rationale":"Uncoated stock warmth baked into every cover."}]'::jsonb,
    '[{"role":"Display","family":"Canela","classification":"serif","sample":"Aa","rationale":"The whole identity lives in one serif, at every size."},{"role":"Detail","family":"Söhne Mono","classification":"mono","sample":"Aa","rationale":"ISBNs, prices and colophon detail."}]'::jsonb,
    '["Thumbnail-first design","One typeface, two inks","Restraint over decoration"]'::jsonb,
    '[{"before":"A bold new voice in contemporary fiction.","after":"A novel you''ll press into a friend''s hands.","note":"Hype to recommendation."}]'::jsonb,
    '[{"kind":"Production","title":"Uncoated stock drift","constraint":"Inks shifted unpredictably on uncoated paper.","resolution":"A printed swatch ring now ships with every production run; the palette is specified in lab values, not hex."}]'::jsonb,
    '[{"area":"Type","decision":"One serif family","rationale":"Recognition lives in repetition, not variety."},{"area":"Color","decision":"Two inks per genre","rationale":"Shelf coherence plus genre distinction at a glance."}]'::jsonb,
    '[{"src":"/images/projects/serendipity.jpg","caption":"First four titles"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction & design"},{"name":"A.E. Wells","role":"Publishing"}]'::jsonb
  ),
  (
    'restore-ot-brand-and-web', 4,
    'Restore OT — Brand & Web', 'Restore OT', 'web', '2023',
    'An occupational therapy practice rebuilt from business cards to booking flow — identity plus a site that fills the calendar.',
    'Creative Director, design & build',
    '/images/projects/restore-ot.jpg', '/images/projects/restore-ot.jpg',
    'A growing OT practice had a logo from 2011 and a site that couldn''t take a booking. Referrals came by fax; families booked by phone during work hours.',
    'We rebuilt the identity around steady, competent calm — then shipped a site where the booking flow is the homepage. Every stock phrase was replaced with plain-English answers to the questions families actually ask.',
    'Online bookings now account for two-thirds of new appointments, and the practice''s intake paperwork dropped from eleven forms to three.',
    'Healthcare sites usually bury the booking button under mission statements. We inverted the whole page hierarchy — book first, believe later.',
    'Calm competence — the palette is the waiting room at golden hour.',
    'Restore OT answers like a good receptionist: warm, concrete, zero jargon.',
    '["Brand identity","Web design & build","Service design"]'::jsonb,
    '[{"value":"2/3","label":"Bookings online","detail":"Share of new appointments booked without a phone call"},{"value":"11 to 3","label":"Intake forms","detail":"Paperwork consolidation across the journey"},{"value":"+41%","label":"New referrals","detail":"Year over year after relaunch"}]'::jsonb,
    '[{"title":"Audit","duration":"Wks 1–2","description":"Shadowed the front desk for a week; mapped every step from referral to first appointment.","outputs":["Journey map","Content audit"]},{"title":"Identity","duration":"Wks 3–4","description":"Wordmark, palette and template refresh across print and forms.","outputs":["Identity kit","Form templates"]},{"title":"Build","duration":"Wks 4–8","description":"Site design and build with booking as the primary action on every page.","outputs":["Marketing site","Booking flow"]}]'::jsonb,
    '[{"name":"Golden Hour","hex":"#E9A13B","role":"Primary","rationale":"The waiting-room light at 5pm — calm, not clinical."},{"name":"Slate","hex":"#3B4450","role":"Foundation","rationale":"Steady, professional, readable in every form field."},{"name":"Bone","hex":"#F7F3EC","role":"Canvas","rationale":"Soft canvas that keeps the clinical edge off."}]'::jsonb,
    '[{"role":"Display","family":"Söhne","classification":"sans","sample":"Aa","rationale":"Straightforward and kind, with no bedside pretension."},{"role":"Text","family":"Söhne","classification":"sans","sample":"Aa","rationale":"One family, all weights — practices run on consistency."}]'::jsonb,
    '["Book first, believe later","Plain-English answers","No stock hand-holding photos"]'::jsonb,
    '[{"before":"We provide compassionate, patient-centered care.","after":"We''ll see your daughter within two weeks.","note":"Mission statement to a concrete commitment."}]'::jsonb,
    '[{"kind":"Compliance","title":"Patient privacy in imagery","constraint":"HIPAA-adjacent limits on photography of real patients.","resolution":"Illustration system for exercises and anatomy; photography reserved for spaces, never people."}]'::jsonb,
    '[{"area":"Hierarchy","decision":"Booking above the fold","rationale":"Families arrive ready to book; the homepage finally says so."},{"area":"Forms","decision":"Eleven to three","rationale":"Front-desk shadowing showed where the real drop-off was."}]'::jsonb,
    '[{"src":"/images/projects/restore-ot.jpg","caption":"Homepage with booking-first hierarchy"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction, design & build"},{"name":"Restore OT","role":"Clinical team"}]'::jsonb
  ),
  (
    'enterprise-investment-keynote', 5,
    'The Long Game — Enterprise Keynote', 'Enterprise Investment', 'campaign', '2024',
    'A keynote and campaign system for an asset manager that had to say "boring is beautiful" — without being boring.',
    'Creative Director',
    '/images/projects/google-keynote.jpg', '/images/projects/google-keynote.jpg',
    'An asset manager''s annual keynote had become a numbers recital. The brief: make long-horizon investing feel like a conviction, not a compromise, to an audience of institutional skeptics.',
    'We built the campaign around a single device — the long line: a continuous rule that runs through every chart, slide and stage, literally drawing patience. Typography stayed cool; the color did the persuading.',
    'The keynote closed with the room''s first standing ovation in a decade; the "long line" device carried through annual-report season and is now the firm''s house graphic language.',
    'Financial audiences don''t want excitement — they want certainty beautifully organized. The long line gave them both.',
    'One continuous line — patience, drawn.',
    'The firm speaks in measured declarations: short sentences, long horizons.',
    '["Keynote design","Campaign system","Art direction"]'::jsonb,
    '[{"value":"1st","label":"Standing ovation","detail":"At the annual keynote in a decade"},{"value":"90+","label":"Keynote slides","detail":"Built on the long-line system"},{"value":"4","label":"Campaign artifacts","detail":"Keynote, report, site, event stage"}]'::jsonb,
    '[{"title":"Immersion","duration":"Wks 1–2","description":"Portfolio-manager interviews; teardown of a decade of prior keynotes.","outputs":["Narrative arc","Theme territories"]},{"title":"System","duration":"Wks 2–4","description":"The long-line device, slide architecture and data-viz rules.","outputs":["Slide system","Data-viz grammar"]},{"title":"Delivery","duration":"Wks 4–6","description":"Keynote build, speaker support and handoff to the annual-report team.","outputs":["Final keynote","Speaker deck"]}]'::jsonb,
    '[{"name":"Conviction Green","hex":"#0E5F4C","role":"Primary","rationale":"Not fintech blue; a green that reads as staying-power."},{"name":"Graphite","hex":"#2B2E33","role":"Foundation","rationale":"Institutional weight without a black hole."},{"name":"Signal Amber","hex":"#E8A13D","role":"Accent","rationale":"The long line''s ink — the one warm thing in a cool room."}]'::jsonb,
    '[{"role":"Display","family":"Financier","classification":"serif","sample":"Aa","rationale":"Numbers-adjacent serif; credible at 200pt."},{"role":"Text","family":"Atlas Grotesk","classification":"sans","sample":"Aa","rationale":"Cool, dense, built for dense data."}]'::jsonb,
    '["Measured declarations","Charts over adjectives","The line does the arguing"]'::jsonb,
    '[{"before":"Navigating volatility in uncertain markets.","after":"Boredom, compounded.","note":"Category boilerplate to a thesis."}]'::jsonb,
    '[{"kind":"Data","title":"Chart integrity under drama","constraint":"The long line threatened to distort data legibility.","resolution":"A strict rule: the line never touches data. It frames charts, never becomes one."}]'::jsonb,
    '[{"area":"Theme","decision":"The long line","rationale":"Patience needed a picture, and every chart already had one."},{"area":"Color","decision":"Green over blue","rationale":"Every competitor owns blue; conviction green is ownable."}]'::jsonb,
    '[{"src":"/images/projects/google-keynote.jpg","caption":"The long line on stage"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction"},{"name":"Firm events team","role":"Production"}]'::jsonb
  ),
  (
    'sustainable-mobility-education', 6,
    'Nordic Mobility — Campaign', 'Volvo', 'campaign', '2023',
    'An education campaign that made fleet electrification legible to the people who actually sign the contracts.',
    'Creative Director',
    '/images/projects/volvo-mobility.jpg', '/images/projects/volvo-mobility.jpg',
    'Fleet decision-makers hear EV pitches all day; most are spec sheets in green wrapping. The campaign needed to teach, not tell — and move buyers who answer to a board, not a blog.',
    'We built a modular education system: explainers, calculators and a workshop kit that sales teams could run without marketing support. Every asset answers one boardroom question, in boardroom language.',
    'Workshop adoption hit 60% of the target account list, and the education kit became the sales team''s most-requested asset of the year.',
    'The persuasion was in the teaching. When the sales team started sending our explainer instead of their deck, we knew the campaign had worked.',
    'Boardroom green, minus the green-washing.',
    'Nordic Mobility teaches like a good consultant: one question per page, no adjectives where a number will do.',
    '["Campaign design","Education system","Sales enablement"]'::jsonb,
    '[{"value":"60%","label":"Account adoption","detail":"Of the target list ran the workshop kit"},{"value":"#1","label":"Most-requested asset","detail":"By the sales team that year"},{"value":"12","label":"Boardroom questions","detail":"Each module answers exactly one"}]'::jsonb,
    '[{"title":"Research","duration":"Wks 1–3","description":"Interviews with fleet buyers and sales leads; mapped the twelve questions every deal asks.","outputs":["Question map","Content plan"]},{"title":"Build","duration":"Wks 3–8","description":"Explainer system, calculators and the workshop kit, tested with two pilot accounts.","outputs":["Education kit","Workshop deck"]},{"title":"Rollout","duration":"Wks 8–10","description":"Sales enablement, office hours and adoption tracking.","outputs":["Enablement pack","Playbook"]}]'::jsonb,
    '[{"name":"Fjord","hex":"#2E4A5A","role":"Primary","rationale":"Nordic water — credible before it says a word."},{"name":"Signal Green","hex":"#2F9E68","role":"Accent","rationale":"Electrification, stated once, clearly."},{"name":"Paper White","hex":"#F4F6F5","role":"Canvas","rationale":"A spec-sheet white that keeps numbers honest."}]'::jsonb,
    '[{"role":"Display","family":"Volvo Novum","classification":"sans","sample":"Aa","rationale":"The house voice; used larger than the brand usually dares."},{"role":"Detail","family":"Tabular numerals","classification":"mono","sample":"0123","rationale":"Every number in the kit aligns in columns."}]'::jsonb,
    '["One question per page","Numbers over adjectives","Teach, don''t tell"]'::jsonb,
    '[{"before":"Leading the charge in sustainable mobility.","after":"What electrification does to your TCO in year three.","note":"Slogan to a boardroom question."}]'::jsonb,
    '[{"kind":"Adoption","title":"Sales-team drift","constraint":"Sales teams rewrite everything; the system risked dying in a drawer.","resolution":"We co-built the kit with two pilot sales leads and gave them named credit in the final deck — adoption followed authorship."}]'::jsonb,
    '[{"area":"Format","decision":"Workshop over webinar","rationale":"Buyers answer to boards; rooms persuade rooms."},{"area":"Tone","decision":"Boardroom language","rationale":"The campaign speaks to the CFO''s questions, not the brochure''s."}]'::jsonb,
    '[{"src":"/images/projects/volvo-mobility.jpg","caption":"Workshop kit covers"}]'::jsonb,
    '[{"name":"Sarah Reese","role":"Creative direction"},{"name":"Volvo fleet marketing","role":"Content & data"}]'::jsonb
  )
) AS v(
  slug, ord, title, client, category, year, summary, role,
  cover_image, hero_image, challenge, approach, outcome, director_note,
  palette_story, voice_narrative, disciplines, metrics, process, palette,
  typography, voice_principles, copy_examples, hurdles, decisions, gallery, credits
)
ON CONFLICT (slug) DO NOTHING;
