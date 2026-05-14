// ============================================================
//  supabase.js — todas as queries ao Supabase
// ============================================================

async function sbFetch(project, path) {
  const { url, anon } = SUPABASE[project];
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      'apikey':        anon,
      'Authorization': `Bearer ${anon}`,
      'Content-Type':  'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase ${project} erro ${res.status}`);
  return res.json();
}

// ── Leads totais (projeto okwqamdrgwbfyncqcide) ───────────────
async function fetchTotalLeads() {
  // Conta todos os leads da tabela leads
  const res = await fetch(
    `${SUPABASE.leads.url}/rest/v1/leads?select=id`,
    {
      headers: {
        'apikey':        SUPABASE.leads.anon,
        'Authorization': `Bearer ${SUPABASE.leads.anon}`,
        'Prefer':        'count=exact',
        'Range':         '0-0',
      },
    }
  );
  const range = res.headers.get('content-range') || '';
  const total = parseInt(range.split('/')[1]) || 0;
  const lastMod = res.headers.get('date') || null;
  return { total, lastMod };
}

// ── Leads por origem (campo "origem" da tabela leads) ─────────
async function fetchLeadsByOrigin() {
  // Puxa campo "origem" de todos os leads para contar por site
  const data = await sbFetch('leads', 'leads?select=origem,created_at&order=created_at.desc&limit=5000');
  const counts = {};
  let lastCreated = null;

  data.forEach(row => {
    const key = (row.origem || 'sem_origem').toLowerCase().trim();
    counts[key] = (counts[key] || 0) + 1;
    if (!lastCreated || row.created_at > lastCreated) lastCreated = row.created_at;
  });

  return { counts, lastCreated, total: data.length };
}

// ── Leads do call center (projeto iumyrskevtstzleqarxp) ───────
async function fetchCallCenterLeads() {
  const res = await fetch(
    `${SUPABASE.callcenter.url}/rest/v1/leads?select=id,status,created_at&order=created_at.desc&limit=5000`,
    {
      headers: {
        'apikey':        SUPABASE.callcenter.anon,
        'Authorization': `Bearer ${SUPABASE.callcenter.anon}`,
        'Prefer':        'count=exact',
        'Range':         '0-0',
      },
    }
  );
  // conta exata
  const range = res.headers.get('content-range') || '';
  const total = parseInt(range.split('/')[1]) || 0;
  return { total };
}

// ── Chamadas de hoje ──────────────────────────────────────────
async function fetchCallsToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const iso = today.toISOString();

  const res = await fetch(
    `${SUPABASE.callcenter.url}/rest/v1/calls?select=id,outcome,started_at&started_at=gte.${iso}`,
    {
      headers: {
        'apikey':        SUPABASE.callcenter.anon,
        'Authorization': `Bearer ${SUPABASE.callcenter.anon}`,
        'Prefer':        'count=exact',
        'Range':         '0-9999',
      },
    }
  );
  const data = await res.json();
  const range = res.headers.get('content-range') || '';
  const total = parseInt(range.split('/')[1]) || data.length || 0;

  // conta por outcome
  const byOutcome = {};
  if (Array.isArray(data)) {
    data.forEach(c => {
      const k = c.outcome || 'sem_outcome';
      byOutcome[k] = (byOutcome[k] || 0) + 1;
    });
  }

  // última ligação
  let lastCall = null;
  if (Array.isArray(data) && data.length > 0) {
    lastCall = data.sort((a, b) => b.started_at > a.started_at ? 1 : -1)[0].started_at;
  }

  return { total, byOutcome, lastCall };
}

// ── Última atualização dos bancos ─────────────────────────────
async function fetchLastUpdates() {
  // último lead capturado (banco leads)
  const leadsData = await sbFetch('leads', 'leads?select=created_at&order=created_at.desc&limit=1');
  const lastLead = leadsData[0]?.created_at || null;

  // último lead atualizado (banco callcenter)
  const ccData = await sbFetch('callcenter', 'leads?select=updated_at&order=updated_at.desc&limit=1');
  const lastCC = ccData[0]?.updated_at || null;

  return { lastLead, lastCC };
}
