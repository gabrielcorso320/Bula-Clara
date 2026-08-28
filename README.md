# BulaClara

Protótipo interativo e responsivo para demonstrar uma experiência de leitura simplificada de bulas de medicamentos.

> Projeto exclusivamente demonstrativo. Não realiza OCR, autenticação, diagnóstico ou aconselhamento médico real.

## Como funciona

- Login e cadastro simulados: qualquer e-mail com formato válido e qualquer senha são aceitos.
- Captura e envio de imagem simulados, sem solicitar acesso real à câmera.
- Processamento animado com resultado demonstrativo de Paracetamol 500 mg.
- Modos de leitura detalhado e simplificado.
- Player de áudio, histórico, favoritos, ajuda, perfil e acessibilidade simulados.
- Nenhum dado é enviado ou armazenado em servidor.

## Requisitos

- Node.js 22.13 ou superior
- pnpm

## Executar localmente

```bash
git clone URL_DO_REPOSITORIO
cd bulaclara
pnpm install
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

## Gerar a versão de produção

```bash
pnpm build
pnpm start
```

## Tecnologias

- React 19
- TypeScript
- Vinext/Vite
- Tailwind CSS
- Lucide Icons
- Componentes shadcn
