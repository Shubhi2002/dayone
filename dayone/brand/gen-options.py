#!/usr/bin/env python3
"""Generates additional Dayone logo concept files: one sheet + one lockup HTML per concept.
Run from brand/: python3 gen-options.py  then  ../render.sh brand dayone-opt
"""
from pathlib import Path

INK = "#171717"; PURPLE = "#46206F"; LAV = "#B48CE0"; OFF = "#FDFCFA"

def mark(kind, c1, c2, size="0.95em"):
    """Return an SVG string for a mark. c1 = primary (ink or off-white), c2 = accent."""
    v = f'width="{size}" height="{size}" viewBox="0 0 24 24"'
    if kind == "calendar":
        return f'<svg {v}><rect x="3" y="4" width="18" height="17" rx="3.5" fill="{c1}"/><rect x="3" y="4" width="18" height="5" rx="3.5" fill="{c2}"/><rect x="3" y="7" width="18" height="2" fill="{c2}"/><text x="12" y="18.6" text-anchor="middle" font-family="Lora, Georgia, serif" font-weight="600" font-size="9.5" fill="{OFF if c1==INK else INK}">1</text></svg>'
    if kind == "door":
        return f'<svg {v}><rect x="4" y="3" width="14" height="18" rx="1.5" fill="none" stroke="{c1}" stroke-width="2"/><path d="M11 5 L19 3.2 V20.8 L11 19 Z" fill="{c2}"/><circle cx="16.6" cy="12" r="0.9" fill="{OFF}"/></svg>'
    if kind == "d1":
        return f'<svg {v}><circle cx="9" cy="15" r="5.2" fill="none" stroke="{c1}" stroke-width="2.6"/><rect x="13.2" y="3" width="2.6" height="17.2" rx="1.3" fill="{c1}"/><path d="M13.2 6.8 L10.2 8.8 L9.3 7.2 L13.2 3.6 Z" fill="{c2}"/></svg>'
    if kind == "dots":
        return f'<svg {v}><circle cx="4" cy="12" r="2.6" fill="{c2}"/><circle cx="9.3" cy="12" r="2.1" fill="none" stroke="{c1}" stroke-width="1.4"/><circle cx="14.6" cy="12" r="2.1" fill="none" stroke="{c1}" stroke-width="1.4"/><circle cx="19.9" cy="12" r="2.1" fill="none" stroke="{c1}" stroke-width="1.4"/></svg>'
    if kind == "commit":
        return f'<svg {v}><path d="M2 17 H22" stroke="{c1}" stroke-width="2" stroke-linecap="round"/><path d="M8 17 C 12 17, 12 6, 20 6" fill="none" stroke="{c1}" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="17" r="3.2" fill="{c2}"/><circle cx="20" cy="6" r="2.2" fill="none" stroke="{c1}" stroke-width="1.8"/></svg>'
    if kind == "rays":
        return f'<svg {v}><path d="M5 17 A7 7 0 0 1 19 17 Z" fill="{c2}"/><rect x="2" y="18.5" width="20" height="2.2" rx="1.1" fill="{c1}"/><path d="M12 3 V6.2 M4.5 7.5 L6.8 9.4 M19.5 7.5 L17.2 9.4" stroke="{c2}" stroke-width="1.8" stroke-linecap="round"/></svg>'
    if kind == "badge":
        return f'<svg {v}><rect x="9.5" y="1.5" width="5" height="4" rx="1.2" fill="none" stroke="{c1}" stroke-width="1.6"/><rect x="4" y="5" width="16" height="17" rx="3" fill="{c1}"/><rect x="7" y="9" width="10" height="2" rx="1" fill="{c2}"/><rect x="7" y="13" width="7" height="1.6" rx="0.8" fill="{OFF if c1==INK else INK}" opacity="0.55"/><rect x="7" y="16.3" width="10" height="1.6" rx="0.8" fill="{OFF if c1==INK else INK}" opacity="0.55"/></svg>'
    if kind == "slash":
        return ""  # wordmark-only concept
    raise ValueError(kind)

def word(kind, size, dark=False):
    ink = "#F6F3EE" if dark else INK
    acc = LAV if dark else PURPLE
    if kind == "slash":
        return f'<span class="word" style="font-size:{size}px;color:{ink};">day<span style="color:{acc};font-weight:400;margin:0 0.02em;">/</span>one</span>'
    if kind == "d1":
        return f'<span class="word" style="font-size:{size}px;color:{ink};">dayone</span>'
    return f'<span class="word" style="font-size:{size}px;color:{ink};">dayone</span>'

CONCEPTS = [
    ("calendar", "Calendar leaf",   "A page-a-day calendar showing 1. Literal 'day one', friendly, reads instantly. Risk: calendar apps use it too."),
    ("door",     "Door ajar",       "A door opening with light spilling through. Walking in on your first day. Warm and human; needs 20 px or more."),
    ("d1",       "d1 monogram",     "The 'd' bowl and a '1' stem fused into one glyph, with the 1's flag in purple. Compact, ownable, works as a favicon."),
    ("dots",     "First of many",   "A row of progress dots with the first one filled. Day one of a career, of a job, of a process. Very small-size friendly."),
    ("commit",   "First commit",    "A commit node on a line with a branch leaving it. The engineer's first commit. Speaks directly to the audience."),
    ("rays",     "Sunrise, rays",   "The current mark plus three short rays. Slightly warmer and more literal than the plain half-disc."),
    ("badge",    "Day-one badge",   "A lanyard badge with a purple name bar. Onboarding imagery; corporate but clear."),
    ("slash",    "day/one",         "Wordmark only, split by a purple slash like a path or a fraction. No icon; the slash becomes the favicon."),
]

HEAD = '<!doctype html>\n<html data-size="{w}x{h}"><head><meta charset="utf-8"><link rel="stylesheet" href="brand.css"><style>html,body{{width:{w}px;height:{h}px;}} .word{{font-family:var(--serif);font-weight:600;letter-spacing:-0.03em;line-height:1;}} .lockup{{display:flex;align-items:center;gap:0.3em;}}</style></head>\n<body{cls}>\n'

def lockup(kind, size, dark=False):
    c1 = "#F6F3EE" if dark else INK
    c2 = LAV if dark else PURPLE
    m = mark(kind, c1, c2)
    return f'<div class="lockup" style="font-size:{size}px;">{m}{word(kind, size, dark)}</div>'

out = Path(__file__).parent

# Individual lockups (light), 1200x600
for i, (kind, name, _) in enumerate(CONCEPTS, 1):
    html = HEAD.format(w=1200, h=600, cls="") + f'<div class="center">{lockup(kind, 120)}</div>\n</body></html>\n'
    (out / f"dayone-opt-{i:02d}-{kind}.html").write_text(html)

# Sheet: 2 rows x 4, each cell light lockup + dark mini + caption
cells = []
for i, (kind, name, desc) in enumerate(CONCEPTS, 1):
    cells.append(f'''
    <div class="cell">
      <div class="stage" style="padding:34px;">{lockup(kind, 64)}</div>
      <div class="stage dark" style="padding:16px 34px;">{lockup(kind, 30, dark=True)}</div>
      <div class="cap"><span class="k">Option {i}</span><b>{name}</b><span>{desc}</span></div>
    </div>''')
sheet = HEAD.format(w=1800, h=1240, cls="") + f'''
<div class="sheet" style="grid-template-rows:auto 1fr;">
  <div class="sheet-head"><h1>Dayone · more logo options</h1><span class="label">8 concepts · light and dark · current mark is the sunrise half-disc</span></div>
  <div class="cells" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:18px;">
    {''.join(cells)}
  </div>
</div>
</body></html>
'''
(out / "dayone-options-sheet.html").write_text(sheet)
print("wrote", len(CONCEPTS), "lockups + sheet")
