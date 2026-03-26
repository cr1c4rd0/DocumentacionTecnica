// Depende de: data.js (USER_JOURNEY, ALL_HUS, EPICS)

function buildJourneyView() {
  const container = document.getElementById('journey-container');

  const totalHUs = [...new Set(USER_JOURNEY.flatMap(p => p.hus))].length;
  const summaryHtml = `
    <div class="alert d-flex align-items-center gap-3 mb-4" style="background:#f0f4ff;border-left:4px solid #1565C0;border-radius:8px;">
      <div style="font-size:2rem;">🧭</div>
      <div>
        <div class="fw-bold" style="color:#1565C0;">Recorrido típico de un usuario en el Sistema Recomendador</div>
        <div class="text-muted small">
          <strong>${USER_JOURNEY.length} fases</strong> &nbsp;·&nbsp;
          <strong>${totalHUs} HUs involucradas</strong> &nbsp;·&nbsp;
          El flujo muestra el orden en que el usuario interactúa con cada Historia de Usuario, desde la llegada hasta el aprendizaje del sistema.
        </div>
      </div>
    </div>`;

  const phasesHtml = USER_JOURNEY.map((phase, idx) => {
    const huPills = phase.hus.map(huId => {
      const hu = ALL_HUS.find(h => h.id === huId);
      if (!hu) return '';
      return `<span class="journey-hu-pill" title="${hu.label} · ${hu.epicLabel}: ${hu.epicName}">
        <span class="journey-hu-dot" style="background:${hu.epicColor}"></span>
        <span>${huId}</span>
        <span class="text-muted" style="font-size:9.5px;">· ${hu.label}</span>
      </span>`;
    }).join('');

    const stepsHtml = phase.steps.map((s, si) => `
      <li class="mb-1" style="font-size:11.5px;color:#444;">
        <span style="color:${phase.color};font-weight:700;">${si + 1}.</span> ${s}
      </li>`).join('');

    const connector = idx < USER_JOURNEY.length - 1
      ? `<div class="d-flex align-items-center justify-content-start ps-3 py-1" style="height:30px;">
           <div style="width:3px;height:100%;background:linear-gradient(to bottom,${phase.color},${USER_JOURNEY[idx + 1].color});border-radius:2px;margin-left:19px;"></div>
           <span class="text-muted small ps-2" style="font-size:10px;">continúa ↓</span>
         </div>`
      : '';

    return `
      <div class="journey-step-row mb-1">
        <div class="journey-step-left">
          <div class="journey-step-bubble" style="background:${phase.color}20;border:2px solid ${phase.color};">
            <span style="font-size:18px;">${phase.icon}</span>
          </div>
        </div>
        <div class="journey-step-body">
          <div class="card shadow-sm journey-phase-card mb-0" style="border-color:${phase.color}20;">
            <div class="card-body py-3 px-3">
              <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span class="journey-phase-number" style="background:${phase.color};">${phase.phase}</span>
                <span class="fw-bold" style="color:${phase.color};font-size:13.5px;">${phase.label}</span>
                <span class="journey-action-tag ms-auto" style="background:${phase.color}22;color:${phase.color};">
                  ${phase.hus.length} HU${phase.hus.length > 1 ? 's' : ''}
                </span>
              </div>
              <div class="text-muted mb-2" style="font-size:11px;padding-left:36px;">
                <em>"${phase.userAction}"</em>
              </div>
              <div class="mb-2" style="padding-left:36px;">${huPills}</div>
              <div style="padding-left:36px;">
                <ul class="mb-0 ps-3">${stepsHtml}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${connector}`;
  }).join('');

  const coveredEpicIds = [...new Set(
    USER_JOURNEY.flatMap(p => p.hus.map(id => ALL_HUS.find(h => h.id === id)?.epicId).filter(Boolean))
  )];
  const epicCoverageHtml = coveredEpicIds.map(eid => {
    const epic = EPICS.find(e => e.id === eid);
    if (!epic) return '';
    return `<span class="badge me-1 mb-1 px-2 py-1" style="background:${epic.color};font-size:10px;">${epic.label}: ${epic.name}</span>`;
  }).join('');

  container.innerHTML = `
    ${summaryHtml}
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="journey-timeline">${phasesHtml}</div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body">
            <h6 class="fw-bold mb-3" style="color:#333;">📊 Épicas cubiertas en el recorrido</h6>
            <div>${epicCoverageHtml}</div>
          </div>
        </div>
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3" style="color:#333;">💡 Cómo leer este mapa</h6>
            <ul class="small text-muted ps-3 mb-0">
              <li class="mb-2">Cada fase representa un <strong>momento clave</strong> en la experiencia del usuario.</li>
              <li class="mb-2">Las <strong>píldoras de HU</strong> muestran qué historias de usuario se activan en esa fase.</li>
              <li class="mb-2">El color de cada fase coincide con su <strong>épica dominante</strong>.</li>
              <li class="mb-2">El flujo es <strong>secuencial pero no lineal</strong>: el usuario puede volver a fases anteriores (p.ej. ajustar preferencias).</li>
              <li>Las fases de <strong>Retroalimentación</strong> ocurren de forma continua y transparente para el usuario.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
}
