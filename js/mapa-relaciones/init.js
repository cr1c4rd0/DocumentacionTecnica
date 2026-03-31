// Depende de: todos los módulos de mapa-relaciones

document.addEventListener('DOMContentLoaded', function () {
  buildTiposView();
  buildTablaView();
  buildJourneyView();
  buildIntegratedFlowView();
  buildAdminJourneyView();
  buildAdminFlowView();

  // D3 puede no estar listo aún (carga asíncrona desde CDN)
  function tryGraph() {
    if (typeof d3 !== 'undefined') { buildGraph(); }
    else { setTimeout(tryGraph, 80); }
  }
  tryGraph();

  // Redibujar el grafo D3 cada vez que se activa la tab
  document.getElementById('tab-red-btn').addEventListener('shown.bs.tab', function () {
    if (typeof d3 !== 'undefined') buildGraph();
  });

  // Dibujar flechas SVG cuando se activa el Flujo Integrado (usuario)
  document.getElementById('tab-flow-btn').addEventListener('shown.bs.tab', function () {
    requestAnimationFrame(() => setTimeout(drawFlowSvgArrows, 60));
  });

  // Dibujar flechas SVG cuando se activa el Flujo Integrado Admin
  document.getElementById('tab-admin-flow-btn').addEventListener('shown.bs.tab', function () {
    requestAnimationFrame(() => setTimeout(drawAdminFlowSvgArrows, 60));
  });

  // Redibujar flechas al redimensionar ventana según la tab activa
  window.addEventListener('resize', function () {
    if (document.getElementById('tab-flow')?.classList.contains('active')) {
      drawFlowSvgArrows();
    }
    if (document.getElementById('tab-admin-flow')?.classList.contains('active')) {
      drawAdminFlowSvgArrows();
    }
  });
});
