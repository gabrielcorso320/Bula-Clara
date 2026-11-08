# Verificação em 3 de novembro de 2026

Resultado parcial, não liberação para produção.

- `node --test tests/*.test.mjs`: 4 testes passaram. Rejeição de resposta ilegível; evidência ausente/inventada; retenção de trecho original no contrato/exportação; assinaturas de arquivo.
- `node node_modules/typescript/bin/tsc --noEmit`: passou.
- `node node_modules/vinext/dist/cli.js build`: passou após execução autorizada fora do sandbox. Rota / e APIs /api/analyze e /api/speech compiladas. Vinext mantém aviso de classificação estática desconhecida para /.
- Navegador local: início sem cadastro, logo e layout em viewport estreito; controles de acessibilidade; fonte 110% e contraste mantidos após reload; restaurar; convite de conta e continuar sem conta.
- HTTP local: POST /api/analyze e /api/speech retornam 503 com mensagem de configuração pendente. Nenhuma chamada a provedor foi realizada.

Não testados: câmera física/permissões, upload E2E, Gemini real, conteúdo médico real, SpeechSynthesis audível/móvel, downloads PDF/TXT/MP3, autenticação, RLS, leitor de tela, auditoria completa WCAG, carga e abuso. Os testes unitários não demonstram fidelidade semântica da IA.

Supabase: usuário informou que ainda não possui projeto/URL. Gemini: sem configuração. TTS: não configurado. Auth/histórico e MP3 não implementados; não há migrations nesta entrega parcial. Proteção distribuída e decodificação de imagem no servidor pendentes. A análise está desativada por padrão.

Não houve publicação desta versão. O domínio público continua na versão anterior. Arquivos de planejamento, arquitetura, rastreabilidade e configuração foram adicionados para continuação.
