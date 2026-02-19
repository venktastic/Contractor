/* ============================================================
   HSW Digital — Contractors Page
   contractors.js — Full enterprise contractor list with filter/sort/export
   ============================================================ */

let _contractorsState = {
  search: '',
  status: 'all',
  risk: 'all',
  page: 1,
  perPage: 8,
  sort: 'riskScore',
  sortDir: 'desc'
};

window.renderContractors = function () {
  const c = document.getElementById('page-container');
  c.innerHTML = buildContractorsHTML();
};

window.initContractors = function () {
  const input = document.getElementById('contractors-search');
  if (input) input.addEventListener('input', e => {
    _contractorsState.search = e.target.value;
    _contractorsState.page = 1;
    refreshContractors();
  });
};

function buildContractorsHTML() {
  const role = APP_STATE.currentRole;
  const canApprove = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role);
  return `
  <div class="page" style="padding-bottom:0">
    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Contractors</div>
        <div class="page-subtitle">Manage and monitor contractor risk profiles across all business units</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="exportToCSV('contractors')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export</button>
        ${canApprove ? `<button class="btn btn-primary" onclick="navigateTo('onboarding')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Contractor</button>` : ''}
      </div>
    </div>

    <!-- Summary Cards Row -->
    <div class="grid grid-4" style="margin-bottom:16px">
      ${[
      { label: 'Total Contractors', val: DB.contractors.length, color: 'var(--primary)', bg: 'var(--primary-light)' },
      { label: 'Approved', val: DB.contractors.filter(c => c.status === 'Approved').length, color: 'var(--success)', bg: 'var(--success-bg)' },
      { label: 'High / Critical', val: DB.contractors.filter(c => ['High', 'Critical'].includes(c.riskLevel)).length, color: 'var(--danger)', bg: 'var(--danger-bg)' },
      { label: 'Require Action', val: DB.contractors.filter(c => c.overdueActions > 0 || c.status === 'Suspended').length, color: 'var(--warning)', bg: 'var(--warning-bg)' }
    ].map(s => `
        <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
          <div style="width:42px;height:42px;border-radius:10px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <div style="font-size:20px;font-weight:900;color:${s.color}">${s.val}</div>
          </div>
          <div style="font-size:12px;font-weight:600;color:var(--text-muted)">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Table Card -->
    <div class="card">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="table-toolbar-start">
          <div class="search-bar" style="width:260px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="contractors-search" placeholder="Search contractors…" value="${_contractorsState.search}">
          </div>
        </div>
        <div class="table-toolbar-end">
          <span class="table-count" id="contractor-count">Loading…</span>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="filters-bar">
        <span style="font-size:12px;font-weight:600;color:var(--text-muted);margin-right:4px">Status:</span>
        ${['all', 'Approved', 'Under Review', 'Draft', 'Suspended'].map(s => `
          <div class="filter-chip ${_contractorsState.status === s.toLowerCase() || (_contractorsState.status === 'all' && s === 'all') ? 'active' : ''}"
            onclick="setContractorFilter('status','${s.toLowerCase()}')">
            ${s === 'all' ? 'All' : s}
          </div>`).join('')}
        <div class="topbar-divider" style="margin:0 6px"></div>
        <span style="font-size:12px;font-weight:600;color:var(--text-muted);margin-right:4px">Risk:</span>
        ${['all', 'Low', 'Medium', 'High', 'Critical'].map(r => `
          <div class="filter-chip ${_contractorsState.risk === r.toLowerCase() ? 'active' : ''}"
            onclick="setContractorFilter('risk','${r.toLowerCase()}')">
            ${r === 'all' ? 'All' : r}
          </div>`).join('')}
      </div>

      <!-- Table -->
      <div class="table-container" id="contractors-table-body">
        ${buildContractorsTable()}
      </div>

    </div>
  </div>`;
}

function buildContractorsTable() {
  let list = [...DB.contractors];

  // Filter
  if (APP_STATE.currentBU) list = list.filter(c => c.buId === APP_STATE.currentBU);
  if (_contractorsState.search) {
    const q = _contractorsState.search.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.scopeOfWork.some(s => s.toLowerCase().includes(q)));
  }
  if (_contractorsState.status !== 'all') list = list.filter(c => c.status.toLowerCase() === _contractorsState.status);
  if (_contractorsState.risk !== 'all') list = list.filter(c => c.riskLevel.toLowerCase() === _contractorsState.risk);

  // Sort
  list.sort((a, b) => {
    let va = a[_contractorsState.sort] ?? 0;
    let vb = b[_contractorsState.sort] ?? 0;
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
    if (va < vb) return _contractorsState.sortDir === 'asc' ? -1 : 1;
    if (va > vb) return _contractorsState.sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Update count
  setTimeout(() => {
    const el = document.getElementById('contractor-count');
    if (el) el.textContent = `${list.length} contractor${list.length !== 1 ? 's' : ''}`;
  }, 0);

  // Paginate
  const pg = paginate(list, _contractorsState.page, _contractorsState.perPage);

  if (pg.items.length === 0) return `
    <div class="empty-state">
      <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
      <div class="empty-title">No contractors found</div>
      <div class="empty-body">Try adjusting your search or filters</div>
    </div>`;

  const cols = [
    { key: 'name', label: 'Contractor' },
    { key: 'status', label: 'Status' },
    { key: 'riskLevel', label: 'Risk Level' },
    { key: 'compliancePercent', label: 'Compliance' },
    { key: 'ifr', label: 'IFR' },
    { key: 'overdueActions', label: 'Overdue' },
    { key: 'workerCount', label: 'Workers' },
    { key: 'reviewDue', label: 'Review Due' },
    { key: '-', label: 'Actions' }
  ];

  return `
  <table class="data-table">
    <thead><tr>
      ${cols.map(col => col.key !== '-' ? `
      <th onclick="sortContractors('${col.key}')" class="${_contractorsState.sort === col.key ? 'sort-active' : ''}">
        ${col.label} <span class="sort-icon">${_contractorsState.sort === col.key ? (_contractorsState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </th>` : `<th>${col.label}</th>`).join('')}
    </tr></thead>
    <tbody>
      ${pg.items.map(c => {
    const overduePct = c.openActions > 0 ? Math.round(c.overdueActions / c.openActions * 100) : 0;
    const hasEsc = DB.escalationLog.find(e => e.contractorId === c.id && e.status === 'Open');
    const bu = DB.businessUnits.find(b => b.id === c.buId);
    const days = daysUntil(c.reviewDue);
    return `<tr onclick="navigateTo('contractor-profile',{id:'${c.id}'})" style="cursor:pointer">
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="user-avatar" style="background:${riskScoreColor(c.riskScore || 0)};width:34px;height:34px;font-size:10px">
                ${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style="font-weight:700;color:var(--text-primary);font-size:13px">${c.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${bu ? bu.name : ''} · ${c.projects.length} project${c.projects.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            ${hasEsc ? '<div style="margin-top:4px;margin-left:44px"><span class="badge badge-critical" style="font-size:10px">⚠ Escalated</span></div>' : ''}
          </td>
          <td><span class="badge ${getStatusBadge(c.status)}">${c.status}</span></td>
          <td><span class="risk-badge ${getRiskBadge(c.riskLevel)}">${c.riskLevel}</span></td>
          <td>
            <div class="compliance-bar" style="gap:6px">
              <div class="progress-bar-wrap" style="width:54px"><div class="progress-bar-fill ${getProgressClass(c.compliancePercent)}" style="width:${c.compliancePercent}%"></div></div>
              <span style="font-size:12px;font-weight:700;color:${getComplianceClass(c.compliancePercent) === 'good' ? 'var(--success)' : getComplianceClass(c.compliancePercent) === 'ok' ? 'var(--warning)' : 'var(--danger)'}">${c.compliancePercent}%</span>
            </div>
          </td>
          <td><span style="font-weight:700;color:${c.ifr >= 5 ? 'var(--danger)' : c.ifr >= 2 ? 'var(--warning)' : 'var(--success)'}">${c.ifr || '—'}</span></td>
          <td>
            ${c.overdueActions > 0
        ? `<span class="badge badge-critical">${c.overdueActions} overdue</span>`
        : `<span style="color:var(--text-muted);font-size:12px">—</span>`}
          </td>
          <td>
            <div style="font-size:13px;font-weight:600">${c.activeWorkers}/${c.workerCount}</div>
            <div style="font-size:10px;color:var(--text-muted)">active</div>
          </td>
          <td>
            ${c.reviewDue
        ? `<div style="font-size:12px;font-weight:600;color:${days !== null && days < 30 ? 'var(--danger)' : 'var(--text-primary)'}">${fmtDate(c.reviewDue)}</div>
                 ${days !== null && days < 30 ? `<div style="font-size:10px;color:var(--danger);font-weight:600">${days}d left</div>` : ''}`
        : '<span style="color:var(--text-muted);font-size:12px">—</span>'}
          </td>
          <td onclick="event.stopPropagation()" style="white-space:nowrap">
            <button class="btn btn-sm btn-secondary" onclick="navigateTo('contractor-profile',{id:'${c.id}'})">View</button>
          </td>
        </tr>`;
  }).join('')}
    </tbody>
  </table>
  ${renderPagination(pg, 'gotoContractorPage')}`;
}

function refreshContractors() {
  const body = document.getElementById('contractors-table-body');
  if (body) body.innerHTML = buildContractorsTable();
}

function setContractorFilter(key, val) {
  _contractorsState[key] = val;
  _contractorsState.page = 1;
  // Refresh page to update chip state
  window.renderContractors();
  window.initContractors();
}

function sortContractors(key) {
  if (_contractorsState.sort === key) {
    _contractorsState.sortDir = _contractorsState.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    _contractorsState.sort = key;
    _contractorsState.sortDir = 'desc';
  }
  refreshContractors();
}

function gotoContractorPage(p) {
  _contractorsState.page = p;
  refreshContractors();
  document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}
