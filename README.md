# 🏢 Central de Operações — Ilhabela v2

Dashboard de monitoramento completo com dados reais do Supabase.

## Funcionalidades

- ✅ Status em tempo real de todos os serviços (uptime/lento/offline)
- ✅ Contagem de leads capturados (direto do Supabase)
- ✅ Ligações do call center hoje + breakdown por outcome
- ✅ Última atualização de cada banco de dados
- ✅ Tabela de histórico com horário exato de cada queda/retorno
- ✅ Dark mode automático
- ✅ Atualização a cada 30 segundos

## Estrutura

```
ops-dashboard/
├── index.html    estrutura da página
├── style.css     estilos e temas (light/dark)
├── config.js     URLs e chaves — edite aqui
├── supabase.js   queries ao banco de dados
├── monitor.js    verificação de uptime
├── app.js        orquestração e renderização
└── README.md
```

## Como atualizar as chaves do Supabase

Abra `config.js` e edite o objeto `SUPABASE`:

```js
const SUPABASE = {
  callcenter: {
    url:  'https://SEU-PROJETO.supabase.co',
    anon: 'eyJhbGci...',
  },
  leads: {
    url:  'https://SEU-OUTRO-PROJETO.supabase.co',
    anon: 'eyJhbGci...',
  },
};
```

## Como adicionar um novo site monitorado

Abra `config.js` e adicione no array `SITES`:

```js
{
  id:   'novo-site',
  name: 'Nome do Site',
  url:  'https://meusite.vercel.app/',
  icon: 'ti-world',
  tag:  'origem_no_supabase',  // valor do campo "origem" na tabela leads
},
```

## Deploy no GitHub Pages

1. Faça push de todos os arquivos para o repositório
2. Vá em Settings → Pages → Source: main / root
3. Salve — em 2 min o dashboard estará no ar
