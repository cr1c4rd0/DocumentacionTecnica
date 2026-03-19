// Bootstrap CDN centralizado — actualizar aquí para todos los ficheros
(function () {
  var cssHref = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css';
  var cssIntegrity = 'sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB';
  var jsHref = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js';
  var jsIntegrity = 'sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI';
  var DEFAULT_DESCRIPTION = 'Aqui va descripción';

  // CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssHref;
  link.integrity = cssIntegrity;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  // JS — al cargar, inicializar popovers sobre nodos Mermaid
  var script = document.createElement('script');
  script.src = jsHref;
  script.integrity = jsIntegrity;
  script.crossOrigin = 'anonymous';
  script.onload = function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMermaidPopovers);
    } else {
      initMermaidPopovers();
    }
  };
  document.head.appendChild(script);

  // ─── Popovers en nodos Mermaid ────────────────────────────────────────────
  //
  // Cada página puede definir ANTES de que este script actúe:
  //
  //   window.diagramDescriptions = {
  //     "Texto exacto del nodo": "Descripción personalizada del nodo",
  //     "Otro nodo":             "Otra descripción"
  //   };
  //
  // La clave es el texto visible del nodo (puede ser parcial, case-insensitive).
  // Si no se encuentra ninguna coincidencia se usa DEFAULT_DESCRIPTION.
  // ─────────────────────────────────────────────────────────────────────────

  function resolveDescription(nodeLabel) {
    var map = window.diagramDescriptions;
    if (!map || typeof map !== 'object') return DEFAULT_DESCRIPTION;

    // Búsqueda exacta primero
    if (map[nodeLabel] !== undefined) return map[nodeLabel];

    // Búsqueda parcial case-insensitive como fallback
    var lower = nodeLabel.toLowerCase();
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i].toLowerCase()) !== -1 ||
          keys[i].toLowerCase().indexOf(lower) !== -1) {
        return map[keys[i]];
      }
    }

    return DEFAULT_DESCRIPTION;
  }

  function initMermaidPopovers() {
    var containers = document.querySelectorAll('.mermaid');
    if (!containers.length) return; // página sin diagramas (ej. índice)

    // Caso A: Mermaid ya renderizó antes de que Bootstrap cargase
    containers.forEach(function (c) {
      var svg = c.querySelector('svg');
      if (svg) attachPopovers(svg);
    });

    // Caso B: Mermaid aún no renderizó → observar la inserción del SVG
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (added) {
          var svg = added.nodeName === 'svg'
            ? added
            : (added.querySelector && added.querySelector('svg'));
          if (svg) attachPopovers(svg);
        });
      });
    });

    containers.forEach(function (c) {
      if (!c.querySelector('svg')) {
        observer.observe(c, { childList: true, subtree: false });
      }
    });
  }

  function attachPopovers(svg) {
    svg.querySelectorAll('g.node').forEach(function (node) {
      // Evitar doble inicialización
      if (node.getAttribute('data-bs-toggle')) return;

      // Texto visible del nodo (título del popover y clave de búsqueda)
      var labelEl = node.querySelector('foreignObject span, text');
      var title = labelEl ? labelEl.textContent.trim().replace(/\s+/g, ' ') : 'Nodo';
      var description = resolveDescription(title);

      node.setAttribute('data-bs-toggle', 'popover');
      node.setAttribute('data-bs-trigger', 'hover focus');
      node.setAttribute('data-bs-placement', 'top');
      node.setAttribute('data-bs-title', title);
      node.setAttribute('data-bs-content', description);
      node.setAttribute('tabindex', '0');

      new bootstrap.Popover(node, { container: 'body' });
    });
  }
})();
