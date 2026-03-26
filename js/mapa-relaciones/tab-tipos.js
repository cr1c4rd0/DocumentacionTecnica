// Depende de: data.js (REL_TYPES, HU_LINKS, ALL_HUS)

function buildTiposView() {
  const legendRow = document.getElementById('tipos-legend-row');
  const container = document.getElementById('tipos-container');

  Object.entries(REL_TYPES).forEach(([key, rt]) => {
    const links = HU_LINKS.filter(l => l.type === key);

    // Summary card in legend row
    const sumCol = document.createElement('div');
    sumCol.className = 'col-6 col-md-3';
    sumCol.innerHTML = `
      <div class="card text-center shadow-sm py-3" style="border-top:4px solid ${rt.color}">
        <div class="fw-bold" style="color:${rt.color};font-size:1.3rem;">${links.length}</div>
        <div class="fw-semibold small">${rt.label}</div>
        <div class="text-muted" style="font-size:10px;">${rt.desc.substring(0, 40)}…</div>
      </div>`;
    legendRow.appendChild(sumCol);

    // Full list card
    const col = document.createElement('div');
    col.className = 'col-md-6 col-xl-3';
    col.innerHTML = `
      <div class="card h-100 shadow-sm rel-type-card" style="border-top-color:${rt.color}">
        <div class="card-body">
          <span class="badge mb-2 px-3 py-1 fs-6" style="background:${rt.color}">${rt.label}</span>
          <p class="text-muted small mb-3">${rt.desc}</p>
          ${links.map(l => {
            const src = ALL_HUS.find(h => h.id === l.source);
            const tgt = ALL_HUS.find(h => h.id === l.target);
            if (!src || !tgt) return '';
            return `
              <div class="mb-3 p-2 rounded" style="background:#f9f9f9;border-left:3px solid ${rt.color}">
                <div class="d-flex align-items-center gap-1 flex-wrap mb-1">
                  <span class="hu-link-badge" style="background:${src.epicColor}">${src.id}</span>
                  <span style="font-size:14px;color:${rt.color};">→</span>
                  <span class="hu-link-badge" style="background:${tgt.epicColor}">${tgt.id}</span>
                </div>
                <div style="font-size:10.5px;font-weight:600;color:#333;">${src.label} → ${tgt.label}</div>
                <div class="text-muted" style="font-size:9.5px;">${l.desc}</div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
    container.appendChild(col);
  });
}
