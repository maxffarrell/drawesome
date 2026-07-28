# Contributing to Drawesome

Thanks for your interest in contributing!

## Before You Start

Open an issue first, especially for larger changes. It helps talk through the approach and avoids wasted effort.

## What's Welcome

- **Bug fixes** — Always welcome.
- **Stroke engine improvements** — Anything that makes a mark feel more like the tool it's named after.
- **Small, focused features** — Things that solve common drawing problems without adding complexity.
- **Visual and animation improvements** — Welcome, but have a high bar. Open an issue to discuss first.

## What's Harder to Merge

- **New props and options** — The API surface is intentionally small. New props need to earn their place.
- **More configuration** — Opinionated defaults over flexibility. The defaults are meant to be the version you ship.
- **New tools** — Seven pens and an eraser is the set. A new one has to do something none of them can.
- **Non-SVG rendering** — Drawesome is SVG-only by design.

## Code Style

- Match existing patterns
- Keep PRs focused (one change per PR)
- No external runtime dependencies beyond React

## A Few Things That Will Bite You

The stroke engine has some rules that aren't obvious from reading it:

- **Every ring winds the same way.** Overlapping loops only merge under the nonzero fill rule if they agree; wind one backwards and the stroke comes out scalloped.
- **Discs are circumscribed, not inscribed.** Otherwise every joint dips and curves look faceted.
- **Nothing about a stroke's shape may depend on the last point.** Anything that reads it changes the mark at the instant the pointer is released.
- **Per-stroke variation is seeded from the first point only.** The outline is rebuilt on every pointer move, so anything else reshuffles the whole line several times a second.

## Development

```bash
pnpm install
pnpm dev          # the studio, with every prop wired to a control
```

The studio consumes the package via a Vite alias pointed at its **source**, so engine changes hot-reload without a rebuild.

## Questions?

Open an issue. Happy to talk through ideas.
