/* ============================================================
   HSW Digital — Workforce Page
   page-workforce.js — Enterprise workforce tracking
   ============================================================ */

let _wfSearch = '';
let _wfStatus = 'all';

window.renderWorkforce = function () {
  const workers = DB.workers;
  const compliant = workers.filter(w => w.complianceStatus === 'Compliant').length;
  const expiring = workers.filter(w => w.complianceStatus === 'Expiring').length;
  const nonCompliant = workers.filter(w => w.complianceStatus === 'Non-Compliant').length;

  const container = document.getElementById('page-container');
  container.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Workforce Management</div>
        <div class="page-subtitle">Worker profiles, certifications, inductions, and compliance status</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="exportToCSV('workforce')">Export</button>
        <button class="btn btn-primary" onclick="showToast('Add Worker — coming soon','info')">+ Add Worker</button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-4" style="margin-bottom:20px">
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:var(--primary-light);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--primary)">${workers.length}</div>
        <div style="font-size:12px;font-weight:600;color:var(--text-muted)">Total Workers</div>
      </div>
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:var(--success-bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--success)">${compliant}</div>
        <div style="font-size:12px;font-weight:600;color:var(--text-muted)">Compliant</div>
      </div>
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:var(--warning-bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--warning)">${expiring}</div>
        <div style="font-size:12px;font-weight:600;color:var(--text-muted)">Expiring Soon</div>
      </div>
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:var(--danger-bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--danger)">${nonCompliant}</div>
        <div style="font-size:12px;font-weight:600;color:var(--text-muted)">Non-Compliant</div>
      </div>
    </div>

    <div class="card">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="table-toolbar-start">
          <div class="search-bar" style="width:260px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="wf-search" placeholder="Search workers…" oninput="_wfSearch=this.value;renderWFTable()">
          </div>
        </div>
        <div class="filters-bar" style="padding:0;border:none;background:transparent">
          ${['all', 'Compliant', 'Expiring', 'Non-Compliant'].map(s => `
            <div class="filter-chip ${_wfStatus === s.toLowerCase() || (_wfStatus === 'all' && s === 'all') ? 'active' : ''}" onclick="_wfStatus='${s.toLowerCase()}';renderWFTable()">${s === 'all' ? 'All' : s}</div>`).join('')}
        </div>
      </div>

      <div class="table-container" id="wf-table-wrap">
        ${buildWFTable()}
      </div>
    </div>
  </div>`;
};

function buildWFTable() {
  let list = [...DB.workers];
  if (APP_STATE.currentBU) {
    const buContractors = DB.contractors.filter(c => c.buId === APP_STATE.currentBU).map(c => c.id);
    list = list.filter(w => buContractors.includes(w.contractorId));
  }
  if (_wfSearch) {
    const q = _wfSearch.toLowerCase();
    list = list.filter(w => w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q));
  }
  if (_wfStatus !== 'all') list = list.filter(w => w.complianceStatus.toLowerCase() === _wfStatus);

  if (!list.length) return `<div class="empty-state"><div class="empty-title">No workers found</div></div>`;

  return `<table class="data-table">
    <thead><tr>
      <th>Worker</th><th>Role</th><th>Contractor</th><th>Project</th>
      <th>Certifications</th><th>Cert Expiry</th><th>Status</th>
    </tr></thead>
    <tbody>
      ${list.map(w => {
    const contractor = DB.contractors.find(c => c.id === w.contractorId);
    const project = DB.projects.find(p => p.id === w.project);
    const expired = isExpired(w.expiryDate);
    const expiring = isExpiringSoon(w.expiryDate, 30);
    return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="user-avatar" style="background:var(--primary);width:30px;height:30px;font-size:9px">${w.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div>
                <div style="font-weight:600;font-size:13px">${w.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${w.idNum}</div>
              </div>
            </div>
          </td>
          <td>${w.role}</td>
          <td>
            ${contractor ? `<span onclick="navigateTo('contractor-profile',{id:'${contractor.id}'})" style="color:var(--primary);cursor:pointer;font-weight:500;font-size:12px">${contractor.name}</span>` : '—'}
          </td>
          <td style="font-size:12px">${project ? project.name : '—'}</td>
          <td><div style="display:flex;flex-wrap:wrap;gap:4px">${w.certifications.slice(0, 4).map(cert => `<span style="display:inline-block;padding:2px 8px;border-radius:20px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;font-size:10px;font-weight:600;white-space:nowrap">${cert}</span>`).join('')}${w.certifications.length > 4 ? `<span style="display:inline-block;padding:2px 8px;border-radius:20px;background:#F1F5F9;color:#64748B;border:1px solid #E2E8F0;font-size:10px;font-weight:600">+${w.certifications.length - 4}</span>` : ''}</div></td>
          <td>
            <div style="font-size:12px;font-weight:600;color:${expired ? 'var(--danger)' : expiring ? 'var(--warning)' : 'var(--text-primary)'}">${fmtDate(w.expiryDate)}</div>
            ${expired ? '<div style="font-size:10px;color:var(--danger);font-weight:700">EXPIRED</div>' : expiring ? `<div style="font-size:10px;color:var(--warning);font-weight:700">Expires in ${daysUntil(w.expiryDate)}d</div>` : ''}
          </td>
          <td><span class="badge ${getStatusBadge(w.complianceStatus)}">${w.complianceStatus}</span></td>
        </tr>`;
  }).join('')}
    </tbody>
  </table>`;
}

function renderWFTable() {
  const el = document.getElementById('wf-table-wrap');
  if (el) el.innerHTML = buildWFTable();
}
