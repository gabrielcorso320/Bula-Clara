// A classroom exhibit. The copy is authored locally and is never sent for analysis.
const sections = [
  {
    title: 'Para que serve',
    evidence: 'No cenário fictício desta bula, Brisália destina-se ao alívio da sensação de garganta seca.',
    text: 'Neste exemplo, Brisália teria a função de aliviar a sensação de garganta seca.',
  },
  {
    title: 'Apresentação',
    evidence: 'A apresentação ilustrada consiste em pastilhas acondicionadas em embalagem identificada por uma faixa azul.',
    text: 'O produto imaginário aparece como pastilhas em uma caixa com faixa azul.',
  },
  {
    title: 'Cuidados',
    evidence: 'Este material é exclusivamente didático. Não existe formulação real nem posologia definida para Brisália.',
    text: 'Brisália foi inventado para esta apresentação. Não existe dose ou modo de usar.',
  },
];

export function createDemoResult() {
  return {
    source: 'demo' as const,
    name: 'Brisália',
    summary: 'Neste exemplo, Brisália é uma pastilha para garganta seca.\n\nBrisália foi criada só para esta demonstração. Não existe dose nem modo de usar.',
    original: sections.map(({ title, evidence }) => title + '\n' + evidence).join('\n\n'),
    sections,
    date: new Date().toISOString(),
  };
}
