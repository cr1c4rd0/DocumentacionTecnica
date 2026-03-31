// Depende de: data.js (ADMIN_JOURNEY, ALL_HUS, HU_LINKS, REL_TYPES, HU_PHASE_ADMIN)

function buildAdminFlowView() {
  const container = document.getElementById('admin-flow-container');

  // ── Banner ─────────────────────────────────────────────────────
  const banner = document.createElement('div');
  banner.className = 'alert d-flex align-items-center gap-3 mb-3';
  banner.style.cssText = 'background:#fff3e0;border-left:4px solid #E65100;border-radius:8px;';
  banner.innerHTML = `
    <span style="font-size:2rem;">🏗️</span>
    <div>
      <div class="fw-bold" style="color:#E65100;font-size:13.5px;">Flujo Integrado del Administrador: Recorrido + Épicas</div>
      <div class="text-muted small">
        Cada fila es una fase del recorrido del administrador. Las tarjetas son las HUs que el admin activa en esa fase — haz clic para ir al diagrama de su épica.
        Las <strong>etiquetas de rol</strong> indican el perfil responsable de cada HU.
        Las <strong>flechas de color</strong> muestran las relaciones entre HUs del administrador.
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
  scrollWrap.id = 'admin-flow-scroll-wrap';
  scrollWrap.className = '';
  scrollWrap.style.cssText = 'overflow-x:auto;overflow-y:visible;padding-bottom:8px;';

  const lanesWrap = document.createElement('div');
  lanesWrap.id = 'admin-flow-lanes-wrap';
  lanesWrap.style.cssText = 'position:relative;min-width:700px;';

  // ── Build each swim-lane ───────────────────────────────────────
  ADMIN_JOURNEY.forEach(phase => {
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
      <div style="font-size:9px;color:#999;margin-top:3px;font-style:italic;line-height:1.3;">"${phase.adminAction.length > 52 ? phase.adminAction.substring(0, 52) + '…' : phase.adminAction}"</div>`;

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

      const roleEntry = phase.roles.find(r => r.hu === huId);

      const card = document.createElement('a');
      card.className = 'flow-hu-card';
      card.href = hu.epicHref;
      card.setAttribute('data-hu-id', huId);
      card.style.border = `2px solid ${hu.epicColor}`;
      card.innerHTML = `
        <span class="badge d-block mb-1" style="background:${hu.epicColor};font-size:9px;letter-spacing:.2px;">${huId}</span>
        <div style="font-size:11px;font-weight:700;color:#222;line-height:1.3;">${hu.label}</div>
        <div style="font-size:9px;font-weight:600;color:${hu.epicColor};margin-top:3px;">${hu.epicLabel}</div>
        <div style="font-size:8.5px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;" title="${hu.epicName}">${hu.epicName}</div>
        ${roleEntry ? `<div style="font-size:8px;color:${phase.color};margin-top:4px;white-space:normal;line-height:1.25;border-top:1px solid ${phase.color}22;padding-top:3px;" title="${roleEntry.role}">👤 ${roleEntry.role.length > 40 ? roleEntry.role.substring(0, 40) + '…' : roleEntry.role}</div>` : ''}`;
      content.appendChild(card);
    });

    lane.appendChild(label);
    lane.appendChild(content);
    lanesWrap.appendChild(lane);
  });

  // SVG overlay (arrows drawn after layout)
  const svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgOverlay.id = 'admin-flow-svg-overlay';
  svgOverlay.classList.add('flow-svg-overlay');
  svgOverlay.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;overflow:visible;';
  lanesWrap.appendChild(svgOverlay);

  scrollWrap.appendChild(lanesWrap);
  container.appendChild(scrollWrap);
}

function drawAdminFlowSvgArrows() {
  const svg = document.getElementById('admin-flow-svg-overlay');
  const wrap = document.getElementById('admin-flow-lanes-wrap');
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
    mk.setAttribute('id', `afm-${key}`);
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

  // ── Collect node centers (only admin-journey HUs) ──────────────
  const adminHuIds = new Set(ADMIN_JOURNEY.flatMap(p => p.hus));
  const nodePos = {};
  wrap.querySelectorAll('.flow-hu-card[data-hu-id]').forEach(el => {
    const id = el.getAttribute('data-hu-id');
    if (!adminHuIds.has(id)) return;
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

  // Filter links to only those where BOTH ends are in the admin journey
  const adminLinks = HU_LINKS.filter(l =>
    adminHuIds.has(l.source) && adminHuIds.has(l.target) &&
    nodePos[l.source] && nodePos[l.target]
  );

  // ── Cross-phase arrows ─────────────────────────────────────────
  const crossLinks = adminLinks.filter(l => {
    const sp = HU_PHASE_ADMIN[l.source];
    const tp = HU_PHASE_ADMIN[l.target];
    return sp && tp && sp !== tp;
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
    path.setAttribute('marker-end', `url(#afm-${link.type})`);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[${rt?.label || link.type}] ${link.source} → ${link.target}: ${link.desc}`;
    path.appendChild(title);
    svg.appendChild(path);
  });

  // ── Same-phase arcs ────────────────────────────────────────────
  const samePhaseLinks = adminLinks.filter(l => {
    const sp = HU_PHASE_ADMIN[l.source];
    const tp = HU_PHASE_ADMIN[l.target];
    return sp && tp && sp === tp;
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
    path.setAttribute('marker-end', `url(#afm-${link.type})`);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[${rt?.label}] ${link.source} → ${link.target}: ${link.desc}`;
    path.appendChild(title);
    svg.appendChild(path);
  });
}
