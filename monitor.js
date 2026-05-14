// ===== Configuração dos Serviços =====
// Edite aqui para adicionar ou remover serviços monitorados
const SERVICES = [
  // Sites de captura de lead
  {
    id: 'lead1',
    group: 'lead-sites-grid',
    name: 'Parque Ilhabela MRV',
    url: 'https://parque-ilhabela-m-rv.vercel.app/',
    icon: 'ti-building-community',
  },
  {
    id: 'lead2',
    group: 'lead-sites-grid',
    name: 'Ilhabela Sênior',
    url: 'https://ilhabela-senior-4df6.vercel.app/',
    icon: 'ti-building-community',
  },
  {
    id: 'lead3',
    group: 'lead-sites-grid',
    name: 'Ilhabela FGTS',
    url: 'https://ilhabela-fgts.vercel.app/',
    icon: 'ti-building-community',
  },
  {
    id: 'lead4',
    group: 'lead-sites-grid',
    name: 'Ilhabela Urgência',
    url: 'https://ilhabela-urgencia.vercel.app/',
    icon: 'ti-building-community',
  },
  // App Call Center
  {
    id: 'callcenter',
    group: 'callcenter-grid',
    name: 'Dial Dash — Call Center',
    url: 'https://dial-dash-grid-main.vercel.app/home',
    icon: 'ti-headset',
  },
  // Infraestrutura Supabase
  {
    id: 'supa1',
    group: 'infra-grid',
    name: 'Supabase Projeto 1',
    url: 'https://iumyrskevtstzleqarxp.supabase.co',
    icon: 'ti-database',
  },
  {
    id: 'supa2',
    group: 'infra-grid',
    name: 'Supabase Projeto 2',
    url: 'https://okwqamdrgwbfyncqcide.supabase.co',
    icon: 'ti-database',
  },
];

// ===== Configurações =====
const CONFIG = {
  refreshInterval: 30000,   // ms entre verificações automáticas (30s)
  slowThreshold: 2500,      // ms acima disso = "lento"
  historyLength: 30,        // quantos checkpoints guardar na barra de uptime
};

// ===== Estado =====
const state = {};
const history = {};

SERVICES.forEach(s => {
  state[s.id] = { status: 'checking', ms: null };
  history[s.id] = Array(CONFIG.historyLength).fill('ok');
});

// ===== Helpers =====
function pillLabel(status) {
  return { online: 'online', offline: 'offline', slow: 'lento', checking: 'verificando...' }[status] || status;
}

function genUptimeBar(id) {
  return history[id].map(v => `<div class="uptime-seg ${v}"></div>`).join('');
}

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ===== Renderização =====
function renderCard(s) {
  const st = state[s.id];
  const shortUrl = s.url.replace(/^https?:\/\//, '');
  return `
    <a class="service-card" id="card-${s.id}" href="${s.url}" target="_blank" rel="noopener" onclick="event.preventDefault(); window.open('${s.url}', '_blank')">
      <div class="service-header">
        <div class="service-name">
          <i class="ti ${s.icon}" aria-hidden="true"></i>
          ${s.name}
        </div>
        <div class="status-pill ${st.status}" id="pill-${s.id}">
          <span class="status-dot"></span>
          <span id="pill-label-${s.id}">${pillLabel(st.status)}</span>
        </div>
      </div>
      <div class="service-meta">
        <span class="service-url" title="${shortUrl}">${shortUrl}</span>
        <span class="response-time">resposta: <strong id="ms-${s.id}">${st.ms ? st.ms + 'ms' : '—'}</strong></span>
      </div>
      <div class="uptime-bar" id="bar-${s.id}">${genUptimeBar(s.id)}</div>
    </a>`;
}

function buildGrids() {
  const groups = {};
  SERVICES.forEach(s => {
    if (!groups[s.group]) groups[s.group] = '';
    groups[s.group] += renderCard(s);
  });
  Object.entries(groups).forEach(([gid, html]) => {
    const el = document.getElementById(gid);
    if (el) el.innerHTML = html;
  });
}

function updateCard(s) {
  const st = state[s.id];
  const pill = document.getElementById(`pill-${s.id}`);
  const label = document.getElementById(`pill-label-${s.id}`);
  const msEl = document.getElementById(`ms-${s.id}`);
  const bar = document.getElementById(`bar-${s.id}`);
  if (pill) pill.className = `status-pill ${st.status}`;
  if (label) label.textContent = pillLabel(st.status);
  if (msEl) msEl.textContent = st.ms ? `${st.ms}ms` : '—';
  if (bar) bar.innerHTML = genUptimeBar(s.id);
}

function updateSummary() {
  const online = SERVICES.filter(s => state[s.id].status === 'online').length;
  const issues = SERVICES.filter(s => ['offline', 'slow'].includes(state[s.id].status)).length;
  const times = SERVICES.map(s => state[s.id].ms).filter(Boolean);
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const upPct = Math.round((online / SERVICES.length) * 100);

  document.getElementById('count-online').textContent = online;
  document.getElementById('count-issues').textContent = issues;
  document.getElementById('avg-response').textContent = avg ? `${avg}ms` : '—';
  document.getElementById('uptime-pct').textContent = `${upPct}%`;
  document.getElementById('count-total').textContent = SERVICES.length;
  document.getElementById('count-issues').className = `metric-value ${issues > 0 ? 'err' : 'ok'}`;
}

// ===== Log de Eventos =====
function addLog(msg, type) {
  const log = document.getElementById('incident-log');
  const empty = log.querySelector('.incident-empty');
  if (empty) empty.remove();

  const icons = { ok: 'ti-circle-check', warn: 'ti-alert-triangle', err: 'ti-circle-x' };
  const colors = { ok: 'var(--green)', warn: 'var(--amber)', err: 'var(--red)' };

  const item = document.createElement('div');
  item.className = 'incident-item';
  item.innerHTML = `
    <i class="ti ${icons[type]} incident-icon" style="color:${colors[type]}" aria-hidden="true"></i>
    <span class="incident-text">${msg}</span>
    <span class="incident-time">${now()}</span>`;
  log.appendChild(item);

  // Mantém no máximo 20 itens
  const items = log.querySelectorAll('.incident-item');
  if (items.length > 20) items[0].remove();
}

function clearLog() {
  const log = document.getElementById('incident-log');
  log.innerHTML = `
    <div class="incident-empty">
      <i class="ti ti-check" aria-hidden="true"></i>
      nenhum evento registrado ainda
    </div>`;
}

// ===== Verificação de Serviço =====
async function checkService(s) {
  const start = Date.now();
  let status = 'offline';
  let ms = null;

  try {
    await fetch(s.url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    ms = Date.now() - start;
    status = ms > CONFIG.slowThreshold ? 'slow' : 'online';
  } catch (e) {
    ms = Date.now() - start;
    // no-cors fetch pode jogar erro mesmo quando online; usamos timeout como critério
    status = ms < 5000 ? 'online' : 'offline';
  }

  const prev = state[s.id].status;
  state[s.id] = { status, ms };
  history[s.id].shift();
  history[s.id].push(status === 'online' ? 'ok' : status === 'slow' ? 'slow' : 'err');

  // Registra mudanças de estado
  if (prev !== 'checking' && prev !== status) {
    if (status === 'offline') addLog(`${s.name} ficou offline`, 'err');
    else if (status === 'slow') addLog(`${s.name} está respondendo lento (${ms}ms)`, 'warn');
    else if (status === 'online') addLog(`${s.name} voltou ao ar`, 'ok');
  }

  updateCard(s);
  updateSummary();
}

// ===== Loop Principal =====
async function runChecks() {
  const btn = document.getElementById('refresh-btn');
  const icon = document.getElementById('refresh-icon');

  btn.disabled = true;
  icon.className = 'ti ti-refresh spinner';

  // Marca todos como "verificando"
  SERVICES.forEach(s => { state[s.id].status = 'checking'; updateCard(s); });

  // Verifica todos em paralelo
  await Promise.all(SERVICES.map(s => checkService(s)));

  const t = now();
  const lastCheckEl = document.getElementById('last-check-side');
  if (lastCheckEl) lastCheckEl.textContent = t;

  btn.disabled = false;
  icon.className = 'ti ti-refresh';
}

// ===== Init =====
buildGrids();
runChecks();
setInterval(runChecks, CONFIG.refreshInterval);
