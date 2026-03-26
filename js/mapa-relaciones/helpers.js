// Depende de: data.js (ALL_HUS, HU_LINKS, REL_TYPES)

function getRelations(huId) {
  return HU_LINKS
    .filter(l => l.source === huId || l.target === huId)
    .map(l => {
      const isSource = l.source === huId;
      const otherId = isSource ? l.target : l.source;
      return { hu: ALL_HUS.find(h => h.id === otherId), type: l.type, desc: l.desc, isSource };
    })
    .filter(r => r.hu);
}

function dirLabel(type, isSource) {
  const map = {
    alimenta:    [' envía datos a ',    ' recibe datos de '],
    configura:   [' configura a ',      ' es configurada por '],
    complementa: [' complementa a ',    ' complementa a '],
    integra:     [' integra con ',      ' es usada por '],
  };
  return (map[type] || [' → ', ' ← '])[isSource ? 0 : 1];
}
