# Design Brief: RSS Reader — Card Grid & Reader View

**Project:** RSS Reader / Magazine Webapp
**Component Scope:** Card Grid (Browse View) + Article Reader View
**Visual Direction:** Dark Academia · Gothic · Death Metal
**Date:** 2026-03-05

---

## Aesthetic Direction

### Mood & Tone

This app lives at the intersection of three aesthetics that share a common soul — an obsession with text, darkness, and the weight of ideas.

- **Dark Academia** brings candlelit libraries, aged paper, and the reverence of the written word. Serif typefaces, ink-stained palettes, and the feeling that knowledge is sacred.
- **Gothic** brings architecture — pointed arches, ornamental borders, deep shadows, and the theatrical contrast of black and bone-white. Grandeur in the margins.
- **Death Metal** brings aggression in the details — condensed blackletter-adjacent display type, extreme contrast, distressed textures, and a refusal to be soft. Not chaotic, but intentional and heavy.

The result is an app that feels like reading a grimoire — dense with content, beautiful in its darkness, and completely unlike anything in the current news reader landscape.

---

## Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | Void | `#0A0A0C` | App background, card backgrounds |
| Surface | Crypt Stone | `#141418` | Card hover state, nav bar, input fields |
| Surface Raised | Ash | `#1E1E24` | Modal backgrounds, reader view bg |
| Border | Iron | `#2E2E38` | Card borders, dividers, input borders |
| Border Error | Blood | `#8B1A1A` | Invalid input field highlight |
| Primary Text | Parchment | `#E8E0D0` | Body text, article content |
| Secondary Text | Faded Ink | `#9A9080` | Timestamps, source names, metadata |
| Accent | Tarnished Gold | `#C8A84B` | Highlights, links, CTA buttons, hover states |
| Accent Dark | Antique Brass | `#8B6914` | Pressed/active states for gold elements |
| Danger | Deep Crimson | `#6B1111` | Error backgrounds, destructive actions |
| Danger Text | Pale Blood | `#D4534A` | Error messages, warning text |
| Summary Callout Bg | Charcoal Veil | `#1A1A22` | Summary-only article callout background |
| Summary Callout Border | Dusty Violet | `#4A3A5C` | Left border on summary callout |
| Offline Badge | Rusted Iron | `#4A3020` | Offline/cached indicator background |

---

## Typography

### Typeface Stack

| Role | Typeface | Fallback | Weight | Notes |
|---|---|---|---|---|
| Display / Headlines | **Cinzel** (Google Fonts) | `Georgia, serif` | 600–700 | Roman inscriptions meet gothic grandeur. Used for article headlines and section titles. |
| Body / Article text | **EB Garamond** (Google Fonts) | `Georgia, serif` | 400, 500 | Old-style serifs with genuine academic warmth. Primary reading typeface. |
| UI / Labels / Meta | **Raleway** (Google Fonts) | `system-ui, sans-serif` | 300, 400 | Keeps UI chrome legible and slightly modern against the heavy serifs. |
| Accent / Callouts | **Cinzel Decorative** (Google Fonts) | `Georgia, serif` | 400 | Sparingly — drop caps, major section breaks, ornamental headers only. |

### Type Scale

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `--text-xs` | 11px | 1.4 | Timestamps, badges, secondary meta |
| `--text-sm` | 13px | 1.5 | Source names, card metadata |
| `--text-base` | 16px | 1.7 | Article body text |
| `--text-lg` | 20px | 1.4 | Card headlines (mobile) |
| `--text-xl` | 26px | 1.3 | Card headlines (tablet+), reader subtitle |
| `--text-2xl` | 34px | 1.2 | Article reader headline |
| `--text-3xl` | 44px | 1.1 | Hero article headline |

---

## Card Grid — Browse View

### Layout

The card grid is the magazine's table of contents. Every card should feel like a cover of its own publication — heavy, considered, and complete.

- **Mobile (≤ 600px):** Single column, full-width cards. Stacked vertically with 12px gap.
- **Tablet (601–1024px):** Two-column grid, 16px gap.
- **Desktop (> 1024px):** Three-column grid, 20px gap.

### Card Anatomy

```
┌─────────────────────────────────────────┐
│  [Thumbnail Image — 16:9, full width]   │
│  Fades to black at bottom edge          │
├─────────────────────────────────────────┤
│  SOURCE NAME · TIMESTAMP                │  ← Raleway, --text-xs, Faded Ink
│                                         │
│  Article Headline That Can Run          │  ← Cinzel, --text-lg/xl, Parchment
│  Across Two Lines Comfortably           │
│                                         │
│  Brief excerpt or summary snippet...    │  ← EB Garamond, --text-sm, Faded Ink
│                                         │
│  [● UNREAD]                             │  ← Small dot + label, Tarnished Gold
└─────────────────────────────────────────┘
```

### Card Styling Details

- **Background:** Crypt Stone `#141418`
- **Border:** 1px solid Iron `#2E2E38`; on hover, border transitions to Tarnished Gold `#C8A84B` (200ms ease)
- **Border radius:** 2px — barely rounded. Gothic architecture has hard angles.
- **Thumbnail:** 16:9 ratio, `object-fit: cover`. If no thumbnail exists, fill with a procedurally-chosen dark texture from a set of 5 SVG noise patterns (varied per feed domain hash). No broken image icons.
- **Thumbnail overlay:** Linear gradient from transparent to `#0A0A0C` covering the bottom 40% of the image. This bleeds the image into the card content area.
- **Hover state:** Subtle `box-shadow: 0 4px 24px rgba(200, 168, 75, 0.12)` — a faint golden glow from below.
- **Read state:** Headline drops to 60% opacity (`Faded Ink` tone). Unread dot hidden.
- **Active/tap state:** Scale `0.98`, transition 100ms — a physical, weighted press feel.

### Card Ornamental Details

- A thin horizontal rule (`<hr>`) between the thumbnail and the text area — 1px, Iron color, full width.
- The source name uses letter-spacing `0.12em` in Raleway uppercase — creating a stamp-like, editorial feel.
- Optional: a small Gothic ornament glyph (e.g., `❧` or `✦`) between source name and timestamp.

---

## Article Reader View

### Layout

The reader is a single-column scroll. No sidebars. No distraction. The article fills the viewport width on mobile and constrains to a `680px` max-width centered column on larger screens.

```
┌──────────────────────────────────────────────┐
│  ← Back         [Source Name]    [Open ↗]    │  ← Nav bar, Crypt Stone bg
├──────────────────────────────────────────────┤
│                                              │
│  [Hero Image — full bleed, max 480px tall]   │
│                                              │
│  SOURCE NAME · DATE · EST. READ TIME         │  ← Raleway, Faded Ink
│                                              │
│  Article Headline in Cinzel                  │
│  Across Multiple Lines                       │  ← Cinzel 700, --text-2xl/3xl
│                                              │
│  ──────────────────────────────────────────  │  ← Ornamental divider
│                                              │
│  Article body in EB Garamond...              │  ← --text-base, Parchment, 1.7 lh
│                                              │
│  [SUMMARY CALLOUT — if applicable]           │
│                                              │
│  More body text...                           │
│                                              │
└──────────────────────────────────────────────┘
```

### Reader Typography Details

- **Body paragraphs:** EB Garamond 16px, 1.7 line-height, Parchment. Paragraph spacing `1.5em`. First paragraph may optionally use a drop cap (Cinzel Decorative, 3-line drop).
- **Subheadings (`h2`, `h3`):** Cinzel 600, with a thin 1px gold underline (`border-bottom: 1px solid #C8A84B`).
- **Blockquotes:** Left border 3px Tarnished Gold, background Ash `#1E1E24`, padding 16px. Italic EB Garamond.
- **Links:** Tarnished Gold, underline on hover. No default blue.
- **Reading progress bar:** 2px fixed at top of viewport. Starts Iron color, fills Tarnished Gold as user scrolls.

### Ornamental Divider

Between metadata and body text, use a centered SVG or Unicode ornament instead of a plain `<hr>`. Suggested: `⸻ ✦ ⸻` or a custom SVG filigree. Color: Iron fading to transparent on both ends.

---

## Summary-Only Callout

When a feed provides only a truncated summary (no full article body), display this block prominently within the reader view, replacing or wrapping the content area.

```
┌────────────────────────────────────────────────┐
│ ▌                                              │
│ ▌  EXCERPT ONLY                                │  ← Raleway uppercase, Dusty Violet
│ ▌                                              │
│ ▌  This article shows only a summary from      │
│ ▌  the original publisher's feed. The full     │
│ ▌  content is available at the source.         │
│ ▌                                              │
│ ▌  [  READ FULL ARTICLE  ↗  ]                  │  ← Gold button, opens external tab
│ ▌                                              │
└────────────────────────────────────────────────┘
```

**Styling:**
- Background: Charcoal Veil `#1A1A22`
- Left border: 3px solid Dusty Violet `#4A3A5C`
- Label: Raleway, `--text-xs`, letter-spacing `0.15em`, uppercase, Dusty Violet
- Body copy: EB Garamond, Faded Ink
- CTA button: Full width on mobile; Tarnished Gold background, Void text, Cinzel 600, letter-spacing `0.08em`

---

## Error States — Feed URL Input

When the user submits an invalid URL (not a URL, or a valid URL that isn't an RSS/Atom feed), the input field transitions immediately:

```
┌─────────────────────────────────────────────────┐
│  [  https://not-a-feed.com/page         ✕  ]    │
│  ↑ Border becomes Blood red #8B1A1A             │
│  ↑ Background tints to Deep Crimson #6B1111      │
└─────────────────────────────────────────────────┘

  ⚠ That doesn't look like an RSS feed.
    Try a feed URL like:
    https://example.com/feed.xml
    or  https://feeds.example.com/rss
```

**Input field error styling:**
- Border: 2px solid Blood `#8B1A1A` (replaces Iron border)
- Background: subtle tint, `rgba(107, 17, 17, 0.15)`
- Icon: A small `✕` or `⚠` icon at the right edge of the input, Pale Blood color
- Transition: 150ms ease, no jarring flash

**Callout text:**
- Position: directly below the input, no margin gap
- Icon: `⚠` in Pale Blood `#D4534A`
- First line: Short, direct error statement in Raleway, --text-sm, Pale Blood
- Second/third line: Plain-language guidance + concrete URL example in EB Garamond, --text-sm, Faded Ink
- The example URL should be a real-looking (but clearly example) feed address

**Recovery:** As soon as the user begins editing the input again, the red state clears — the field returns to its default Iron border immediately (don't wait for resubmission).

---

## Offline / Cached Indicator

When articles are served from the Service Worker cache, display a persistent but unobtrusive badge:

```
[  ☁ OFFLINE — SHOWING CACHED CONTENT  ]
```

- Position: Fixed, top of viewport, full width
- Background: Rusted Iron `#4A3020`
- Text: Raleway uppercase, `--text-xs`, Parchment, letter-spacing `0.12em`
- Height: 28px
- Dismiss: Not dismissable — remains until connectivity is restored, then fades out (300ms)

---

## Interaction & Motion Principles

- **No gratuitous animation.** Every motion serves a functional purpose.
- **Card hover:** Border color transition 200ms, box-shadow 200ms. No transforms.
- **Card tap:** `scale(0.98)` 100ms — tactile, weighted.
- **Page transitions:** Fade in 150ms on mount only. No slide animations.
- **Reader scroll progress:** RAF-throttled, no jank.
- **Error state:** 150ms ease on border/background color. No shake/bounce animations — those feel playful; this aesthetic is grave.
- **Summary callout:** Renders in-place with the rest of content. No special entrance animation.

---

## Accessibility Considerations

- All gold-on-dark text combinations must meet WCAG AA (4.5:1 for normal text). Tarnished Gold `#C8A84B` on Void `#0A0A0C` = ~7.2:1 ✓
- Parchment `#E8E0D0` on Void `#0A0A0C` = ~14.5:1 ✓
- Error state: never rely on color alone — always pair with an icon and text
- Reader view font size should be user-scalable (no `user-scalable=no` in viewport meta)
- All interactive elements must have visible focus rings (gold outline, 2px offset)

---

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --color-bg:             #0A0A0C;
  --color-surface:        #141418;
  --color-surface-raised: #1E1E24;
  --color-border:         #2E2E38;
  --color-border-error:   #8B1A1A;
  --color-text-primary:   #E8E0D0;
  --color-text-secondary: #9A9080;
  --color-accent:         #C8A84B;
  --color-accent-dark:    #8B6914;
  --color-danger-bg:      #6B1111;
  --color-danger-text:    #D4534A;
  --color-callout-bg:     #1A1A22;
  --color-callout-border: #4A3A5C;
  --color-offline-bg:     #4A3020;

  /* Typography */
  --font-display:  'Cinzel', Georgia, serif;
  --font-body:     'EB Garamond', Georgia, serif;
  --font-ui:       'Raleway', system-ui, sans-serif;
  --font-ornament: 'Cinzel Decorative', Georgia, serif;

  /* Spacing */
  --card-gap-mobile:  12px;
  --card-gap-tablet:  16px;
  --card-gap-desktop: 20px;
  --reader-max-width: 680px;

  /* Borders */
  --border-radius: 2px;
  --border-width:  1px;
}
```

---

*This brief should be treated as a living document. As components are built, document deviations and rationale.*
