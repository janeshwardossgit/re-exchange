
PROMPT WARS — PROJECT REPORT
RE:EXCHANGE
A Campus-Only Student Exchange Marketplace

Submitted by
Janeshwardoss R
SRM Institute of Science and Technology, KTR
Solo Entry
Live Demo
https://re-exchange-git-main-janesh1.vercel.app/
 
1. Why I Chose This Topic
Every academic year, the same pattern repeats across hostels and departments: a student buys a scientific calculator, a lab coat, or a semester's worth of textbooks, uses them for a few months, and then lets them sit unused once the course ends. Meanwhile, a junior in the very next room is searching WhatsApp groups and asking around for the exact same item. This isn't a shortage of resources — it's a failure of discovery. The things students need already exist on campus; there is simply no reliable way to find who has them.
I chose this problem because it is small enough to solve convincingly within a competition timeframe, yet real enough that I have personally lived it — chasing down a used drafting kit, hunting for a graphing calculator before an exam, or watching perfectly good items get thrown away at the end of a semester. A campus is a uniquely good setting for a peer-to-peer exchange system: it is a closed, trust-friendly community with recurring, predictable needs, which makes it an ideal testbed for a marketplace that prioritizes trust and relevance over scale.
2. What I Am Building
RE:EXCHANGE is a campus-only marketplace where students list items and services they want to sell, lend, swap, or give away, and where other students on the same campus can discover, filter, and request them. It is built as a modern web application using Next.js (App Router) and TypeScript for a fast, type-safe front end, and Tailwind CSS for a clean, editorial visual identity built around a warm paper-and-forest color palette rather than a generic tech-startup look.
The application currently includes a full, working product surface:
 
Figure 1 — The RE:EXCHANGE homepage: search, category/hostel/price/exchange-type filters, exchange-impact stats, and featured listings.
•	Discovery: A homepage with keyword search, category filters, hostel filters, price filters, and exchange-type filters (sell / lend / swap / give), alongside featured, recommended, and recently-added listings.
•	Intelligent matching: A dedicated Campus Match page that accepts a plain-English request (e.g. “I need a drafting kit for two weeks, don't mind paying a small deposit”), parses intent, keywords, and category from that sentence, and returns scored matching listings and matching people — entirely with local logic, with no external AI API required.
•	Listings: Full listing detail pages, a listing-creation flow, saved/favorited items, and a personal dashboard.
•	Messaging: A ping-to-chat system: a single button on a match or listing starts a real conversation thread, with accept / mark completed / decline states and campus-appropriate messaging.
•	Trust & identity: Public profile pages showing a student's course, hostel, year, rating, review count, and completed-exchange history — building a visible trust record over time.
 
Figure 2 — The listing-creation flow: a calm, four-step wizard (Type → Details → Photos → Review) for sell, trade, give away, lend, or skill/service listings.
The entire product currently runs on local, demo-quality data and state, which is intentional: it lets every feature — search, matching, messaging, ratings — be demonstrated live and reliably in front of judges, with no dependency on a live backend, a database, or network access.
3. Why I Am Building It
I am building RE:EXCHANGE because the underlying problem — wasted, underused student resources sitting idle while other students actively need them — is both economically wasteful and environmentally unnecessary, and because the existing tools students actually use to solve it (chat groups, noticeboards, general resale apps) are a poor fit for how a campus actually works.
Beyond the practical motivation, I wanted to build something where the “smart” part of the product wasn't a thin wrapper around a chatbot, but a genuine piece of engineering: a matching system that reads unstructured, natural-language intent and turns it into ranked, explainable matches against both listings and people. Building that logic myself, without relying on an external AI service, was a deliberate choice — it keeps the demo fast, offline-safe, and fully within my control, which matters enormously in a live competition setting where network issues or API downtime could otherwise sink a demo.
4. What Purpose It Serves
Purpose	How RE:EXCHANGE Addresses It
Reduce waste	Encourages reuse (swap/lend/give) instead of items being discarded at semester end.
Save money	Students access items they need for a fraction of retail cost, or free via lending/swapping.
Build trust locally	Ratings and reviews are tied to real, verifiable campus identity, not anonymous strangers.
Reduce friction	Replaces scattered WhatsApp/Facebook groups with structured search, filters, and matching.
Strengthen community	Every exchange is a small peer interaction between students who already share a campus.

 
Figure 3 — The personal dashboard, tracking items reused, money saved, successful exchanges, and giveaways — the purpose of the app made visible and personal.
In short, RE:EXCHANGE serves both a practical purpose (helping a student find a lab coat by tomorrow morning) and a broader one (nudging campus culture toward reuse and mutual aid instead of default new-purchases and disposal).
5. In What Way It Is Unique
Generic marketplace apps and campus chat groups already exist, so RE:EXCHANGE's value has to come from being meaningfully different, not just campus-branded. Three things set it apart:
5.1 Campus Match: matching people, not just listings
Most marketplace search is a keyword filter over a database of items. Campus Match instead treats a request as an intent to be understood: it parses free-text input for category signals, urgency, exchange-type preference, and constraints, then scores it against both existing listings and other students who could plausibly fulfil that need — even if no listing yet exists for it. This reframes the product from “browse what's posted” to “describe what you need,” which is a fundamentally more natural way to ask for something.
 
Figure 4 — Campus Match in action: the plain-English request “I need a scientific calculator for two days” returns ranked matches (Match score 30, 15, 10) across listings and skills.
5.2 Identity-anchored trust, not anonymous ratings
A five-star rating from an anonymous stranger on a resale app carries little weight. On RE:EXCHANGE, every rating, review, and completed-exchange count is attached to a real profile with a course, hostel, and year — the same social fabric a student already lives inside. This design choice makes trust legible in a way city-wide marketplaces structurally cannot replicate.
 
Figure 5 — A real negotiation thread born from a single Ping: pickup time, price, and hostel logistics agreed in-app, with Accept / Mark completed / Decline controls.
5.3 Built for exchange, not just resale
Sell / lend / swap / give is treated as a first-class filter across the entire app, not a bolted-on option. This matches how students actually behave with underused items — lending a calculator for exam week, swapping textbooks each semester, or giving away furniture at move-out — behaviours that pure buy/sell platforms don't model well.
6. What It Offers Beyond Existing Alternatives
Capability	Facebook / WhatsApp groups	OLX / Craigslist-style apps	RE:EXCHANGE
Audience scope	Open, unmoderated	City-wide strangers	Campus-only, verified peers
Trust signal	None beyond a name	Star ratings, anonymous	Ratings tied to real campus identity
Discovery method	Manual scrolling & posting	Keyword search only	Filters + free-text intent matching
Matches people, not just items	No	No	Yes — Campus Match scores people & listings together
Needs external AI / paid API	N/A	N/A	No — fully local, demo-safe logic
Built for non-monetary exchange	No	No	Yes — swap, lend, or trade by design

The comparison above reflects the core gap RE:EXCHANGE is designed to close: existing tools are either too open and untrusted (chat groups) or too generic and transactional (resale apps) for a setting as tight-knit and recurring as a campus. RE:EXCHANGE is purpose-built for that middle ground.
“The goal was never to build another marketplace clone — it was to build the marketplace a campus would actually use, with matching intelligence and trust built in from the start, not bolted on afterward.”
7. Closing Note
RE:EXCHANGE is a solo build, developed end-to-end with Next.js, TypeScript, and Tailwind CSS, running on local demo data so every feature — search, filtering, Campus Match, messaging, and profiles — can be demonstrated live and reliably. It represents a focused attempt to solve a real, everyday campus problem with a product that is distinct in its matching intelligence, its identity-anchored trust model, and its treatment of exchange as equal to resale.
Live demo: https://re-exchange-git-main-janesh1.vercel.app/
