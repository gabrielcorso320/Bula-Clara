# Arquitetura 7.0 em preparação

Vinext/React e hospedagem Sites mantidos. A UI em app/page.tsx controla uma consulta efêmera, sem conta automática. Imagens são URLs de objeto locais revogadas ao trocar/remover; a câmera usa getUserMedia e encerra tracks ao desmontar. Só Analisar envia a imagem.

POST /api/analyze valida origem, limite do corpo, MIME declarado e assinatura binária; envia a imagem ao Gemini no servidor, com timeout e cancelamento. lib/analysis.mjs valida a estrutura, limita texto e rejeita evidências que não aparecem no original. Isso não comprova fidelidade semântica do modelo: exige avaliação real antes de liberar.

ANALYSIS_ENABLED permanece false até instalar proteção distribuída contra abuso e configurar quotas. A validação de assinatura não é decodificação completa do arquivo no servidor; endurecimento do upload é pendente.

Áudio: SpeechSynthesis pt-BR no navegador. TXT: Blob UTF-8. PDF: diálogo de impressão com CSS específico, usando Salvar como PDF. MP3: indisponível; rota retorna 503 honestamente.

Preferências visuais ficam em localStorage. Nenhuma bula/histórico é armazenada. Conta, recuperação de senha e histórico/RLS aguardam um projeto Supabase real. Não há autenticação caseira, tabela pública ou credencial no frontend.
