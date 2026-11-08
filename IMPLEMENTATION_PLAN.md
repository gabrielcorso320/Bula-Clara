# BulaClara 7.0

Fonte: BulaClara_Prompt_Mestre_Codex_7.docx. Evolução do protótipo existente, sem modificar a documentação acadêmica. A versão acadêmica 6.0 não foi localizada; a matriz usa os requisitos explicitados no prompt 7.0.

1. Preservar identidade do Site e histórico Git; extrair logo original.
2. Substituir dados fixos por upload/câmera, prévia e análise solicitada explicitamente.
3. Implementar contrato de resultado validado e integração Gemini no servidor, com falhas honestas quando indisponível.
4. Implementar síntese nativa, exportação TXT/PDF e interface para MP3 real.
5. Aplicar paleta, acessibilidade persistente e navegação por seções.
6. Preparar conta/histórico privados após definição do Supabase e credenciais; não criar usuários automaticamente.
7. Executar testes de contrato e build, documentar limites e validar integrações antes de substituir a publicação.

Dependências externas: Gemini (chave e modelo ativo), TTS (credencial e orçamento), Supabase (projeto/Auth/URL). Nenhuma credencial deve ser enviada ao chat ou incluída no Git. A ativação pública exige limite distribuído de uso e verificação de isolamento do histórico.
