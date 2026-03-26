// Depende de: data.js (USER_JOURNEY, ALL_HUS, HU_LINKS, REL_TYPES, HU_PHASE)

function buildIntegratedFlowView() {
  const container = document.getElementById('flow-container');

  // ── Banner ─────────────────────────────────────────────────────
  const banner = document.createElement('div');
  banner.className = 'alert d-flex align-items-center gap-3 mb-3';
  banner.style.cssText = 'background:#fff8e1;border-left:4px solid #F9A825;border-radius:8px;';
  banner.innerHTML = `
    <span style="font-size:2rem;">🗺️</span>
    <div>
      <div class="fw-bold" style="color:#E65100;font-size:13.5px;">Flujo Integrado: Recorrido del Usuario + Diagramas de Épica</div>
      <div class="text-muted small">
        Cada fila es una fase del recorrido. Las tarjetas son las HUs activadas en esa fase — haz clic para ir al diagrama de su épica.
        Las <strong>flechas de color</strong> entre carriles muestran las relaciones cruzadas entre fases (según tipo de relación).
      </div>
    </div>`;
  container.appendChild(banner);

  // ── Legend ─────────────────────────────────────────────────────
  const legend = document.createElement('div');
  legend.className = 'd-flex flex-wrap gap-3 mb-3 px-1';
  legend.innerHTML = Object.entries(REL_TYPES).map(([, rt]) => `
    <span class="flow-legend-item">
      <span class="flow-legend-line" style="background:${rt.color};"></span>
      <span>${rt.label}</span>
    </span>`).join('') +
    `<span class="flow-legend-item ms-3" style="color:#aaa;">
      <span class="flow-legend-line" style="background:#adb5bd;border:1px dashed #adb5bd;height:0;border-top-style:dashed;"></span>
      <span style="color:#888;">Flujo principal entre fases</span>
    </span>`;
  container.appendChild(legend);

  // ── Scrollable wrap ────────────────────────────────────────────
  const scrollWrap = document.createElement('div');
  scrollWrap.id = 'flow-scroll-wrap';

  const lanesWrap = document.createElement('div');
  lanesWrap.id = 'flow-lanes-wrap';

  // ── Build each swim-lane ───────────────────────────────────────
  USER_JOURNEY.forEach(phase => {
    const lane = document.createElement('div');
    lane.className = 'flow-lane';
    lane.dataset.phase = phase.phase;

    const label = document.createElement('div');
    label.className = 'flow-lane-label';
    label.style.borderLeft = `5px solid ${phase.color}`;
    label.style.background = `${phase.color}0d`;
    label.innerHTML = `
      <div style="font-size:1.4rem;line-height:1;">${phase.icon}</div>
      <div style="font-weight:800;font-size:11px;color:${phase.color};margin-top:4px;line-height:1.3;">${phase.phase}. ${phase.label}</div>
      <div style="font-size:9px;color:#999;margin-top:3px;font-style:italic;line-height:1.3;">"${phase.userAction.length > 52 ? phase.userAction.substring(0, 52) + '…' : phase.userAction}"</div>`;

    const content = document.createElement('div');
    content.className = 'flow-lane-content';

    phase.hus.forEach((huId, hi) => {
      const hu = ALL_HUS.find(h => h.id === huId);
      if (!hu) return;

      if (hi > 0) {
        const arr = document.createElement('span');
        arr.className = 'flow-card-arrow';
        arr.textContent = '→';
        content.appendChild(arr);
      }

      const card = document.createElement('a');
      card.className = 'flow-hu-card';
      card.href = hu.epicHref;
      card.setAttribute('data-hu-id', huId);
      card.style.border = `2px solid ${hu.epicColor}`;
      card.innerHTML = `
        <span class="badge d-block mb-1" style="background:${hu.epicColor};font-size:9px;letter-spacing:.2px;">${huId}</span>
        <div style="font-size:11px;font-weight:700;color:#222;line-height:1.3;">${hu.label}</div>
        <div style="font-size:9px;font-weight:600;color:${hu.epicColor};margin-top:3px;">${hu.epicLabel}</div>
        <div style="font-size:8.5px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;" title="${hu.epicName}">${hu.epicName}</div>`;
      content.appendChild(card);
    });

    lane.appendChild(label);
    lane.appendChild(content);
    lanesWrap.appendChild(lane);
  });

  // SVG overlay (arrows drawn after layout)
  const svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgOverlay.id = 'flow-svg-overlay';
  svgOverlay.classList.add('flow-svg-overlay');
  lanesWrap.appendChild(svgOverlay);

  scrollWrap.appendChild(lanesWrap);
  container.appendChild(scrollWrap);
}

function drawFlowSvgArrows() {
  const svg = document.getElementById('flow-svg-overlay');
  const wrap = document.getElementById('flow-lanes-wrap');
  if (!svg || !wrap) return;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const wrapRect = wrap.getBoundingClientRect();
  const W = wrap.scrollWidth;
  const H = wrap.scrollHeight;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // ── Arrowhead markers ──────────────────────────────────────────
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  Object.entries(REL_TYPES).forEach(([key, rt]) => {
    const mk = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    mk.setAttribute('id', `fm-${key}`);
    mk.setAttribute('markerWidth', '7');
    mk.setAttribute('markerHeight', '7');
    mk.setAttribute('refX', '5');
    mk.setAttribute('refY', '3.5');
    mk.setAttribute('orient', 'auto');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M0,0 L0,7 L7,3.5 z');
    p.setAttribute('fill', rt.color);
    mk.appendChild(p);
    defs.appendChild(mk);
  });
  svg.appendChild(defs);

  // ── Collect node centers ───────────────────────────────────────
  const nodePos = {};
  wrap.querySelectorAll('.flow-hu-card[data-hu-id]').forEach(el => {
    const id = el.getAttribute('data-hu-id');
    const r = el.getBoundingClientRect();
    nodePos[id] = {
      cx:     r.left - wrapRect.left + r.width / 2,
      cy:     r.top  - wrapRect.top  + r.height / 2,
      top:    r.top    - wrapRect.top,
      bottom: r.bottom - wrapRect.top,
      left:   r.left   - wrapRect.left,
      right:  r.right  - wrapRect.left,
      w: r.width,
      h: r.height,
    };
  });

  // ── Cross-phase arrows (relationship links between different phases) ──
  const crossLinks = HU_LINKS.filter(l => {
    const sp = HU_PHASE[l.source];
    const tp = HU_PHASE[l.target];
    return sp && tp && sp !== tp && nodePos[l.source] && nodePos[l.target];
  });

  crossLinks.forEach(link => {
    const s = nodePos[link.source];
    const t = nodePos[link.target];
    const rt = REL_TYPES[link.type];
    const color = rt?.color || '#999';

    const x1 = s.cx, y1 = s.bottom - 2;
    const x2 = t.cx, y2 = t.top + 2;

    const dx = Math.abs(x2 - x1);
    const dy = y2 - y1;
    const cpOffset = dx < 20 ? 40 : 0;
    const cp1x = x1 + cpOffset, cp1y = y1 + dy * 0.35;
    const cp2x = x2 - cpOffset, cp2y = y1 + dy * 0.65;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', link.type === 'integra' ? '2' : '1.5');
    path.setAttribute('stroke-opacity', '0.55');
    if (link.type === 'complementa') path.setAttribute('stroke-dasharray', '5,3');
    path.setAttribute('marker-end', `url(#fm-${link.type})`);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[${rt?.label || link.type}] ${link.source} → ${link.target}: ${link.desc}`;
    path.appendChild(title);
    svg.appendChild(path);
  });

  // ── Same-phase arcs (dotted, above the cards) ──────────────────
  const samePhaseLinks = HU_LINKS.filter(l => {
    const sp = HU_PHASE[l.source];
    const tp = HU_PHASE[l.target];
    return sp && tp && sp === tp && nodePos[l.source] && nodePos[l.target];
  });

  samePhaseLinks.forEach(link => {
    const s = nodePos[link.source];
    const t = nodePos[link.target];
    const rt = REL_TYPES[link.type];
    const color = rt?.color || '#bbb';

    const x1 = s.right, y1 = s.cy;
    const x2 = t.left,  y2 = t.cy;
    const midX = (x1 + x2) / 2;
    const arcY = Math.min(s.top, t.top) - 14;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${x1},${y1} Q${midX},${arcY} ${x2},${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-opacity', '0.6');
    path.setAttribute('stroke-dasharray', '4,2');
    path.setAttribute('marker-end', `url(#fm-${link.type})`);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[${rt?.label}] ${link.source} → ${link.target}: ${link.desc}`;
    path.appendChild(title);
    svg.appendChild(path);
  });
}
