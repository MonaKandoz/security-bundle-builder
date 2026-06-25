# Security System Bundle Builder

A multi-step product bundle builder with a live, synced review panel — built as a frontend take-home prototype.

React + TypeScript + Redux Toolkit + Sass + GSAP, on Vite.

---

## Run it

Requires Node 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

LIVE LINK (`https://monakandoz.github.io/security-bundle-builder/`)

Other scripts:

```bash
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

The app builds and runs from a clean clone with no environment variables or backend required — all data is a local JSON file (`src/data/products.json`).

---

## What's implemented

- **4-step accordion builder** (Cameras → Plan → Sensors → Accessories), step 1 open on load, single step open at a time, animated expand/collapse (GSAP), "N selected" live counter per step.
- **Product cards** rendered entirely from data — badge, image, title, description, Learn More link, variant chips, quantity stepper, compare-at/active pricing — all conditionally rendered per the product's own data shape (not every product has every field).
- **Variant-aware quantities**: each color variant of a product tracks its own count independently. The card's stepper is bound to whichever variant is currently active; switching the active variant swaps which count the stepper shows without touching the others. Verified behavior: add 2 to one variant, switch to another, stepper reads 0, switch back, original count is untouched.
- **Two-way synced steppers**: the same Redux state backs both the product-card stepper and the review-panel stepper for a given product+variant, so either one updates the other instantly.
- **Live review panel**: grouped by category (Cameras / Sensors / Accessories / Plan), one line per product+variant with qty > 0, plus the pre-seeded required items (Sense Hub) that have no add control in the builder itself. Shipping row, satisfaction-guarantee block, financing line, struck-through pre-discount total, savings callout, Checkout (placeholder toast), and a working Save link.
- **Persistence**: "Save my system for later" writes the full builder state (quantities, active variants, open step) to `localStorage`. Reloading or returning restores it exactly. Verified across full page reloads.
- **Responsive down to mobile**: single column, cards stack, review panel moves below the builder, all controls remain reachable and usable at 390px width.
- **Data-driven**: nothing is hardcoded per-product. `src/data/products.json` is the single source of truth; adding a product is just a new JSON entry.

---

## Architecture

```
src/
  components/        Presentational + connected components
  store/
    slices/           builderSlice (quantities, active variant, open step, persistence)
                       uiSlice (toast notifications)
    selectors.ts       All derived state: grouped review lines, order totals, per-step counts
  data/
    products.json      Seed product catalog
    seedState.ts        Default quantities/variants so the app loads matching the design
    steps.ts            Step metadata (titles, icons, CTA copy, next-step map)
  types/               Shared TypeScript interfaces
  assets/              Inline SVG icon/illustration components
  styles/              SCSS design tokens (_variables.scss) and mixins
```

**State shape.** Quantities live in one flat map keyed `` `${productId}::${variantId ?? 'default'}` ``, e.g. `"cam-v4::white": 2`. This is what makes per-variant quantity isolation trivial — incrementing one key never touches another. `activeVariant` is a separate `{ productId: variantId }` map that tracks which variant each card is currently displaying.

**Selectors** (`store/selectors.ts`) own all the derived logic — which lines appear in the review panel, how they're grouped, and how the order summary (subtotal, savings, monthly financing) is computed — built with `createSelector` so they're memoized and don't recompute on unrelated state changes.

**Persistence** is implemented inside the slice itself (`saveForLater` writes to `localStorage`; the slice's `initialState` reads from it on load) rather than as separate middleware, since the only requirement was an explicit save action, not autosave.

---

## Decisions & tradeoffs

- **Product imagery**: the design's product photos aren't license-free to extract and reuse, so each product is rendered as a small inline-SVG line-art illustration instead of a real photo. They're built to be recognizable (camera silhouettes, the sensor dome, the SD card) but this is a deliberate scope cut — in a real project these would be real product photography from a CDN/CMS.
- **Pricing reconciliation**: the source mockup's numbers don't fully reconcile arithmetically — e.g. one product's card shows a unit price that doesn't multiply out cleanly to the review panel's line total for the same product at qty 2. I treated the **review panel's line total ÷ quantity** as ground truth for each product's real unit price (so totals are always internally consistent — unit price × qty = line total, always), rather than chasing two slightly different numbers from the same static design. The grand total, savings, and financing figures are computed live from these unit prices rather than hardcoded, so they stay correct as quantities change, but they land a few dollars off the static mockup's headline numbers as a result.
- **Variant chip styling**: per the brief, chip selection styling was explicitly out of scope ("don't worry about the selected-chip styling/highlighting for now"). Chips show a small color swatch + label and a light selected outline; no attempt was made to pixel-match the original's icon-style chips.
- **"Save for later" / Checkout feedback**: clicking Checkout doesn't navigate anywhere (no real backend) — it surfaces a toast acknowledging this is a prototype. Save does the same with a confirmation toast and a brief "Saved ✓" state on the link itself.
- **Wide-viewport footer layout**: one of the provided reference frames shows the review panel reflowing into a full-width, two-internal-column footer once all accordion steps are collapsed. This looked like it could be either a distinct breakpoint or just a different scroll position of the same sticky-sidebar layout — it was ambiguous from static screenshots alone, so I didn't chase a separate container-query-driven layout for it. The standard sticky sidebar (same panel content, single internal column) is implemented and works at every breakpoint down to mobile.
- **Required/no-stepper items** (Sense Hub): rendered as a normal-looking card with no quantity control and a struck-through price showing "FREE", and pinned into the review panel via a `reviewOnly` flag in the data rather than a quantity the user can change.

## Not finished / known gaps

- No automated test suite (Jest/RTL) — given the scope, verification was done via manual interaction testing in a real browser rather than written unit tests. This would be the first thing added in a follow-up pass.
- No backend/API layer — the JSON bonus is implemented as a static local file, not served from an endpoint.
- Product illustrations are stylized SVGs, not the actual product photography from the design.


![CI](https://github.com/monakandoz/security-bundle-builder/actions/workflows/ci.yml/badge.svg)