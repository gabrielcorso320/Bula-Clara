export async function POST() {
  return Response.json({error:'A exportação MP3 ainda não está disponível. Use Ouvir para leitura no navegador ou baixe o texto.'},{status:503,headers:{'Cache-Control':'no-store'}});
}
