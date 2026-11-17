import type { demos } from "./schema";

type NewDemo = typeof demos.$inferInsert;

const BASE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Demo</title><style>*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}img{display:block;max-width:100%}a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer;border:0}`;

const naturalHighs =
  BASE +
  `body{font-family:Georgia,"Times New Roman",serif;background:#E9E6DE;color:#1B1B1A;line-height:1.5}
header{display:flex;justify-content:space-between;align-items:center;padding:20px 5vw}
.logo{font-style:italic;font-size:20px}
nav{display:flex;gap:22px;font:13px/1 -apple-system,Helvetica,sans-serif;letter-spacing:.04em}
.cta{background:#E8743B;color:#fff;padding:12px 20px;border-radius:99px;font:600 13px/1 -apple-system,Helvetica,sans-serif}
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:4vw;align-items:center;padding:6vh 5vw 8vh}
.hero h1{font-size:clamp(38px,6vw,84px);line-height:.98;letter-spacing:-.03em;font-weight:400}
.hero h1 em{color:#E8743B}
.hero p{margin:22px 0 28px;font:17px/1.55 -apple-system,Helvetica,sans-serif;color:#4a4a47;max-width:44ch}
.hero img{border-radius:28px;aspect-ratio:1/1;object-fit:cover;width:100%}
.band{background:#1B1B1A;color:#E9E6DE;padding:8vh 5vw}
.band h2{font-weight:400;font-size:clamp(26px,3.4vw,44px);letter-spacing:-.02em;margin-bottom:28px;max-width:20ch}
.tabs{display:flex;gap:8px;margin-bottom:22px;flex-wrap:wrap}
.tabs button{padding:11px 18px;border-radius:99px;background:transparent;color:#E9E6DE;border:1px solid #ffffff33;font:13px -apple-system,Helvetica,sans-serif}
.tabs button.on{background:#E9E6DE;color:#1B1B1A}
.panel{font:18px/1.6 -apple-system,Helvetica,sans-serif;max-width:56ch;min-height:5.5em;color:#cfcac0}
.foot{padding:5vh 5vw;display:flex;justify-content:space-between;font:12px -apple-system,Helvetica,sans-serif;color:#6b6a65;flex-wrap:wrap;gap:8px}
@media(max-width:700px){.hero{grid-template-columns:1fr}nav{display:none}.hero img{order:-1;aspect-ratio:4/3}}
</style></head><body>
<header><span class="logo">Natural Highs</span><nav><a href="#s">Sessions</a><a href="#s">Stories</a><a href="#s">Team</a></nav><a class="cta" href="#s">Join a session</a></header>
<section class="hero"><div><h1>You don't have to do this <em>alone.</em></h1><p>A recovery community with real people, real clinicians and a very good fox. Come to a session. Listen first if you like.</p><a class="cta" href="#s" style="display:inline-block;padding:15px 26px;font-size:14px">Find a session</a></div><img alt="Hand-drawn fox illustration" src="/images/projects/natural-highs.jpg"></section>
<section class="band" id="s"><h2>What happens at your first session?</h2><div class="tabs" id="t"><button class="on" data-i="0">Arrive</button><button data-i="1">Listen</button><button data-i="2">Share (or don't)</button></div><p class="panel" id="p"></p></section>
<div class="foot"><span>Natural Highs Recovery Group</span><span>Concept demo, not a live service</span></div>
<script>var T=["Walk in, grab a tea. Nobody asks for your story at the door. Someone will say hello, and that's all.","Most people start by listening. You'll hear what recovery really looks like, with the hard days included.","Share when you're ready, or never. Our facilitators are trained to keep every voice safe."];var p=document.getElementById("p");function s(i){p.textContent=T[i];[].forEach.call(document.querySelectorAll("#t button"),function(b,j){b.className=j==i?"on":""})}[].forEach.call(document.querySelectorAll("#t button"),function(b){b.onclick=function(){s(+b.dataset.i)}});s(0);</script>
</body></html>`;

const serendipity =
  BASE +
  `body{font-family:-apple-system,Helvetica,Arial,sans-serif;background:#D1522B;color:#F4ECDD;overflow-x:hidden}
header{display:flex;justify-content:space-between;align-items:center;padding:18px 5vw;font:12px ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.08em}
.hero{padding:4vh 5vw 0;position:relative}
.big{font-family:Georgia,serif;font-size:clamp(70px,17vw,260px);line-height:.85;letter-spacing:-.05em;color:#F4ECDD;white-space:nowrap;margin-left:-.04em}
.by{font:12px ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.12em;margin:10px 0 28px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#E3C23A;color:#1F5A3E}
.grid img{width:100%;height:100%;object-fit:cover;min-height:320px}
.slips{padding:6vh 5vw;display:flex;flex-direction:column;gap:6px;justify-content:center}
.slip{font:600 clamp(26px,4vw,52px)/1.05 Georgia,serif;letter-spacing:-.02em;text-align:left;background:none;color:#1F5A3E;padding:6px 0;border-bottom:1px solid #1F5A3E33;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.slip:hover{transform:translateX(12px)}
.slip.on{color:#D1522B;font-style:italic}
.note{font:13px ui-monospace,Menlo,monospace;margin-top:18px;min-height:3em;color:#1F5A3E}
.sign{background:#1F5A3E;color:#F4ECDD;padding:8vh 5vw;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.sign h3{font:400 clamp(28px,4vw,52px)/1 Georgia,serif;letter-spacing:-.02em;max-width:16ch}
.sign a{background:#E3C23A;color:#1F5A3E;padding:15px 26px;border-radius:99px;font-weight:700;font-size:14px}
@media(max-width:700px){.grid{grid-template-columns:1fr}}
</style></head><body>
<header><span>a.e. Wells</span><span>New / No pressure</span></header>
<section class="hero"><div class="big">Serendipity</div><div class="by">by a.e. Wells / slow goods for unplanned days</div></section>
<section class="grid"><img alt="Campaign still" src="/images/projects/serendipity.jpg"><div class="slips"><button class="slip on" data-n="Permission granted. The couch is a valid destination.">be lazy</button><button class="slip" data-n="Put it in the notes app. Then put it in the bin.">anger mode</button><button class="slip" data-n="One thing. Just one. The rest will wait.">get it done</button><button class="slip" data-n="Music optional. Kitchen floor encouraged.">do a little dance</button><p class="note" id="n"></p></div></section>
<section class="sign"><h3>new things. no pressure.</h3><a href="#">Join the list</a></section>
<script>var n=document.getElementById("n"),b=document.querySelectorAll(".slip");function on(e){[].forEach.call(b,function(x){x.className="slip"});e.className="slip on";n.textContent=e.dataset.n}[].forEach.call(b,function(e){e.onclick=function(){on(e)}});on(b[0]);</script>
</body></html>`;

const restoreOt =
  BASE +
  `body{font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;background:#F3EEE6;color:#2F3E46;font-size:18px;line-height:1.55}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 5vw}
.logo{font-weight:700;letter-spacing:-.02em;font-size:20px}
nav{display:flex;gap:22px;font-size:15px}
.book{background:#C8745A;color:#fff;padding:14px 22px;border-radius:12px;font-weight:600;font-size:16px;min-height:48px;display:inline-flex;align-items:center}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:70vh}
.hero .t{padding:8vh 5vw;display:flex;flex-direction:column;justify-content:center;gap:20px}
.hero h1{font-size:clamp(36px,5vw,68px);line-height:1.02;letter-spacing:-.035em;font-weight:700}
.hero p{max-width:40ch;color:#51626b}
.hero img{width:100%;height:100%;object-fit:cover;min-height:340px}
.goals{background:#CFDCE0;padding:8vh 5vw}
.goals h2{font-size:clamp(26px,3.4vw,42px);letter-spacing:-.03em;margin-bottom:22px}
.chips{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px}
.chips button{padding:12px 20px;border-radius:99px;background:#F3EEE6;color:#2F3E46;font-size:16px;min-height:48px;border:2px solid transparent}
.chips button.on{border-color:#2F3E46;background:#fff}
.plan{background:#fff;border-radius:20px;padding:24px;max-width:560px;min-height:140px}
.plan b{display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#C8745A;margin-bottom:6px}
.foot{padding:5vh 5vw;font-size:14px;color:#6b7b83;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
@media(max-width:700px){.hero{grid-template-columns:1fr}nav{display:none}.hero img{order:-1;min-height:240px;max-height:300px}}
</style></head><body>
<header><span class="logo">Restore OT</span><nav><a href="#g">What we do</a><a href="#g">Who we help</a></nav><a class="book" href="#g">Book a visit</a></header>
<section class="hero"><div class="t"><h1>Get back to what you love.</h1><p>Occupational therapy helps you do the everyday things that matter, from cooking dinner to typing an email. Tell us your goal. We build the plan around it.</p><a class="book" style="align-self:flex-start" href="#g">Tell us your goal</a></div><img alt="A person at a desk with framed art behind" src="/images/projects/restore-ot.jpg"></section>
<section class="goals" id="g"><h2>What do you want to get back to?</h2><div class="chips" id="c"><button class="on" data-k="0">Cooking</button><button data-k="1">Typing</button><button data-k="2">Gardening</button><button data-k="3">Playing with grandkids</button></div><div class="plan" id="pl"></div></section>
<div class="foot"><span>Restore OT</span><span>Concept demo, not a live clinic</span></div>
<script>var D=[["Kitchen confidence","We practice real tasks in a real kitchen: grip, balance, safe cutting, and energy pacing."],["Comfortable computing","We adjust your setup, train hand strength and build routines to prevent strain."],["Back in the garden","Raised beds, adaptive tools and a pacing plan that fits a Saturday morning."],["Down on the floor, up again","Strength and transfers practiced as play, so the joy comes first."]];var pl=document.getElementById("pl");function s(k){pl.innerHTML="<b>"+D[k][0]+"</b>"+D[k][1];[].forEach.call(document.querySelectorAll("#c button"),function(b,j){b.className=j==k?"on":""})}[].forEach.call(document.querySelectorAll("#c button"),function(b){b.onclick=function(){s(+b.dataset.k)}});s(0);</script>
</body></html>`;

export const seedDemos: NewDemo[] = [
  {
    slug: "natural-highs",
    name: "Natural Highs",
    kicker: "Brand site · Recovery community",
    description:
      "A warm, serif-led landing page that introduces a recovery community through its first-session experience. Try the tabs to see how the tone shifts the experience for an anxious first-time visitor.",
    accent: "#E8743B",
    projectSlug: "natural-highs-brand-identity",
    html: naturalHighs,
    breakdown: [
      { label: "Goal", text: "Reduce first-visit anxiety by answering 'what happens when I walk in?' above every other question." },
      { label: "Layout", text: "One idea per screen, with generous space and a single orange call to action." },
      { label: "Tone", text: "Serif headlines read as written by a person. Interface text stays quiet and plain." },
      { label: "Compliance", text: "No outcome promises and no real member imagery. The illustrated fox carries the community." },
    ],
    sortOrder: 1,
  },
  {
    slug: "serendipity",
    name: "Serendipity",
    kicker: "Brand site · Lifestyle",
    description:
      "A loud, sun-baked brand page where the manifesto is the navigation. Tap a permission slip and the note changes. The page behaves like the brand: playful, decisive and a little lazy.",
    accent: "#D1522B",
    projectSlug: "serendipity-by-ae-wells",
    html: serendipity,
    breakdown: [
      { label: "Goal", text: "Make the manifesto the product and let people try on the voice before they buy anything." },
      { label: "Color", text: "Burnt sienna and mustard sun, with no cool neutrals. The palette is the logo." },
      { label: "Type", text: "Oversized, cropped serif for gloss. Monospaced notes for the human aside." },
      { label: "Social-first", text: "Composed so any section crops cleanly to a story or post." },
    ],
    sortOrder: 2,
  },
  {
    slug: "restore-ot",
    name: "Restore OT",
    kicker: "Web experience · Healthcare",
    description:
      "A calm, accessibility-first practice site that explains occupational therapy through goals instead of services. Choose an activity to see how a plan is framed around the person.",
    accent: "#C8745A",
    projectSlug: "restore-ot-brand-and-web",
    html: restoreOt,
    breakdown: [
      { label: "Goal", text: "Explain OT in seven seconds and make booking the obvious next step." },
      { label: "Accessibility", text: "18px base type, 48px touch targets and AA contrast, with no hover-only interactions." },
      { label: "Message", text: "Starts with the goal ('get back to what you love') and moves to services only after." },
      { label: "Compliance", text: "No efficacy claims. Credentials are stated exactly as licensed." },
    ],
    sortOrder: 3,
  },
];
