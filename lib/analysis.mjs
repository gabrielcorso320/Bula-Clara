export const missing = 'Não identificado na imagem enviada';
export const titles = ['Contraindicações', 'Cuidados e advertências', 'Possíveis efeitos adversos', 'Para que serve'];
export function validateResult(value) {
  if (!value || typeof value !== 'object' || typeof value.original !== 'string' || value.original.length < 20 || value.original.length > 40000 || typeof value.name !== 'string' || value.name.length > 200 || !Array.isArray(value.sections)) throw new Error('Não foi possível ler a bula com segurança. Envie uma imagem mais nítida.');
  const sections = titles.map(title => {
    const section = value.sections.find(s => s?.title === title);
    if (!section || typeof section.text !== 'string' || typeof section.evidence !== 'string' || !section.evidence.trim() || !value.original.includes(section.evidence)) return {title, text: missing, evidence: ''};
    if (section.text.length > 5000) throw new Error('Resposta fora do limite.');
    return {title, text: section.text, evidence: section.evidence};
  });
  return {name:value.name.trim() || missing, original:value.original, sections, date:new Date().toISOString()};
}
export function textExport(result) {
  const demo = result.source === 'demo';
  const heading = demo ? 'Demonstração · bula fictícia' : 'Análise da imagem enviada';
  const summary = demo ? `Resumo\n${result.summary}\n\n` : '';
  const originalHeading = demo ? 'Texto da bula fictícia' : 'Texto original extraído';
  return `${result.name}\n${heading} • ${new Date(result.date).toLocaleDateString('pt-BR')}\n\n${summary}${result.sections.map(s => `${s.title}\n${s.text}\nFonte: ${s.evidence || missing}`).join('\n\n')}\n\n${originalHeading}\n${result.original}\n\nInformativo. Não substitui a bula integral nem orientação profissional.`;
}
export function imageMime(bytes) {
  if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return 'image/jpeg';
  if ([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)) return 'image/png';
  if (String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP') return 'image/webp';
  throw new Error('Envie uma imagem JPEG, PNG ou WebP válida.');
}
