// ============================================================
//  monitor.js — verificação de uptime dos serviços
// ============================================================

const monitorState   = {};   // { id: { status, ms } }
const monitorHistory = [];   // array de eventos para a tabela histórico

// inicializa estado
[...SITES, CALLCENTER_APP].forEach(s => {
  monitorState[s.id] = { status: 'checking', ms: null };
});

// ── Verifica um serviço ───────────────────────────────────────
async function checkService(s) {
  const start = Date.now();
  let status = 'offline';
  let ms     = null;

  try {
    await fetch(s.url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    ms     = Date.now() - start;
    status = ms > CONFIG.slowThreshold ? 'slow' : 'online';
  } catch (e) {
    ms     = Date.now() - start;
    status = ms < 5000 ? 'online' : 'offline';
  }

  const prev = monitorState[s.id]?.status;
  monitorState[s.id] = { status, ms };

  // registra evento se houve mudança
  if (prev && prev !== 'checking' && prev !== status) {
    addHistoryEvent(s.name, prev, status, ms);
  }

  return { id: s.id, status, ms };
}

// ── Verifica todos os serviços ────────────────────────────────
async function checkAllServices() {
  const all = [...SITES, CALLCENTER_APP];
  const results = await Promise.all(all.map(s => checkService(s)));
  return results;
}

// ── Adiciona evento no histórico ──────────────────────────────
function addHistoryEvent(name, prevStatus, newStatus, ms) {
  const ts = new Date();
  monitorHistory.unshift({ ts, name, prevStatus, newStatus, ms });
  if (monitorHistory.length > CONFIG.historyMax) monitorHistory.pop();
  renderHistory();
}

// ── Limpa histórico ───────────────────────────────────────────
function clearHistory() {
  monitorHistory.length = 0;
  renderHistory();
}

// ── Render tabela histórico ───────────────────────────────────
function renderHistory() {
  const tbody = document.getElementById('history-body');
  if (!tbody) return;

  if (monitorHistory.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="ti ti-check"></i> nenhum evento registrado</td></tr>`;
    return;
  }

  const statusLabel = { online: 'online', offline: 'offline', slow: 'lento', checking: 'verificando' };
  const statusClass = { online: 'badge-ok', offline: 'badge-err', slow: 'badge-warn' };

  tbody.innerHTML = monitorHistory.map(e => {
    const time = e.ts.toLocaleTimeString('pt-BR');
    const date = e.ts.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const evtLabel = e.newStatus === 'offline' ? 'ficou offline'
                   : e.newStatus === 'slow'    ? 'ficou lento'
                   : e.newStatus === 'online'  ? 'voltou ao ar'
                   : 'mudou estado';
    return `
      <tr>
        <td class="mono">${date} ${time}</td>
        <td>${e.name}</td>
        <td>${evtLabel}</td>
        <td><span class="badge ${statusClass[e.newStatus] || ''}">${statusLabel[e.newStatus] || e.newStatus}</span></td>
        <td class="mono">${e.ms ? e.ms + 'ms' : '—'}</td>
      </tr>`;
  }).join('');
}
