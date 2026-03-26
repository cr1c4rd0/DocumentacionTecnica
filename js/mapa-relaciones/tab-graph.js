// Depende de: data.js (EPICS, ALL_HUS, HU_LINKS, REL_TYPES), tab-detail.js (renderDetail)
// Requiere: d3 v7 cargado globalmente

function buildGraph() {
  const container = document.getElementById('graph-container');
  const W = container.clientWidth || 700;
  const H = container.clientHeight || 560;

  const svgEl = document.getElementById('graph-svg');
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const svg = d3.select('#graph-svg').attr('viewBox', `0 0 ${W} ${H}`);

  // ── Zoom ──────────────────────────────────────────────────────
  const zoomB = d3.zoom().scaleExtent([0.2, 5])
    .on('zoom', e => gRoot.attr('transform', e.transform));
  svg.call(zoomB);

  const gRoot = svg.append('g');

  // ── Arrow markers per relationship type ───────────────────────
  const defs = svg.append('defs');
  Object.entries(REL_TYPES).forEach(([key, rt]) => {
    defs.append('marker')
      .attr('id', `arrow-${key}`)
      .attr('viewBox', '0 -4 8 8').attr('refX', 24).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', rt.color).attr('opacity', 0.75);
  });

  // ── Pre-assign epic cluster centers (circle layout) ───────────
  const epicCenters = {};
  EPICS.forEach((e, i) => {
    const angle = (i / EPICS.length) * 2 * Math.PI - Math.PI / 2;
    epicCenters[e.id] = { x: W / 2 + 205 * Math.cos(angle), y: H / 2 + 185 * Math.sin(angle) };
  });

  // ── Node data ──────────────────────────────────────────────────
  const huNodes = ALL_HUS.map(hu => {
    const center = epicCenters[hu.epicId];
    const peers = ALL_HUS.filter(h => h.epicId === hu.epicId);
    const idx = peers.findIndex(h => h.id === hu.id);
    const a = (idx / Math.max(peers.length, 1)) * 2 * Math.PI;
    const r = 22 + 8 * peers.length;
    return { ...hu, x: center.x + r * Math.cos(a), y: center.y + r * Math.sin(a) };
  });

  const linkData = HU_LINKS.map(l => ({ ...l }));

  // ── Clustering force ───────────────────────────────────────────
  function clusterForce(alpha) {
    const k = 0.1 * alpha;
    huNodes.forEach(n => {
      const c = epicCenters[n.epicId];
      if (!c) return;
      n.vx -= (n.x - c.x) * k;
      n.vy -= (n.y - c.y) * k;
    });
  }

  // ── Simulation ─────────────────────────────────────────────────
  const sim = d3.forceSimulation(huNodes)
    .force('link', d3.forceLink(linkData).id(d => d.id).distance(80).strength(0.35))
    .force('charge', d3.forceManyBody().strength(-90))
    .force('collision', d3.forceCollide(17))
    .force('cluster', clusterForce);

  // ── Epic hulls ─────────────────────────────────────────────────
  const hullG = gRoot.append('g');
  const epicHullPaths = hullG.selectAll('path')
    .data(EPICS).join('path')
    .attr('class', 'hull-path')
    .attr('fill', d => d.color)
    .attr('stroke', d => d.color);

  // Epic labels
  const epicLabels = gRoot.append('g').selectAll('text')
    .data(EPICS).join('text')
    .attr('class', 'epic-cluster-label')
    .attr('fill', d => d.color)
    .text(d => d.label);

  // ── Links ──────────────────────────────────────────────────────
  const linkG = gRoot.append('g');
  const linkLines = linkG.selectAll('line')
    .data(linkData).join('line')
    .attr('class', 'link-line')
    .attr('stroke', d => REL_TYPES[d.type]?.color || '#aaa')
    .attr('stroke-width', 1.8)
    .attr('stroke-opacity', 0.55)
    .attr('marker-end', d => `url(#arrow-${d.type})`);

  linkLines.append('title').text(d =>
    `${d.source?.id || d.source} → ${d.target?.id || d.target}\n${REL_TYPES[d.type]?.label}: ${d.desc}`
  );

  // ── Nodes ──────────────────────────────────────────────────────
  const nodeG = gRoot.append('g');
  const nodeGroups = nodeG.selectAll('g')
    .data(huNodes).join('g')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  nodeGroups.append('circle')
    .attr('class', 'node-circle')
    .attr('r', 13)
    .attr('fill', d => d.epicColor);

  nodeGroups.append('text')
    .attr('class', 'node-label')
    .text(d => d.id);

  nodeGroups.append('title').text(d => `HU ${d.id}: ${d.label}\n${d.epicLabel}: ${d.epicName}`);

  // ── Hull path builder ──────────────────────────────────────────
  function hullPath(epicId) {
    const pts = huNodes.filter(n => n.epicId === epicId).map(n => [n.x, n.y]);
    if (!pts.length) return '';
    const PAD = 24;
    if (pts.length === 1) {
      const [x, y] = pts[0];
      return `M${x - PAD},${y} a${PAD},${PAD} 0 1,0 ${PAD * 2},0 a${PAD},${PAD} 0 1,0 ${-PAD * 2},0`;
    }
    const hull = d3.polygonHull(pts);
    if (!hull) {
      const cx = d3.mean(pts, p => p[0]), cy = d3.mean(pts, p => p[1]);
      return `M${cx - PAD},${cy} a${PAD},${PAD} 0 1,0 ${PAD * 2},0 a${PAD},${PAD} 0 1,0 ${-PAD * 2},0`;
    }
    const centroid = d3.polygonCentroid(hull);
    const expanded = hull.map(p => {
      const dx = p[0] - centroid[0], dy = p[1] - centroid[1];
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      return [p[0] + PAD * dx / dist, p[1] + PAD * dy / dist];
    });
    return d3.line().curve(d3.curveCatmullRomClosed)(expanded);
  }

  // ── Tick ───────────────────────────────────────────────────────
  sim.on('tick', () => {
    epicHullPaths.attr('d', d => hullPath(d.id));

    epicLabels.each(function (d) {
      const pts = huNodes.filter(n => n.epicId === d.id);
      if (!pts.length) return;
      const cx = d3.mean(pts, n => n.x);
      const cy = d3.min(pts, n => n.y) - 28;
      d3.select(this).attr('x', cx).attr('y', cy);
    });

    linkLines
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

    nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // ── Click → detail panel ───────────────────────────────────────
  nodeGroups.on('click', function (event, d) {
    nodeGroups.selectAll('.node-circle').classed('selected', false);
    d3.select(this).select('.node-circle').classed('selected', true);

    linkLines.attr('stroke-opacity', l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      return (sid === d.id || tid === d.id) ? 1 : 0.15;
    });
    nodeGroups.selectAll('.node-circle').attr('opacity', n => {
      if (n.id === d.id) return 1;
      const connected = HU_LINKS.some(l =>
        (l.source === d.id && l.target === n.id) || (l.target === d.id && l.source === n.id)
      );
      return connected ? 1 : 0.35;
    });

    renderDetail(d);
  });

  // ── Reset button ───────────────────────────────────────────────
  document.getElementById('btn-reset').onclick = () => {
    svg.transition().duration(600).call(zoomB.transform, d3.zoomIdentity);
    sim.alpha(0.8).restart();
    nodeGroups.selectAll('.node-circle').classed('selected', false).attr('opacity', 1);
    linkLines.attr('stroke-opacity', 0.55);
    document.getElementById('detail-placeholder').style.display = '';
    document.getElementById('detail-content').style.display = 'none';
  };
}
