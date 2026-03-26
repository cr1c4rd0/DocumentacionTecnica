// Depende de: data.js (ALL_HUS, REL_TYPES), helpers.js (getRelations)

function buildTablaView() {
  const rows = ALL_HUS.map(hu => {
    const rels = getRelations(hu.id);
    return `
      <tr>
        <td style="white-space:nowrap;">
          <span class="badge px-2 py-1" style="background:${hu.epicColor};font-size:11px;">${hu.id}</span>
        </td>
        <td style="font-size:11.5px;">${hu.label}</td>
        <td style="font-size:10.5px;">
          <a href="${hu.epicHref}" class="text-decoration-none fw-semibold" style="color:${hu.epicColor};">${hu.epicLabel}</a>
          <div class="text-muted" style="font-size:9.5px;">${hu.epicName}</div>
        </td>
        <td>
          ${rels.length ? rels.map(r => `
            <div class="mb-1 d-flex align-items-start gap-1 flex-wrap">
              <span class="badge" style="background:${REL_TYPES[r.type]?.color || '#999'};font-size:9px;">${REL_TYPES[r.type]?.label || r.type}</span>
              <span class="hu-link-badge" style="background:${r.hu.epicColor};font-size:10px;">${r.hu.id}</span>
              <span style="font-size:10px;color:#555;">${r.hu.label}</span>
            </div>`).join('')
          : '<span class="text-muted small">—</span>'}
        </td>
      </tr>`;
  }).join('');

  document.getElementById('tabla-container').innerHTML = `
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle" style="font-size:11.5px;">
        <thead class="table-dark">
          <tr>
            <th>HU</th>
            <th style="min-width:160px;">Nombre</th>
            <th style="min-width:150px;">Épica</th>
            <th style="min-width:260px;">Relaciones con otras HU</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
