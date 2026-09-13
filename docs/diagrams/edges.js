// Draws SVG arrows between DOM nodes.
// <div class="edge" data-from="a" data-to="b"
//      data-label="text" data-class="accent|dashed|green"
//      data-route="curve|ortho|gutter-right|gutter-left"   (default: ortho for vertical, curve for horizontal)
//      data-sx="0.5" data-ex="0.5"   start/end anchor as a fraction of the node's width (vertical routes)
//      data-sy="0.5" data-ey="0.5"   start/end anchor as a fraction of the node's height (horizontal/gutter routes)
//      data-chan="0.5"               where the horizontal channel sits in the gap between the two nodes (0 = at source, 1 = at target)
//      data-gx="12"                  gutter inset from the container edge, px
// >
(function () {
  const svg = document.querySelector('svg.edges');
  const root = svg.parentElement;
  const rootRect = root.getBoundingClientRect();
  const NS = 'http://www.w3.org/2000/svg';
  const W = rootRect.width;

  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = ['555555:arr', '46206F:arr-accent', '6B6B6B:arr-muted', '1F8A63:arr-green'].map(s => {
    const [c, id] = s.split(':');
    return `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#${c}"/></marker>`;
  }).join('');
  svg.appendChild(defs);

  const rect = id => {
    const r = document.getElementById(id).getBoundingClientRect();
    const x = r.left - rootRect.left, y = r.top - rootRect.top;
    return { x, y, w: r.width, h: r.height, cx: x + r.width / 2, cy: y + r.height / 2, r: x + r.width, b: y + r.height };
  };
  const f = (v, d) => (v === undefined ? d : parseFloat(v));

  document.querySelectorAll('.edge').forEach(e => {
    const a = rect(e.dataset.from), b = rect(e.dataset.to);
    const sx = f(e.dataset.sx, 0.5), ex = f(e.dataset.ex, 0.5), sy = f(e.dataset.sy, 0.5), ey = f(e.dataset.ey, 0.5), chan = f(e.dataset.chan, 0.5);
    const vertical = Math.abs(b.cy - a.cy) > Math.abs(b.cx - a.cx) || (a.y > b.b) || (b.y > a.b);
    let route = e.dataset.route || (vertical ? 'ortho' : 'curve');
    let d, lx, ly;

    if (e.dataset.d) {
      route = 'template';
      const nodes = {};
      d = e.dataset.d.replace(/\{(\w+)\.(\w+)([+-]\d+(?:\.\d+)?)?\}/g, (m, id, prop, off) => {
        nodes[id] = nodes[id] || rect(id);
        return nodes[id][prop] + (off ? parseFloat(off) : 0);
      }).replace(/\{W\}/g, W);
      lx = null; ly = null;
    } else if (route === 'ortho') {
      const down = b.y >= a.b;                 // target below source
      const y1 = down ? a.b : a.y;             // leave from bottom or top
      const y2 = down ? b.y : b.b;             // arrive at top or bottom
      const x1 = a.x + a.w * sx, x2 = b.x + b.w * ex;
      const cy = y1 + (y2 - y1) * chan;
      d = `M${x1} ${y1} V${cy} H${x2} V${y2}`;
      if (Math.abs(x2 - x1) > 60) { lx = (x1 + x2) / 2; ly = cy - 5; }
      else { lx = x1 + 6; ly = (y1 + y2) / 2; }
    } else if (route === 'gutter-right' || route === 'gutter-left') {
      const gx = route === 'gutter-right' ? W - f(e.dataset.gx, 12) : f(e.dataset.gx, 12);
      const y1 = a.y + a.h * sy, y2 = b.y + b.h * ey;
      const x1 = route === 'gutter-right' ? a.r : a.x;
      const x2 = route === 'gutter-right' ? b.r : b.x;
      d = `M${x1} ${y1} H${gx} V${y2} H${x2}`;
      lx = gx + (route === 'gutter-right' ? -6 : 6); ly = (y1 + y2) / 2;
    } else {
      // curve, horizontal
      const toRight = b.cx >= a.cx;
      const x1 = toRight ? a.r : a.x, x2 = toRight ? b.x : b.r;
      const y1 = a.y + a.h * sy, y2 = b.y + b.h * ey;
      const mx = (x1 + x2) / 2;
      d = `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      lx = mx; ly = (y1 + y2) / 2 - 5;
    }

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    const cls = e.dataset.class || '';
    path.setAttribute('class', cls);
    const marker = cls.includes('accent') ? 'arr-accent' : cls.includes('dashed') ? 'arr-muted' : cls.includes('green') ? 'arr-green' : 'arr';
    path.setAttribute('marker-end', `url(#${marker})`);
    svg.appendChild(path);

    if (e.dataset.label) {
      if (lx === null) { const len = path.getTotalLength(); const pt = path.getPointAtLength(len * f(e.dataset.t, 0.5)); lx = pt.x; ly = pt.y - 5; }
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', lx); text.setAttribute('y', ly);
      let anchor = route === 'gutter-right' ? 'end' : route === 'gutter-left' ? 'start' : (route === 'ortho' && Math.abs(b.x + b.w * ex - (a.x + a.w * sx)) <= 60) ? 'start' : 'middle';
      if (e.dataset.anchor) anchor = e.dataset.anchor;
      if (route === 'gutter-right' || route === 'gutter-left') {
        text.setAttribute('transform', `rotate(-90 ${lx} ${ly})`);
        anchor = 'middle';
        text.setAttribute('y', ly + 3);
      }
      text.setAttribute('text-anchor', anchor);
      text.textContent = e.dataset.label;
      svg.appendChild(text);
      const bb = text.getBBox();
      const bg = document.createElementNS(NS, 'rect');
      bg.setAttribute('class', 'lbl');
      if (text.hasAttribute('transform')) {
        bg.setAttribute('transform', text.getAttribute('transform'));
      }
      bg.setAttribute('x', bb.x - 4); bg.setAttribute('y', bb.y - 1);
      bg.setAttribute('width', bb.width + 8); bg.setAttribute('height', bb.height + 2);
      svg.insertBefore(bg, text);
    }
  });
})();
