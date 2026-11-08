# Rastreabilidade 7.0

A documentação acadêmica 6.0 não está disponível. IDs RF abaixo seguem o documento mestre 7.0; RNF01–RNF06 não podem ser mapeados individualmente sem o texto original. Não confundir esta matriz provisória com validação acadêmica completa.

| Requisito | Implementação | Validação / pendência |
|---|---|---|
| RF01 | Seleção, câmera real, prévia, remover/substituir, endpoint Gemini | Código implementado; câmera física e Gemini não validados; chave/modelo ausentes; decodificação backend e limite distribuído pendentes |
| RF02/RF03 | Resultado estruturado com evidências; ausência marcada sem completar lacunas | Contrato coberto por testes; conteúdo real ainda não validado |
| RF04 | SpeechSynthesis iniciar/pausar/retomar/parar/velocidade por seção | Implementado; compatibilidade móvel e áudio real não verificados |
| RF05 | Fonte, contraste, preferências locais, foco, labels, diálogo nativo | Implementado; auditoria WCAG/leitor de tela pendente |
| RF06 | TXT real; PDF pelo diálogo de impressão | Código implementado; exportação manual a verificar. MP3 bloqueado por TTS não configurado |
| RF07 | Nova consulta e encerramento com cancelamento/limpeza | Implementado; teste E2E pendente |
| RF08 | Seções expansíveis/recolhíveis | Implementado com details/summary |
| RF09 | Original, simplificado, comparação por seção | Implementado; evidência real depende do Gemini |
| Conta opcional | Convite sem bloqueio do fluxo | Auth, recuperação, exclusão e histórico não implementados; projeto Supabase inexistente |
| Segurança/privacidade | Segredos servidor, origem, limites de corpo, sem persistir bulas | RLS, rate limit distribuído, quotas e auditoria de dependências pendentes |
| RNF01–RNF06 | Mapeamento exato indisponível | Necessária documentação acadêmica 6.0 |
