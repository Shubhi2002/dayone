# Design assets

UI mockups and brand assets from the ideation phase, kept as references for building `apps/web`.

- `mockups/` · 38 HTML screens (candidate workspaces per mode, journey screens, recruiter console, website pages, the simplified single-round flow) with shared `tokens.css`, `app.css`, `site.css`, `simple.css`. Rendered PNGs in `mockups/png/`.
- `brand/` · logo concepts, lockups and app icon; `gen-options.py` generates the alternative marks. Rendered PNGs in `brand/png/`.
- `render.sh` · renders any folder of HTML mockups to 2× PNGs with headless Chrome: `./render.sh mockups`, `./render.sh brand`, `./render.sh ../docs/diagrams`.

Note: the mockups predate the decision to use IDE-extension agents; where a screen shows a custom agent panel, read it as the chosen extension's own chat panel inside VS Code. The design tokens (palette, type) are the source of truth for the web app.
