# 🏢 Central de Operações — Ilhabela

Dashboard de monitoramento em tempo real para todos os serviços da operação Ilhabela.

## O que ele monitora

| Serviço | URL |
|---------|-----|
| Parque Ilhabela MRV | https://parque-ilhabela-m-rv.vercel.app/ |
| Ilhabela Sênior | https://ilhabela-senior-4df6.vercel.app/ |
| Ilhabela FGTS | https://ilhabela-fgts.vercel.app/ |
| Ilhabela Urgência | https://ilhabela-urgencia.vercel.app/ |
| Dial Dash (Call Center) | https://dial-dash-grid-main.vercel.app/home |
| Supabase Projeto 1 | https://iumyrskevtstzleqarxp.supabase.co |
| Supabase Projeto 2 | https://okwqamdrgwbfyncqcide.supabase.co |

## Funcionalidades

- ✅ Verificação automática a cada 30 segundos
- ✅ Indicadores de status: online / offline / lento
- ✅ Tempo de resposta em ms para cada serviço
- ✅ Barra de histórico de uptime (últimas 30 verificações)
- ✅ Log de eventos com registro de quedas e recuperações
- ✅ Resumo geral: total online, problemas, tempo médio, uptime %
- ✅ Dark mode automático
- ✅ Responsivo para mobile

## Estrutura

```
ops-dashboard/
├── index.html   # estrutura da página
├── style.css    # estilos e temas (light/dark)
├── monitor.js   # lógica de verificação e atualização
└── README.md
```

## Como hospedar no GitHub Pages

1. Crie um repositório no GitHub (pode ser privado ou público)
2. Faça upload dos 3 arquivos: `index.html`, `style.css`, `monitor.js`
3. Vá em **Settings → Pages**
4. Em **Source**, selecione `main` e pasta `/ (root)`
5. Clique em **Save**
6. Em alguns minutos o dashboard estará em: `https://SEU-USUARIO.github.io/ops-dashboard/`

## Como adicionar um novo serviço

Abra `monitor.js` e adicione um objeto no array `SERVICES`:

```js
{
  id: 'meu-site',           // identificador único
  group: 'lead-sites-grid', // grade onde vai aparecer
  name: 'Meu Novo Site',    // nome exibido
  url: 'https://meusite.vercel.app/',
  icon: 'ti-world',         // ícone Tabler (https://tabler.io/icons)
},
```

### Grupos disponíveis
- `lead-sites-grid` — sites de captura de lead
- `callcenter-grid` — app call center
- `infra-grid` — infraestrutura (banco de dados, etc.)

## Como ajustar a frequência de verificação

Em `monitor.js`, edite o objeto `CONFIG`:

```js
const CONFIG = {
  refreshInterval: 30000,  // 30s — mude para 60000 para 1 minuto
  slowThreshold: 2500,     // ms acima disso = "lento"
  historyLength: 30,       // checkpoints na barra de uptime
};
```

## Tecnologias

- HTML/CSS/JS puro — sem frameworks, sem dependências de build
- [Tabler Icons](https://tabler.io/icons) — ícones via webfont
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) — tipografia
- Fetch API com `mode: no-cors` para verificação de disponibilidade
