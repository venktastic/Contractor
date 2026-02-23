/* ============================================================
   HSW Digital — Contractor Profile Page
   contractor-profile.js — Enterprise drill-down with AI panel & tabs
   ============================================================ */

let _profileTab = 'overview';

window.renderContractorProfile = function (id) {
  const c = getContractor(id);
  if (!c) {
    document.getElementById('page-container').innerHTML = `
      <div class="empty-state" style="padding:80px 24px">
        <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
        <div class="empty-title">Contractor not found</div>
        <button class="btn btn-primary" style="margin-top:16px" onclick="navigateTo('contractors')">← Back to Contractors</button>
      </div>`;
    return;
  }

  const role = APP_STATE.currentRole;
  const canApprove = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role);
  const canEscalate = ['enterprise-hse', 'bu-hse'].includes(role);
  const workers = getWorkersByContractor(id);
  const incidents = getIncidentsByContractor(id);
  const actions = getActionsByContractor(id);
  const bu = DB.businessUnits.find(b => b.id === c.buId);
  const hasEsc = DB.escalationLog.find(e => e.contractorId === id && e.status === 'Open');

  document.getElementById('page-container').innerHTML = `
  <div class="page">

    <!-- Breadcrumb -->
    <div class="topbar-breadcrumb" style="margin-bottom:16px">
      <span onclick="navigateTo('contractors')" style="color:var(--primary);cursor:pointer;font-weight:600">Contractors</span>
      <span>›</span>
      <span>${c.name}</span>
    </div>

    <!-- Profile Header Card -->
    <div class="card" style="margin-bottom:16px;padding:24px">
      <div style="display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap">
        <!-- Avatar + Name -->
        <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:280px">
          <div class="user-avatar" style="width:56px;height:56px;font-size:16px;background:${riskScoreColor(c.riskScore || 0)}">
            ${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style="font-size:20px;font-weight:900;color:var(--text-primary);letter-spacing:-0.3px">${c.name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:3px">${c.regNum} · ${bu ? bu.name : ''} · ${c.contact}</div>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
              <span class="badge ${getStatusBadge(c.status)}">${c.status}</span>
              <span class="risk-badge ${getRiskBadge(c.riskLevel)}">${c.riskLevel} Risk · ${c.riskScore}</span>
              ${hasEsc ? '<span class="badge badge-critical">⚠ Escalated</span>' : ''}
            </div>
          </div>
        </div>

        <!-- KPI Snippets -->
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          ${[
      { label: 'LTIFR', val: c.ifr || '—', color: c.ifr > 1.5 ? 'var(--danger)' : c.ifr >= 1.0 ? 'var(--orange)' : c.ifr >= 0.5 ? 'var(--warning)' : 'var(--success)' },
      { label: 'Compliance', val: c.compliancePercent + '%', color: c.compliancePercent >= 90 ? 'var(--success)' : c.compliancePercent >= 75 ? 'var(--warning)' : 'var(--danger)' },
      { label: 'Workers', val: c.activeWorkers + '/' + c.workerCount, color: 'var(--primary)' },
      { label: 'Open Actions', val: c.openActions, color: c.overdueActions > 0 ? 'var(--danger)' : 'var(--text-primary)' },
      { label: 'Overdue', val: c.overdueActions, color: c.overdueActions > 0 ? 'var(--danger)' : 'var(--success)' }
    ].map(k => `
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:900;color:${k.color}">${k.val}</div>
              <div style="font-size:11px;color:var(--text-muted);font-weight:600;margin-top:2px">${k.label}</div>
            </div>`).join('')}
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          ${canApprove && c.status === 'Under Review' ? `
            <button class="btn btn-success" onclick="quickApprove('${c.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Approve</button>` : ''}
          ${canEscalate && !hasEsc && c.riskLevel !== 'Low' ? `
            <button class="btn btn-secondary" onclick="raiseEscalation('${c.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              Raise Escalation</button>` : ''}
          <button class="btn btn-secondary" onclick="exportToCSV('${c.name}-profile')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export</button>
        </div>
      </div>
    </div>

    <!-- AI Panel -->
    <div class="ai-panel" style="margin-bottom:16px">
      <div class="ai-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        AI Risk Analysis
      </div>
      <div class="ai-summary">${c.aiSummary || 'AI analysis not available for this contractor.'}</div>
      <div style="margin-top:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="font-size:11px;color:var(--purple);font-weight:600">Predictive State:</div>
          <span class="badge" style="background:rgba(124,58,237,0.1);color:var(--purple);border:1px solid rgba(124,58,237,0.2)">${c.predictiveRisk || 'N/A'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="font-size:11px;color:var(--purple);font-weight:600">LTIFR Trend:</div>
          <span class="badge" style="background:${c.ifrTrend === 'up' ? 'var(--danger-bg)' : c.ifrTrend === 'down' ? 'var(--success-bg)' : 'var(--bg-elevated)'};color:${c.ifrTrend === 'up' ? 'var(--danger)' : c.ifrTrend === 'down' ? 'var(--success)' : 'var(--text-muted)'};border:1px solid var(--border)">
            ${c.ifrTrend === 'up' ? '↑ Rising' : c.ifrTrend === 'down' ? '↓ Improving' : '→ Stable'}
          </span>
        </div>
      </div>
      <div class="ai-actions">
        <button class="ai-btn" onclick="showToast('Generating AI intervention plan…','info')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Generate Intervention Plan
        </button>
        <button style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:white;color:#7C3AED;border:1.5px solid #7C3AED;font-size:12px;font-weight:600;cursor:pointer;line-height:1;font-family:inherit" onclick="showToast('Benchmarking report queued…','info')">
          <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21H3v-4z"/></svg>
          Benchmark Report
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="card">
      <div class="tab-bar" style="padding:0 20px">
        ${[
      { id: 'overview', label: 'Overview' },
      { id: 'documents', label: 'Documents', count: c.documents.length },
      { id: 'workforce', label: 'Workforce', count: workers.length },
      { id: 'incidents', label: 'Incidents', count: incidents.length },
      { id: 'actions', label: 'Actions', count: actions.length },
      { id: 'history', label: 'Approval History' }
    ].map(tab => `
          <div class="tab-btn ${_profileTab === tab.id ? 'active' : ''}" onclick="switchProfileTab('${tab.id}','${id}')">
            ${tab.label}
            ${tab.count !== undefined ? `<span class="tab-count">${tab.count}</span>` : ''}
          </div>`).join('')}
      </div>

      <div id="profile-tab-content">
        ${renderProfileTab(c, workers, incidents, actions)}
      </div>
    </div>

  </div>`;
};

function switchProfileTab(tabId, contractorId) {
  _profileTab = tabId;
  const c = getContractor(contractorId);
  const workers = getWorkersByContractor(contractorId);
  const incidents = getIncidentsByContractor(contractorId);
  const actions = getActionsByContractor(contractorId);
  const content = document.getElementById('profile-tab-content');
  if (content) content.innerHTML = renderProfileTab(c, workers, incidents, actions);

  // Update tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().startsWith(['Overview', 'Documents', 'Workforce', 'Incidents', 'Actions', 'Approval History'].find(l => btn.textContent.trim().startsWith(l)) || ''));
  });
}

function renderProfileTab(c, workers, incidents, actions) {
  switch (_profileTab) {
    case 'overview': return renderOverviewTab(c);
    case 'documents': return renderDocumentsTab(c);
    case 'workforce': return renderWorkforceTab(workers);
    case 'incidents': return renderIncidentsTab(incidents);
    case 'actions': return renderActionsTab(actions);
    case 'history': return renderHistoryTab(c);
    default: return renderOverviewTab(c);
  }
}

function renderOverviewTab(c) {
  const trend = c.trendData;
  return `
  <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <!-- Compliance Trend -->
    <div>
      <div class="section-header"><div class="section-title">Compliance Trend (7 weeks)</div></div>
      ${trend ? renderBarChart(['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], trend.compliance, '#2563EB', 120) : '<div class="empty-state">No data</div>'}
    </div>
    <!-- Incident Trend -->
    <div>
      <div class="section-header"><div class="section-title">Incident Rate Trend</div></div>
      ${trend ? renderBarChart(['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], trend.incidents, '#DC2626', 120) : '<div class="empty-state">No data</div>'}
    </div>

    <!-- Key Info -->
    <div class="card" style="grid-column:1/-1">
      <div class="card-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div>
          <div class="section-title" style="margin-bottom:12px">Scope of Work</div>
          ${c.scopeOfWork.map(s => `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><div style="width:6px;height:6px;border-radius:50%;background:var(--primary)"></div><div style="font-size:12px;color:var(--text-secondary)">${s}</div></div>`).join('')}
        </div>
        <div>
          <div class="section-title" style="margin-bottom:12px">Projects</div>
          ${c.projects.map(pid => {
    const p = DB.projects.find(r => r.id === pid);
    return p ? `<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">📋 ${p.name}</div>` : '';
  }).join('')}
        </div>
        <div>
          <div class="section-title" style="margin-bottom:12px">Contact</div>
          <div class="stat-row"><div class="stat-row-label">Manager</div><div class="stat-row-value">${c.contact}</div></div>
          <div class="stat-row"><div class="stat-row-label">Email</div><div class="stat-row-value" style="font-size:11px">${c.email}</div></div>
          <div class="stat-row"><div class="stat-row-label">Phone</div><div class="stat-row-value">${c.phone}</div></div>
          <div class="stat-row"><div class="stat-row-label">Approved</div><div class="stat-row-value">${fmtDate(c.approvedDate)}</div></div>
          <div class="stat-row"><div class="stat-row-label">Review Due</div><div class="stat-row-value">${fmtDate(c.reviewDue)}</div></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderDocumentsTab(c) {
  if (!c.documents.length) return `<div class="empty-state"><div class="empty-title">No documents uploaded</div></div>`;
  return `
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Document</th><th>Status</th><th>Version</th><th>Expiry Date</th><th>Uploaded</th><th>Action</th></tr></thead>
      <tbody>
        ${c.documents.map(d => {
    const expired = isExpired(d.expiry);
    const expiring = isExpiringSoon(d.expiry, 30);
    const days = daysUntil(d.expiry);
    return `<tr>
            <td><div style="font-weight:600">${d.name}</div></td>
            <td><span class="badge ${getStatusBadge(d.status)}">${d.status}</span></td>
            <td><code style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${d.version}</code></td>
            <td>
              <div style="font-weight:600;color:${expired ? 'var(--danger)' : expiring ? 'var(--warning)' : 'var(--text-primary)'}">${fmtDate(d.expiry)}</div>
              ${expired ? '<div style="font-size:10px;color:var(--danger);font-weight:700">EXPIRED</div>' : expiring ? `<div style="font-size:10px;color:var(--warning);font-weight:700">Expires in ${days}d</div>` : ''}
            </td>
            <td>${fmtDate(d.uploadDate)}</td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick="showToast('Opening document…','info')">View</button>
              <button class="btn btn-sm btn-outline-primary" style="margin-left:4px" onclick="showToast('Upload dialog opening…','info')">Upload New</button>
            </td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderWorkforceTab(workers) {
  if (!workers.length) return `<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="empty-title">No workers registered</div></div>`;
  return `
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Worker</th><th>Role</th><th>Project</th><th>Certifications</th><th>Cert Expiry</th><th>Status</th></tr></thead>
      <tbody>
        ${workers.map(w => {
    const project = DB.projects.find(p => p.id === w.project);
    return `<tr>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="user-avatar" style="background:var(--primary);width:28px;height:28px;font-size:9px">${w.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div>
                  <div style="font-weight:600">${w.name}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${w.idNum}</div>
                </div>
              </div>
            </td>
            <td>${w.role}</td>
            <td>${project ? project.name : '—'}</td>
            <td><div style="display:flex;flex-wrap:wrap;gap:4px">${w.certifications.map(cert => `<span style="display:inline-block;padding:2px 8px;border-radius:20px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;font-size:10px;font-weight:600;white-space:nowrap">${cert}</span>`).join('')}</div></td>
            <td>
              <div style="font-size:12px;font-weight:600;color:${isExpired(w.expiryDate) ? 'var(--danger)' : isExpiringSoon(w.expiryDate, 30) ? 'var(--warning)' : 'var(--text-primary)'}">${fmtDate(w.expiryDate)}</div>
            </td>
            <td><span class="badge ${getStatusBadge(w.complianceStatus)}">${w.complianceStatus}</span></td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderIncidentsTab(incidents) {
  if (!incidents.length) return `<div class="empty-state"><div class="empty-title">No incidents recorded</div><div class="empty-body">This contractor has a clean safety record</div></div>`;
  return `
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Date</th><th>Type</th><th>Severity</th><th>Description</th><th>Status</th><th>Project</th></tr></thead>
      <tbody>
        ${incidents.map(i => {
    const project = DB.projects.find(p => p.id === i.project);
    return `<tr>
            <td>${fmtDate(i.date)}</td>
            <td><span class="badge badge-review">${i.type}</span></td>
            <td><span class="badge ${i.severity === 'Critical' || i.severity === 'Serious' ? 'badge-critical' : i.severity === 'High' ? 'badge-danger' : i.severity === 'Medium' ? 'badge-warning' : 'badge-draft'}">${i.severity}</span></td>
            <td><div style="font-size:12px;max-width:280px">${i.description}</div></td>
            <td><span class="badge ${getStatusBadge(i.status)}">${i.status}</span></td>
            <td>${project ? project.name : '—'}</td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderActionsTab(actions) {
  if (!actions.length) return `<div class="empty-state"><div class="empty-title">No corrective actions</div></div>`;
  return `
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Description</th><th>Priority</th><th>Due Date</th><th>Status</th><th>Assignee</th></tr></thead>
      <tbody>
        ${actions.map(a => {
    const days = daysUntil(a.dueDate);
    return `<tr>
            <td><div style="font-size:13px;max-width:300px">${a.description}</div></td>
            <td><span class="badge ${a.priority === 'Critical' ? 'badge-critical' : a.priority === 'High' ? 'badge-danger' : a.priority === 'Medium' ? 'badge-warning' : 'badge-draft'}">${a.priority}</span></td>
            <td>
              <div style="font-weight:600;color:${a.status === 'Overdue' ? 'var(--danger)' : days !== null && days <= 7 ? 'var(--warning)' : 'var(--text-primary)'}">${fmtDate(a.dueDate)}</div>
              ${a.status === 'Overdue' ? '<div style="font-size:10px;color:var(--danger);font-weight:700">OVERDUE</div>' : ''}
            </td>
            <td><span class="badge ${getStatusBadge(a.status)}">${a.status}</span></td>
            <td>${a.assignee}</td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderHistoryTab(c) {
  if (!c.approvalHistory || !c.approvalHistory.length) return `<div class="empty-state"><div class="empty-title">No history</div></div>`;
  return `
  <div style="padding:20px">
    ${c.approvalHistory.map((h, idx) => `
    <div class="timeline-item" style="position:relative">
      ${idx < c.approvalHistory.length - 1 ? '<div class="timeline-line"></div>' : ''}
      <div class="timeline-dot" style="background:${h.action === 'Approved' ? 'var(--success)' : h.action === 'Suspended' ? 'var(--danger)' : h.action === 'Under Review' ? 'var(--warning)' : 'var(--primary)'}">
        ${h.action[0]}
      </div>
      <div class="timeline-body">
        <div class="timeline-action">${h.action}</div>
        <div class="timeline-user">by ${h.user}</div>
        ${h.comment ? `<div class="timeline-comment">${h.comment}</div>` : ''}
        <div class="timeline-date">${fmtDate(h.date)}</div>
      </div>
    </div>`).join('')}
  </div>`;
}

function quickApprove(contractorId) {
  const c = getContractor(contractorId);
  if (!c) return;
  c.status = 'Approved';
  c.approvedDate = new Date().toISOString().split('T')[0];
  const rd = new Date(); rd.setFullYear(rd.getFullYear() + 1);
  c.reviewDue = rd.toISOString().split('T')[0];
  const role = DB.roles[APP_STATE.currentRole];
  c.approvalHistory.unshift({ date: c.approvedDate, action: 'Approved', user: role?.name || 'Current User', comment: 'Approved via portal review.' });
  showToast(`${c.name} has been approved`, 'success');
  window.renderContractorProfile(contractorId);
}

function raiseEscalation(contractorId) {
  const c = getContractor(contractorId);
  if (!c) return;
  const existing = DB.escalationLog.find(e => e.contractorId === contractorId && e.status === 'Open');
  if (existing) { showToast('An escalation is already open for this contractor', 'warning'); return; }
  DB.escalationLog.unshift({
    id: 'esc-' + Date.now(),
    contractorId,
    contractor: c.name,
    date: new Date().toISOString().split('T')[0],
    trigger: `Risk Score: ${c.riskScore}, LTIFR: ${c.ifr}, Overdue Actions: ${c.overdueActions}`,
    status: 'Open',
    reviewedBy: null, reviewDate: null, notes: null
  });
  showToast('Escalation raised for ' + c.name, 'warning');
  window.renderContractorProfile(contractorId);
}
