// ============================================================
//  config.js — edite aqui para adicionar serviços ou mudar URLs
// ============================================================

const CONFIG = {
  refreshInterval: 30000,   // ms entre verificações automáticas
  slowThreshold:   2500,    // ms acima disso = "lento"
  historyMax:      50,      // máx de linhas na tabela de histórico
};

// ── Supabase ─────────────────────────────────────────────────
const SUPABASE = {
  // Projeto 1: Dial Dash / Call Center
  callcenter: {
    url:    'https://iumyrskevtstzleqarxp.supabase.co',
    anon:   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bXlyc2tldnRzdHpsZXFhcnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjE0MDksImV4cCI6MjA5MzU5NzQwOX0.60L_uboJINs8iGKzfP0A2qwLW_P7DJwvE-dM_mD4sXU',
  },
  // Projeto 2: Leads dos sites de captura
  leads: {
    url:    'https://okwqamdrgwbfyncqcide.supabase.co',
    anon:   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rd3FhbWRyZ3diZnluY3FjaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTg4NjksImV4cCI6MjA5NDE5NDg2OX0.g31os5TAoLaEPHyGGTg67r6BmxnoSxemMRklkO3d9zM',
  },
};

// ── Sites monitorados ─────────────────────────────────────────
// "funil" é o valor exato salvo no campo "funil" da tabela leads no Supabase
const SITES = [
  {
    id:    'mrv',
    name:  'Parque Ilhabela MRV',
    url:   'https://parque-ilhabela-m-rv.vercel.app/',
    icon:  'ti-building-community',
    funil: 'funil-01',
  },
  {
    id:    'senior',
    name:  'Ilhabela Sênior',
    url:   'https://ilhabela-senior-4df6.vercel.app/',
    icon:  'ti-building-community',
    funil: 'parque-ilhabela-senior',
  },
  {
  id:    'mcmv',
  name:  'Ilhabela MCMV',
  url:   'https://ilhabela-mcmv.vercel.app/',
  icon:  'ti-building-community',
  funil: 'parque-ilhabela-mcmv',
  },
  {
    id:    'fgts',
    name:  'Ilhabela FGTS',
    url:   'https://ilhabela-fgts.vercel.app/',
    icon:  'ti-building-community',
    funil: 'parque-ilhabela-fgts',
  },
  {
    id:    'urgencia',
    name:  'Ilhabela Urgência',
    url:   'https://ilhabela-urgencia.vercel.app/',
    icon:  'ti-building-community',
    funil: 'parque-ilhabela-urgencia',
  },
];

const CALLCENTER_APP = {
  id:   'callcenter',
  name: 'Dial Dash — Call Center',
  url:  'https://dial-dash-grid-main.vercel.app/home',
  icon: 'ti-headset',
};
