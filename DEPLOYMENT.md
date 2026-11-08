# Configuração e publicação

A versão pública é uma demonstração interativa. O botão **Analisar bula (teste)** usa uma bula fictícia local. A análise real deve permanecer desativada até concluir as dependências e verificar as integrações abaixo.

1. Criar projeto Supabase; obter URL pública e publishable key. Configurar Auth e URLs de redirecionamento. Não enviar service_role ao chat nem ao cliente. Implementar migrations e políticas RLS com auth.uid() antes do histórico; testar isolamento entre dois usuários, visitante e exclusão.
2. Criar chave Gemini no Google AI Studio e escolher modelo ativo com visão e saída estruturada. Configurar GEMINI_API_KEY e GEMINI_MODEL somente nas variáveis do servidor Vercel (ou .env.local ignorado localmente). Não basta ativar ANALYSIS_ENABLED.
3. Configurar rate limit distribuído por origem confiável, limite global, quotas do provedor e teto de gasto. Validar imagens no servidor. Só então permitir ANALYSIS_ENABLED=true.
4. Selecionar TTS com MP3, aprovar orçamento e configurar credencial privada; implementar geração e testar arquivo reproduzível. SpeechSynthesis não fornece MP3.
5. Executar testes, build e E2E em HTTPS: câmera concedida/negada, análise, áudio, impressão/PDF, TXT, MP3, auth/histórico e RLS. Publicar apenas após validação apropriada.

Custos: consumo variável de Gemini e TTS, hospedagem e plano Supabase conforme uso. Nenhum plano pago foi contratado e nenhuma API paga foi ativada neste trabalho.

Referências técnicas: https://ai.google.dev/gemini-api/docs/structured-output e https://ai.google.dev/api/generate-content ; https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize

## Publicação da demonstração na Vercel

Importe o repositório GitHub `gabrielcorso320/Bula-Clara` na sua conta Vercel, com o nome de projeto `bula-clara`. Use a raiz do repositório e o preset Next.js, com `pnpm build` como comando de compilação. A demonstração funciona sem variáveis de ambiente. O endereço é definido pela Vercel conforme a disponibilidade do nome. Após conectar o GitHub, novos envios para `main` atualizam a publicação.
