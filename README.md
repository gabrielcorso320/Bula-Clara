# BulaClara — demonstração interativa

Protótipo para apresentação, com telas responsivas, animações e uma bula fictícia de demonstração. Use **Analisar bula (teste)** para explorar o resumo sem configurar serviços externos. Análise real com Gemini, MP3, autenticação e histórico privado ainda dependem de configuração e implementação.

## Executar

Node.js 22.13+ e pnpm. Execute `pnpm install`, `pnpm dev` e abra o endereço exibido pelo servidor (normalmente http://localhost:3000). Câmera exige HTTPS ou localhost e permissão concedida pelo usuário.

`pnpm test` valida o contrato e rejeição de conteúdo inválido. `pnpm build` compila o Next.js. `pnpm start` inicia o servidor compilado.

## Disponível no código

- Página inicial com celular ilustrativo, ícones interativos e estrelas animadas.
- Câmera real, seleção JPEG/PNG/WebP até 5 MB, prévia, substituição e remoção.
- Fluxo sem cadastro, cancelamento de análise, seções com evidências e comparação.
- Leitura SpeechSynthesis, TXT UTF-8 e PDF pelo diálogo de impressão.
- Resumo com textos maiores e assuntos fechados inicialmente, com um aberto por vez.
- Fonte, contraste de cores e pausa de animações persistidos no dispositivo.
- Demonstração identificada como fictícia, disponível sem chave de API.
- Endpoint Gemini no servidor, desativado por padrão.

Consulte DEPLOYMENT.md para dependências, ARCHITECTURE.md para funcionamento, REQUIREMENTS_TRACEABILITY.md para cobertura e TEST_REPORT.md para evidências. Não coloque chaves em arquivos públicos ou commits. Crie .env.local a partir de .env.example apenas para configuração local.
