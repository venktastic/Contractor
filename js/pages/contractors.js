/* ============================================================
   contractors.js — Contractor List Page
   ============================================================ */

let _contractorPage = 1;
let _contractorSort = { key: 'name', dir: 'asc' };
let _contractorFilters = { search: '', status: '', risk: '', bu: '' };

function renderContractors() {
  const container = document.getElementById('page-container');
  const role = APP_STATE.currentRole;
  const canAdd = ['enterprise-hse', 'bu-hse', 'project-hse', 'procurement'].includes(role);

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Contractors</div>
          <div class="page-subtitle">Manage and monitor all registered contractors</div>
        </div>
        <div class="page-actions">
          ${canAdd ? `<button class="btn btn-primary" onclick="navigateTo('onboarding')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Register Contractor
          </button>` : ''}
          <button class="btn btn-secondary" onclick="exportContractors()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      <div class="card">
        <div class="table-toolbar">
          <div class="search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" placeholder="Search contractors..." id="contractor-search" oninput="contractorSearch(this.value)" value="${_contractorFilters.search}">
          </div>
          <select class="filter-select" onchange="contractorFilter('status', this.value)" id="status-filter">
            <option value="">All Statuses</option>
            <option ${_contractorFilters.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option ${_contractorFilters.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option ${_contractorFilters.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option ${_contractorFilters.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
            <option ${_contractorFilters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
          <select class="filter-select" onchange="contractorFilter('risk', this.value)" id="risk-filter">
            <option value="">All Risk Levels</option>
            <option ${_contractorFilters.risk === 'Low' ? 'selected' : ''}>Low</option>
            <option ${_contractorFilters.risk === 'Medium' ? 'selected' : ''}>Medium</option>
            <option ${_contractorFilters.risk === 'High' ? 'selected' : ''}>High</option>
            <option ${_contractorFilters.risk === 'Critical' ? 'selected' : ''}>Critical</option>
          </select>
          <select class="filter-select" onchange="contractorFilter('bu', this.value)" id="bu-filter">
            <option value="">All Projects</option>
            ${DB.businessUnits.map(b => `<option value="${b.id}" ${_contractorFilters.bu === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
          </select>
        </div>

        <div class="table-wrap">
          <table class="data-table" id="contractors-table">
            <thead>
              <tr>
                <th onclick="contractorSort('name')">Company <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('status')">Status <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('riskLevel')">Risk Level <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('riskScore')">Risk Score <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('compliancePercent')">Compliance <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('workerCount')">Workers <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('incidents')">Incidents <span class="sort-icon">↕</span></th>
                <th onclick="contractorSort('overdueActions')">Overdue Actions <span class="sort-icon">↕</span></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="contractors-tbody"></tbody>
          </table>
        </div>
        <div id="contractors-pagination"></div>
      </div>
    </div>`;

  renderContractorsTable();
}

function renderContractorsTable() {
  const role = APP_STATE.currentRole;
  let contractors = scopeContractors(DB.contractors, role, APP_STATE.currentBU);
  contractors = filterContractors(contractors, _contractorFilters);
  contractors = sortData(contractors, _contractorSort.key, _contractorSort.dir);

  const pg = paginate(contractors, _contractorPage, 8);
  const tbody = document.getElementById('contractors-tbody');
  if (!tbody) return;

  if (pg.items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state">
      <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
      <div class="empty-title">No contractors found</div>
      <div class="empty-text">Try adjusting your search or filters</div>
    </div></td></tr>`;
  } else {
    tbody.innerHTML = pg.items.map(c => {
      const escalation = checkEscalation(c);
      return `<tr onclick="navigateTo('contractor-profile', {id:'${c.id}'})">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="contractor-initials" style="width:36px;height:36px;border-radius:8px;font-size:13px">${getInitials(c.name)}</div>
            <div>
              <div class="col-name">${c.name}</div>
              <div class="col-muted">${c.regNum}</div>
            </div>
          </div>
        </td>
        <td>${statusBadge(c.status)}</td>
        <td>${riskBadge(c.riskLevel)}</td>
        <td><span style="font-weight:800;color:${getRiskColor(c.riskLevel)}">${c.riskScore}</span></td>
        <td>${complianceBadge(c.compliancePercent)}</td>
        <td>${c.workerCount}</td>
        <td><span style="color:${c.incidents > 5 ? 'var(--color-noncompliant)' : c.incidents > 2 ? 'var(--color-expiring)' : 'var(--text-primary)'};font-weight:600">${c.incidents}</span></td>
        <td><span style="color:${c.overdueActions > 0 ? 'var(--color-noncompliant)' : 'var(--text-primary)'};font-weight:600">${c.overdueActions}</span></td>
        <td onclick="event.stopPropagation()">
            <div style="display:flex;gap:4px">
                ${c.riskLevel !== 'Low' ? '<span class="badge badge-escalation" style="font-size:9px">⚡ Escalate</span>' : ''}
                <button class="btn btn-ghost btn-sm" onclick="navigateTo('contractor-profile', {id:'${c.id}'})">View</button>
            </div>
        </td>
      </tr>`;
    }).join('');
  }

  renderPagination('contractors-pagination', pg, 'contractorPage');
}

function contractorSearch(val) { _contractorFilters.search = val; _contractorPage = 1; renderContractorsTable(); }
function contractorFilter(key, val) { _contractorFilters[key] = val; _contractorPage = 1; renderContractorsTable(); }
function contractorSort(key) {
  if (_contractorSort.key === key) _contractorSort.dir = _contractorSort.dir === 'asc' ? 'desc' : 'asc';
  else { _contractorSort.key = key; _contractorSort.dir = 'asc'; }
  renderContractorsTable();
}
function contractorPage(p) { _contractorPage = p; renderContractorsTable(); }
function exportContractors() {
  const data = DB.contractors.map(c => ({ Name: c.name, Registration: c.regNum, Status: c.status, Risk: c.riskLevel, Score: c.riskScore, Compliance: c.compliancePercent + '%', Workers: c.workerCount, Incidents: c.incidents }));
  exportCSV(data, 'contractors_export');
}
