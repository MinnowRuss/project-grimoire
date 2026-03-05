# PRD: RSS Reader / Magazine Webapp

**Status:** Draft
**Date:** 2026-03-05
**Type:** Portfolio Project
**Platform:** Mobile-first web (React + Node.js)

---

## Problem Statement

Most RSS readers are designed for power users and feel utilitarian on mobile. Casual news consumers who want a clean, beautiful reading experience have few good options that feel native to their phone. This project demonstrates a mobile-first, magazine-quality RSS reader — built as a portfolio piece that showcases modern frontend development, offline-capable web apps, and thoughtful UX design.

---

## Goals

1. **Deliver a polished mobile reading experience** — the app feels as good on a phone as a native news app, with smooth navigation and responsive card layouts.
2. **Reduce time-to-first-article** — a new user can add a feed and read an article in under 60 seconds.
3. **Work reliably offline** — previously loaded articles remain readable without an internet connection.
4. **Showcase frontend craft** — the codebase demonstrates clean component architecture, accessibility, and performance as a portfolio artifact.
5. **Keep complexity appropriate to scope** — single-user, no auth, no database; simplicity is a feature.

---

## Non-Goals

- **User accounts / authentication** — this is a single-user local app. Multi-user support would require a backend database and auth system; that's a separate project.
- **Social features** — no sharing, liking, commenting, or activity feeds. The focus is reading, not social.
- **Search across article content** — full-text search requires indexing infrastructure beyond this scope. Feed-level search (finding new feeds to subscribe to) is also out of scope for MVP.
- **Push notifications** — browser push for new articles adds complexity without meaningful value for a local, casual-use app.
- **Category/folder organization** — users can subscribe to feeds and read them, but hierarchical organization is deferred to a future iteration.

---

## User Stories

### Feed Management

- As a reader, I want to add an RSS feed by pasting a URL so that I can subscribe to any publication I find.
- As a reader, I want to see all my subscribed feeds in a list so that I can manage what I'm following.
- As a reader, I want to remove a feed I no longer want so that my reader stays relevant to me.

### Browsing & Reading

- As a reader, I want to see my latest articles in a card grid so that I can quickly scan headlines and images.
- As a reader, I want to tap an article card and read it in a clean, distraction-free view so that I can focus on the content.
- As a reader, I want to tap a link to open the original article in a new tab so that I can get the full source experience when I want it.

### Offline Reading

- As a reader, I want previously loaded articles to be available when I'm offline so that I can read during commutes or flights.
- As a reader, I want to know when I'm viewing cached content so that I understand the article may not be the most current version.

### General UX

- As a reader, I want the app to feel fast and responsive on my phone so that reading feels effortless.
- As a reader, I want the card grid to adapt from one column (phone) to two or three columns (tablet/desktop) so that the layout always feels right for my screen.

---

## Requirements

### P0 — Must Have (MVP)

| Requirement | Acceptance Criteria |
|---|---|
| Add feed by URL | User pastes a valid RSS/Atom URL; app fetches, parses, and persists the feed locally |
| Display article feed | Card grid shows headline, source name, publication date, and thumbnail (if available) for each article |
| Article reader view | Tapping a card opens a full-page reading view with clean typography and no chrome clutter |
| Remove a feed | User can delete a subscription; its articles are removed from the feed |
| Offline support | Articles loaded while online are accessible via Service Worker cache when offline |
| Offline indicator | App displays a visible "offline / cached" badge when serving from cache |
| Mobile-first layout | All views are fully usable at 375px width; no horizontal scroll, no overlapping elements |
| Responsive grid | Card grid uses 1 column ≤ 600px, 2 columns 601–1024px, 3 columns > 1024px |
| Feed persistence | Subscribed feeds and cached articles survive a page refresh (localStorage or IndexedDB) |

### P1 — Nice to Have

| Requirement | Notes |
|---|---|
| Pull-to-refresh gesture | Trigger a feed refresh on mobile by pulling down on the article list |
| Skeleton loading states | Show placeholder cards while feeds load, rather than a spinner |
| Mark as read | Track read/unread state per article; dim or badge-count read items |
| Dark mode | Respect `prefers-color-scheme` and offer a manual toggle |
| Reading progress indicator | Progress bar in the reader view showing scroll position in the article |
| Feed favicon display | Show the publication's favicon next to its name in cards and the feed list |

### P2 — Future Considerations

| Requirement | Notes |
|---|---|
| Feed categories / folders | Group feeds by topic (Tech, Sports, etc.) for organized browsing |
| Article search | Search across saved article titles |
| OPML import/export | Import subscriptions from other RSS readers |
| Multi-user / sync | Cloud backend with accounts and cross-device sync |

---

## Technical Notes

### Architecture

- **Frontend:** React (Vite), Tailwind CSS for styling
- **Backend:** Lightweight Node.js/Express server used exclusively as an RSS proxy (browser CORS restrictions prevent direct RSS fetching)
- **Persistence:** `localStorage` for feed list and metadata; `IndexedDB` (via `idb`) for article content
- **Offline:** Service Worker (Workbox recommended) for caching the app shell and fetched article content
- **RSS Parsing:** `rss-parser` library on the Node proxy

### Data Flow

```
Browser → Node Proxy → RSS Feed URL → Parsed JSON → React State → IndexedDB
                                                                      ↓
                                                               Service Worker Cache
```

### Key Technical Constraints

- The Node proxy is required to avoid CORS errors when fetching RSS feeds directly from the browser.
- Article body content varies significantly by feed — some provide full HTML, others only a summary. The reader view should handle both gracefully.
- Service Worker caching strategy: **Network first, falling back to cache** for articles; **Cache first** for the app shell.

---

## Success Metrics

Since this is a portfolio project, success is measured against two audiences: **users of the app** and **employers/reviewers evaluating the code**.

### Product Quality

| Metric | Target |
|---|---|
| Time to add first feed and read an article | < 60 seconds for a new user |
| Lighthouse mobile performance score | ≥ 85 |
| Lighthouse accessibility score | ≥ 90 |
| Offline articles available after disconnecting | 100% of previously loaded articles |

### Portfolio Quality

| Metric | Target |
|---|---|
| GitHub README completeness | Includes setup instructions, architecture diagram, and screenshots |
| Code review readiness | Components are < 200 lines, props are typed, no commented-out dead code |
| Responsive coverage | Tested and screenshot-documented at 375px, 768px, and 1280px |

---

## Open Questions

| Question | Owner | Priority |
|---|---|---|
| Should the Node proxy cache RSS responses to reduce external requests, and for how long? | Engineering | High |
| Should article images be proxied through the Node server too (to avoid mixed content issues)? | Engineering | Medium |

### Decisions Made

| Question | Decision | Date |
|---|---|---|
| How should the app handle feeds that return only article summaries? | Display the truncated summary in the reader view. Visually distinguish it with a callout/banner making clear the content is a summary, with a prominent CTA that opens the full article in an external tab. | 2026-03-05 |
| What's the error experience for invalid feed URLs? | Highlight the input field in red on validation failure. Display inline callout text beneath the field with a plain-language explanation and a concrete example of a valid RSS URL. No modal dialogs. | 2026-03-05 |

---

## Timeline Considerations

This is a self-paced portfolio project with no hard external deadlines. A suggested phasing:

| Phase | Scope | Suggested Duration |
|---|---|---|
| **Phase 1 — Core** | Feed management, card grid, reader view, persistence | 2–3 weeks |
| **Phase 2 — Offline** | Service Worker, offline indicator, cache management | 1 week |
| **Phase 3 — Polish** | Dark mode, skeleton states, mark as read, Lighthouse tuning | 1–2 weeks |
| **Phase 4 — Portfolio prep** | README, screenshots, deployed demo, code cleanup | 1 week |

---

*This document is a living spec. Update open questions as decisions are made.*
