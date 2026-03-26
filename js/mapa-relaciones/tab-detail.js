// Depende de: data.js (REL_TYPES), helpers.js (getRelations)

function renderDetail(hu) {
  const rels = getRelations(hu.id);
  document.getElementById('detail-placeholder').style.display = 'none';
  const content = document.getElementById('detail-content');
  content.style.display = 'block';

  const byType = {};
  rels.forEach(r => { (byType[r.type] = byType[r.type] || []).push(r); });

  content.innerHTML = `
    <div class="d-flex align-items-start gap-2 mb-3">
      <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
           style="width:44px;height:44px;background:${hu.epicColor};font-size:9.5px;text-align:center;line-height:1.25;">
        ${hu.id}
      </div>
      <div>
        <div class="fw-bold" style="color:${hu.epicColor};font-size:13px;">${hu.label}</div>
        <a href="${hu.epicHref}" class="text-decoration-none text-muted small">${hu.epicLabel}: ${hu.epicName}</a><br>
        <a href="${hu.epicHref}" class="btn btn-sm text-white mt-1 px-2 py-0" style="background:${hu.epicColor};font-size:11px;">
          Ver diagrama →
        </a>
      </div>
    </div>

    ${rels.length === 0
        ? '<p class="text-muted small">Esta HU no tiene relaciones explícitas mapeadas.</p>'
        : Object.entries(byType).map(([type, list]) => {
          const rt = REL_TYPES[type] || { label: type, color: '#999' };
          return `
            <div class="mb-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge px-2 py-1" style="background:${rt.color}">${rt.label}</span>
                <span class="text-muted small">${rt.desc}</span>
              </div>
              ${list.map(r => `
                <div class="relation-row" style="border-left-color:${rt.color}">
                  <div class="d-flex align-items-center gap-1 mb-1 flex-wrap">
                    <span class="dir-badge" style="background:${rt.color}">
                      ${r.isSource ? 'Origen' : 'Destino'}
                    </span>
                    <span class="hu-link-badge" style="background:${r.hu.epicColor};font-size:10.5px;">${r.hu.id}</span>
                    <span class="fw-semibold" style="font-size:11.5px;">${r.hu.label}</span>
                  </div>
                  <div class="text-muted" style="font-size:10px;">${r.desc}</div>
                  <div class="text-muted" style="font-size:9.5px;">${r.hu.epicLabel}: ${r.hu.epicName}</div>
                </div>`).join('')}
            </div>`;
        }).join('')
      }`;
}
