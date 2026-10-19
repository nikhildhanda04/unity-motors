---
name: Unity Motors
description: An auction-catalogue ledger for prepared cars — near-black grounds, one red, hard edges, no rounded corners.
colors:
  ink: "#0a0f12"
  panel: "#111111"
  panel-admin: "#0e1316"
  hairline: "#23292d"
  hairline-admin: "#1b2126"
  signal: "#E43E3D"
  signal-hover: "#c7322f"
  signal-deep: "#A32A29"
  signal-tint: "#ff8a89"
  text-primary: "#ffffff"
  text-secondary: "#d1d5db"
  text-muted: "#9ca3af"
  rule-numeral: "#6b767f"
  status-live: "#34d399"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(3.5rem, 13vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.25rem, 5vw, 2.1rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.05em"
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: "normal"
  meta:
    fontFamily: "Poppins, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "tnum 1"
  register-price:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.05em"
    fontFeature: "tnum 1"
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.18em"
  micro:
    fontFamily: "Poppins, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.2em"
  operate-title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  operate-spec:
    fontFamily: "Poppins, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
    fontFeature: "tnum 1"
rounded:
  none: "0px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "28px"
  xl: "48px"
  section: "96px"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-signal-hover:
    backgroundColor: "{colors.signal-hover}"
    textColor: "{colors.text-primary}"
  button-operate:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.text-primary}"
    typography: "{typography.operate-spec}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  button-ghost-operate:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.none}"
    padding: "6px 10px"
  input-field:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    width: "100%"
  panel-price:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    padding: "28px"
  register-entry:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    padding: "28px 0"
  register-entry-operate:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "60px"
---

# Design System: Unity Motors

## Overview

**Creative North Star: "The Auction-Catalogue Ledger"**

This is a workshop's register, not a showroom and not a classifieds grid. Stock is set down as numbered lines under a rule: year, a locked photo crop, the car named at display scale, the preparation claim, the specs, the asking price. The structure does the persuading, because the photographs cannot — they are phone snaps taken on the lot, in mixed light, against a cluttered yard. A uniform photo-card grid would put every one of those snaps on trial. A ledger puts them in order, and order reads as competence.

The world is near-black, hard-edged and typographically loud. Poppins at black weight, uppercase, pulled tight (`-0.045em`), is the only ornament; a single red carries every signal there is. Nothing curves. There are no rounded corners, no gradients behind text, no soft cards floating on a wash — depth comes from one heavy offset shadow under the few elements that genuinely sit on top of the page, and from hairline rules everywhere else.

The system deliberately runs in **two registers**, and mixing them is the failure case. **Persuade** is the public surface: display type, hairlines, the red, the register structure. **Operate** is `/admin`: 14px semibold titles, 11.5px spec lines, ~60px rows, no display type and no marketing voice. The owner manages stock from a phone in the workshop; there, scanning speed beats expression, and the brand survives only in the accent and the square corners.

**Key Characteristics:**
- Near-black grounds (`#0a0f12` page, `#111111` panel) and exactly one accent red
- Zero border-radius on every rebuilt surface; square focus rings, square scrollbar, square icon caps
- Hairline rules (1px `#23292d`) as the primary structural device, with a 2px red rule opening each register
- Display-scale black uppercase Poppins at `tracking-[-0.045em]`, against 11px uppercase labels at `0.18em` — no middle ground
- Tabular numerals on every price, km and year so columns never jitter
- One authored animation, one shadow, one accent: the system's expressiveness is budgeted

## Colors

A near-black, low-chroma ground carrying one saturated red, so that the red always means something: brand, action, state, or the preparation claim.

### Primary
- **Workshop Red** (`#E43E3D`): the one accent. Enquiry buttons, the 2px rule that opens each register, the preparation line ("Inspected & detailed in-house"), hover on the year numeral, the active-thumbnail bar, the video badge, the focus ring, text selection. On `#0a0f12` it measures 4.64:1 — adequate for the bold 11px+ label sizes it is used at, never for long-form body text.
- **Red Pressed** (`#c7322f`): the hover state of every filled red button, public and admin. It exists only as a hover; nothing rests at this value.
- **Red Deep** (`#A32A29`): the incumbent hero's solid caption block. Carried forward as a large-field panel colour only — never as text, never as a second accent.
- **Red Tint** (`#ff8a89`): inline error text and code strings sitting inside a 10%-red washed panel, where full-strength red would not clear the wash.

### Neutral
- **Register Black** (`#0a0f12`): the page ground on every public and admin surface, and the field colour of form inputs.
- **Panel Black** (`#111111`): the one raised surface — the price block, gallery frames, image wells, the footer.
- **Operate Panel** (`#0e1316`): admin form sections and row hover. A half-step up from the ground; the admin never gets the full panel contrast.
- **Hairline** (`#23292d`): every 1px rule and border on public surfaces, and the scrollbar thumb.
- **Operate Hairline** (`#1b2126`): the tighter admin row divider — the same device at a lower volume so 8 rows of it do not read as stripes.
- **Paper White** (`#ffffff`): titles, prices, spec values. The only colour for primary text.
- **Quiet Grey** (`#d1d5db` / Tailwind gray-300): equipment list items — the one secondary-text step above muted.
- **Register Grey** (`#9ca3af` / Tailwind gray-400): all supporting copy, labels, spec lines, counts, and sold-state text. **This is the floor.**
- **Rule Numeral** (`#6b767f`): the desktop year column at rest, which turns red on hover. Used for this one purpose; it is a large 3xl black-weight numeral, not body text.

### Functional
- **Live Green** (`#34d399` / Tailwind emerald-400): the admin status dot and "Live" label only. The single hue outside the red, scoped entirely to the Operate register, where "live vs sold" must be distinguishable at a glance without reading.

### Named Rules
**The One Red Rule.** There is exactly one accent hue in this system. A third hue (amber) was introduced during the build and removed in review. Red Pressed, Red Deep and Red Tint are states and fields of the same red, not siblings. The only non-red hue permitted anywhere is Live Green, and only on `/admin`.

**The Grey Floor Rule.** On `#0a0f12`, gray-700 (1.87:1), gray-600 (2.55:1) and gray-500 (3.99:1) all fail. **gray-400 (`#9ca3af`, 7.59:1) is the lowest permissible grey for text.** There is no grey between it and white in this system except gray-300.

**The No-Opacity-Recede Rule.** Never recede an element with `opacity` when its colour already sits at the grey floor — compositing drops it to roughly 2.5:1. Sold rows recede by switching white to gray-400 explicitly, and photos by desaturating. Opacity is permitted only on images, on disabled controls, and on a whole row mid-mutation.

**The Token Plumbing Rule.** Tailwind v4 here is CSS-first with no config file, and `@theme inline` *inlines* its values at each utility site — it never emits the custom properties, so hand-written CSS reading `var(--color-signal)` resolves empty and silently falls back to `currentColor`. A parallel plain `:root` block (`--ink`, `--panel`, `--hairline`, `--signal`) exists solely so the hand-written rules in `globals.css` can read the palette. Any new hand-written CSS uses the `:root` names; any new utility uses the `@theme` names. The legacy `--color-primary: #FF9500` is orange, unused and misleading — do not read from it, and delete it on sight.

## Typography

**Display / Body Font:** Poppins (with `sans-serif`) — one family carries the whole system, from the 7.5rem masthead to the 11.5px admin spec line.
**Secondary:** Inter and Andenver are loaded for incumbent surfaces; neither appears in the rebuilt register language.

**Character:** Geometric, heavy, and deliberately over-tightened. At black weight, uppercase, and `-0.045em`, Poppins stops reading as a web sans and starts reading as stencilled signage on a workshop wall. The contrast between that and a 11px `0.18em` label is the entire typographic idea: the system has a shout and a whisper and nothing in between.

### Hierarchy
- **Display** (900, `clamp(3.5rem, 13vw, 7.5rem)`, lh 0.8, `-0.045em`, uppercase): page mastheads — STOCK, "Cars For Sale", the login wordmark. Detail pages run a shorter ramp (`clamp(2.4rem, 7.5vw, 5rem)`, lh 0.85) because a car title is many words where "STOCK" is one.
- **Headline** (900, `1.25rem → 2.1rem`, lh 0.95, `-0.05em`, uppercase): the car title inside a register entry, and closing calls to action.
- **Title** (900, `1.25rem`, `-0.05em`, uppercase): subsection headings on the detail page ("About this car", "Walkaround").
- **Body** (500, 15px, lh 1.75): descriptive copy, capped at `68ch`, always gray-400.
- **Meta** (500, 13px, tabular where numeric): the spec line under a register entry, stock counts, the intro paragraph on narrow screens. One step below Body, always gray-400.
- **Register Price** (900, `1.25rem → 1.75rem`, `-0.05em`, tabular): the asking figure in a register entry. Below Headline so the car is named before it is priced.
- **Label** (700, 11px, `0.18em`, uppercase): spec labels, the preparation line, back-links, the asking caption. Column heads, the sold badge and the empty-photo marker step out to 10px / `0.2em`, which is the smallest size in the system — nothing goes below it.
- **Operate Title** (600, 14px, sentence case): the car title in an admin row. No display weight, no uppercase, no tracking.
- **Operate Spec** (400, 11.5px, tabular): the price-plus-specs line under an admin title.

### Named Rules
**The Two Registers Rule.** Persuade and Operate never mix. Display-scale black uppercase type is forbidden on `/admin` (the login masthead is the single boundary marker); 14px semibold sentence-case titles are forbidden on public surfaces. If a new screen cannot say which register it is in, it is not designed yet.

**The No-Eyebrow Rule.** No kicker, eyebrow or label line sits above a heading. The word carries its own weight; the masthead goes straight onto the page. Where a supporting line exists (the count, the preparation claim), it sits *beside* or *below* the heading, never above it.

**The Tabular Rule.** Every price, kilometre figure and year carries `.tnum` (`font-variant-numeric: tabular-nums`). These sit in columns across stacked rows and must not jitter between entries.

## Layout

A single centred column: `max-w-6xl` on public surfaces, `max-w-5xl` on admin, with `px-6 lg:px-10` gutters (`px-4` on admin, which is built for a phone held in the workshop).

The register is the primary spatial device. A listing row is a CSS grid, not a card: `[7rem_1fr]` on mobile, `[4.5rem_12rem_1fr_auto]` from `md` up — year, photo, car-and-preparation, asking. The mobile crop stays in a real left column and must never collapse into a floating thumbnail above stacked text; that is the card reading the register exists to refuse. The standalone year column is desktop-only, because on mobile the title already carries the year.

The detail page splits `1.55fr / 1fr` at `lg`, with the spec list, equipment and price block sticky at `top-8`. Below `lg` the price and enquiry action detach into a fixed bottom bar over a translucent ink backdrop, with a spacer so it never covers the footer's last line.

Vertical rhythm is coarse and consistent: 20–28px inside a register row, 40–48px between blocks, 80–112px between sections (`mt-20` → `mt-28`). Admin inverts this — ~60px rows, 10–12px internal padding, so roughly eight cars fit on a laptop screen.

### Named Rules
**The No-Uniform-Grid Rule.** Stock is never rendered as a grid of equal-sized cards. Entries are full-width lines separated by hairlines. Equipment lists and admin controls may use grids; stock may not.

## Elevation & Depth

Depth is carried by **tonal layering and hairlines**, not by shadow. Panels are a lighter black than the ground; everything else is separated by a 1px rule. There is exactly one shadow in the system, and it is deliberately heavy and vertical — a hard offset drop under the few elements that genuinely sit above the page.

### Shadow Vocabulary
- **Panel Drop** (`box-shadow: 0 30px 60px rgba(0,0,0,0.8)`): the gallery frame, the video player and poster, and the price block. Nothing else. This value is inherited from the incumbent hero's image panel, which is why it belongs to this world rather than reading as a generic card shadow.

### Named Rules
**The One Shadow Rule.** There is a single elevation step. An element either sits flat on the ground with a hairline, or it carries Panel Drop. No intermediate shadows, no hover lift, no coloured glow.

## Shapes

Every corner in the rebuilt system is square — `border-radius: 0`, with no exceptions, including the focus ring, the scrollbar thumb, badges, image wells, inputs, buttons, and the active-thumbnail marker (a solid 3px bar, never a ring). Icons follow the same geometry: a 24 grid, 1.75 stroke, `stroke-linecap: square` and `stroke-linejoin: miter`.

Borders are hairlines (1px `#23292d`, 1px `#1b2126` in admin) with one emphatic variant: a 2px red top rule that opens every register and underlines the detail page's title band. Photo crops are fixed-aspect wells (`4/3` for galleries, `w-28 h-20` / `w-48 h-32` for register crops) with `object-cover` — the frame is constant so an inconsistent photo set reads as one ordered list. Thumbnails are separated by a 1px gap over a hairline-coloured background, so the gap itself draws the rule.

### Named Rules
**The Square Corner Rule.** No rounded corners anywhere in the register language. The incumbent marketing sections carry pill-shaped CTAs (`rounded-full`); those are legacy surface, explicitly out of scope, and the radius does not propagate to any new work.

## Components

### Buttons
- **Shape:** square (`0`), no border.
- **Primary (Enquiry):** Workshop Red field, white black-weight 12–14px uppercase at `tracking-widest`, 16px × 32px padding, with a filled WhatsApp mark at 16–20px to its left. Hover goes to Red Pressed via `transition-colors`; there is no transform, no lift.
- **Operate Primary:** the same red field at 11px bold, 8px × 14px padding. Same colour, smaller voice.
- **Ghost (Operate):** gray-400 label on transparent, hovering to white on a `#1b2126` field. Destructive ghosts hover to red instead. Icon-only variants carry an `sr-only` label.
- **Text link:** white black-weight uppercase hovering to red, with an arrow icon that translates 6px right over 500ms.
- **Focus:** a 2px square Workshop Red outline at 2px offset on every interactive element. This rule must **not** be written with `:where()` — zero specificity loses to Tailwind's preflight and silently leaves Chrome's default blue ring in place.

### Cards / Containers
There are no cards. The two container forms are the **panel** (Panel Black field, 28px padding, Panel Drop, square) used for the price-and-enquiry block, and the **hairline section** (no field, opened by a 1px or 2px rule) used for everything else.

### Inputs / Fields
- **Style:** `#0a0f12` field on a `#23292d` 1px border, 12px × 16px padding, 15px white text, square. Labels sit above in 11px bold uppercase `0.18em` gray-400.
- **Focus:** border shifts to Workshop Red via `transition-colors`, on top of the global red outline.
- **Error:** a left-border-only red strip over a 10%-red wash, with Red Tint text at 13px, `role="alert"`.
- **Checkbox:** native, `accent-color: #E43E3D`, 16px.
- **Disabled:** `opacity: 0.4` with `cursor-not-allowed`.

### Navigation
The public navbar is an incumbent, untouched surface: a centred uppercase wordmark with no links, over a half-opacity logo. Wayfinding lives in the footer. The admin header is a sticky 56px bar on the page ground with a bottom hairline, carrying the wordmark, a red "Stock" label, a live/sold count, and three right-aligned controls.

### Register Entry (signature)
One line of stock, shared by the listing, the homepage strip and "also on the floor". A hairline above it and the grid columns are the entire structure — no container, no shadow, no radius. The photo sits at `grayscale-[0.55] contrast-[1.05]` at rest and resolves to full colour at `scale-[1.04]` over 900ms on hover; a red bar grows along the top rule across 700ms, the register selecting a line; the year numeral turns red. Sold entries desaturate to `grayscale brightness-[0.6]`, swap white text to gray-400, and replace the preparation line with "Sold". Entries animate in on `.entry-rise` with a staggered delay of `index × 70ms`, capped at six.

### Gallery (signature)
A `4/3` frame carrying Panel Drop, a 1px-gapped thumbnail strip beneath it (20% wide on mobile, 14.28% from `sm`), and a click-to-play video block. Inactive thumbnails sit greyscale at 55% opacity; the active one is full colour with a solid 3px red bar across its bottom edge. Video always ships `preload="none"` with a poster frame behind a play button — not one byte of video loads until the button is pressed.

### Icons
An authored set in `app/components/icons.tsx`: 24 grid, 1.75 stroke, square caps, miter joins, `currentColor`, `aria-hidden`. WhatsApp is the single filled brand mark, shipped exact rather than restyled. Unicode glyphs and emoji are never icons.

## Do's and Don'ts

### Do:
- **Do** state which register a new screen belongs to before designing it — Persuade (display type, red, hairlines, register structure) or Operate (14px semibold, 11.5px specs, ~60px rows).
- **Do** open every register and every title band with the 2px Workshop Red rule, and separate every row with a 1px hairline.
- **Do** keep body and supporting text at gray-400 (`#9ca3af`) or lighter on `#0a0f12`; recede elements with an explicit colour change, never with `opacity`.
- **Do** put `.tnum` on every price, kilometre figure and year.
- **Do** lock photo crops into fixed-aspect wells with `object-cover`, and desaturate at rest so a mismatched phone-photo set coheres.
- **Do** serve images `unoptimized` through Cloudinary's own transform (`w_800,c_limit,f_auto,q_auto` at the needed width) and ship video `preload="none"` with a poster.
- **Do** read palette values from the plain `:root` block (`--ink`, `--panel`, `--hairline`, `--signal`) in hand-written CSS, and from the `@theme` names in utilities.
- **Do** theme the surfaces you did not draw: selection, scrollbar, tap highlight and focus ring all come from the palette.
- **Do** animate arrivals with `.entry-rise` only — 0.62s `cubic-bezier(0.16, 1, 0.3, 1)`, from an already-visible default, disabled under `prefers-reduced-motion`.

### Don't:
- **Don't** use a border-radius anywhere in the register language — not on buttons, inputs, badges, image wells, focus rings or active markers.
- **Don't** render stock as a uniform grid of equal-sized photo cards; entries are full-width lines.
- **Don't** put a kicker or eyebrow above a heading.
- **Don't** introduce a third hue. Red Pressed, Red Deep and Red Tint are states of the one red; Live Green is scoped to the admin status indicator and appears nowhere public.
- **Don't** use gray-500, gray-600 or gray-700 for text on `#0a0f12` — all three fail contrast.
- **Don't** write the focus-ring selector with `:where()`; zero specificity loses to preflight and Chrome's blue ring returns.
- **Don't** read or extend `--color-primary: #FF9500`; it is orange, unused and misleading.
- **Don't** use Unicode glyphs or emoji as icons, or import an icon package — extend the authored set at 24/1.75/square/miter.
- **Don't** add a second shadow, a hover lift, or a coloured glow; Panel Drop is the only elevation step.
- **Don't** let marketing voice, display type or persuasion copy into `/admin`.
