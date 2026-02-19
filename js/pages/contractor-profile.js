/* ============================================================
   contractor-profile.js — Contractor Profile with 6 Tabs
   ============================================================ */

let _profileTab = 'overview';

function renderContractorProfile(contractorId) {
  const container = document.getElementById('page-container');
  const c = getContractor(contractorId);
  if (!c) { container.innerHTML = '<div class="page"><div class="empty-state"><div class="empty-title">Contractor not found</div></div></div>'; return; }

  const workers = getWorkersByContractor(contractorId);
  const incidents = getIncidentsByContractor(contractorId);
  const actions = getActionsByContractor(contractorId);
  const escalation = checkEscalation(c);
  const role = APP_STATE.currentRole;
  const canApprove = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role);
  const canEdit = role === 'contractor-admin' && contractorId === 'c-001';

  container.innerHTML = `
    <div class="page">
      <div class="breadcrumb">
        <span class="breadcrumb-item" onclick="navigateTo('contractors')">Contractors</span>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-item active">${c.name}</span>
      </div>

      ${escalation.triggered ? `<div class="escalation-banner">
        <div class="escalation-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div style="flex:1">
          <div class="escalation-title">⚡ Enterprise Escalation Triggered</div>
          <div class="escalation-text">${escalation.reasons.join(' · ')}</div>
        </div>
        <div class="escalation-actions">
          ${canApprove ? `<button class="btn btn-secondary btn-sm" onclick="promptEscalationReview('${c.id}')">Mark Reviewed</button>` : ''}
        </div>
      </div>` : ''}

      <!-- Profile Hero -->
      <div class="profile-hero">
        <div class="profile-hero-top">
          <div class="profile-hero-left">
            <div class="profile-company-logo">${getInitials(c.name)}</div>
            <div>
              <div class="profile-company-name">${c.name}</div>
              <div class="profile-company-reg">${c.regNum}</div>
              <div class="profile-hero-badges" style="margin-top:8px">
                ${statusBadge(c.status)}
                ${riskBadge(c.riskLevel)}
                ${complianceBadge(c.compliancePercent)}
              </div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px">
            ${renderRiskRing(c.riskScore, c.riskLevel)}
            <div style="display:flex;gap:8px">
              ${canEdit ? `<button class="btn btn-secondary btn-sm" onclick="showToast('Edit mode enabled', 'info')">Edit Profile</button>` : ''}
              ${canApprove && c.status === 'Under Review' ? `
                <button class="btn btn-success btn-sm" onclick="approveContractor('${c.id}')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="rejectContractor('${c.id}')">Reject</button>
              ` : ''}
              ${canApprove && c.status === 'Approved' ? `<button class="btn btn-warning btn-sm" onclick="showToast('Suspension workflow initiated', 'warning')">Suspend</button>` : ''}
            </div>
          </div>
        </div>
        <div class="profile-hero-stats">
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.workerCount}</div><div class="profile-hero-stat-label">Total Workers</div></div>
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.incidents}</div><div class="profile-hero-stat-label">Total Incidents</div></div>
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.ifr.toFixed(1)}</div><div class="profile-hero-stat-label">IFR</div></div>
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.openActions}</div><div class="profile-hero-stat-label">Open Actions</div></div>
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.overdueActions}</div><div class="profile-hero-stat-label">Overdue</div></div>
          <div class="profile-hero-stat"><div class="profile-hero-stat-value">${c.auditFindings}</div><div class="profile-hero-stat-label">Audit Findings</div></div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs" id="profile-tabs">
        ${['overview', 'documents', 'workforce', 'incidents', 'actions', 'performance'].map(t => `
          <button class="tab-btn ${_profileTab === t ? 'active' : ''}" onclick="switchProfileTab('${t}', '${contractorId}')">
            ${t.charAt(0).toUpperCase() + t.slice(1)}
            ${t === 'documents' ? `<span class="tab-badge">${c.documents.length}</span>` : ''}
            ${t === 'workforce' ? `<span class="tab-badge">${workers.length}</span>` : ''}
            ${t === 'incidents' ? `<span class="tab-badge">${incidents.length}</span>` : ''}
            ${t === 'actions' ? `<span class="tab-badge">${actions.length}</span>` : ''}
          </button>`).join('')}
      </div>

      <div id="profile-tab-content" style="margin-top:16px">
        ${renderProfileTab(_profileTab, c, workers, incidents, actions)}
      </div>
    </div>`;
}

function renderRiskRing(score, level) {
  const colors = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#DC2626' };
  const color = colors[level] || '#94A3B8';
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (score / 100) * circumference;
  return `<div class="risk-ring-wrap">
    <div class="risk-ring">
      <svg viewBox="0 0 64 64">
        <circle class="risk-ring-bg" cx="32" cy="32" r="26"/>
        <circle class="risk-ring-fill" cx="32" cy="32" r="26" stroke="${color}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="risk-ring-text"><div class="risk-ring-num">${score}</div><div class="risk-ring-label">Risk</div></div>
    </div>
  </div>`;
}

function switchProfileTab(tab, contractorId) {
  _profileTab = tab;
  const c = getContractor(contractorId);
  const workers = getWorkersByContractor(contractorId);
  const incidents = getIncidentsByContractor(contractorId);
  const actions = getActionsByContractor(contractorId);

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => { if (b.textContent.trim().toLowerCase().startsWith(tab)) b.classList.add('active'); });

  document.getElementById('profile-tab-content').innerHTML = renderProfileTab(tab, c, workers, incidents, actions);
}

function renderProfileTab(tab, c, workers, incidents, actions) {
  switch (tab) {
    case 'overview': return renderOverviewTab(c);
    case 'documents': return renderDocumentsTab(c);
    case 'workforce': return renderWorkforceTab(c, workers);
    case 'incidents': return renderIncidentsTab(c, incidents);
    case 'actions': return renderActionsTab(c, actions);
    case 'performance': return renderPerformanceTab(c);
    default: return '';
  }
}

function renderOverviewTab(c) {
  const bu = getBU(c.buId);
  const projects = c.projects.map(pid => getProject(pid)).filter(Boolean);
  const slaText = c.status === 'Under Review' ? 'Under Review — SLA: 5 business days' : c.approvedDate ? `Approved ${formatDate(c.approvedDate)}` : 'Pending submission';

  return `<div class="card">
    <div class="card-body">
      <div class="info-grid-3" style="margin-bottom:20px">
        <div class="info-item"><div class="info-label">Project</div><div class="info-value">${bu ? bu.name : '—'}</div></div>
        <div class="info-item"><div class="info-label">Primary Contact</div><div class="info-value">${c.contact}</div></div>
        <div class="info-item"><div class="info-label">Email</div><div class="info-value"><a href="mailto:${c.email}" style="color:var(--brand-primary-light)">${c.email}</a></div></div>
        <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${c.phone}</div></div>
        <div class="info-item"><div class="info-label">Review Due</div><div class="info-value">${c.reviewDue ? formatDate(c.reviewDue) : '—'}</div></div>
        <div class="info-item"><div class="info-label">Approval Status</div><div class="info-value">${statusBadge(c.status)}</div></div>
      </div>
      <div class="form-group">
        <div class="info-label">Scope of Work</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">${c.scopeOfWork.map(s => `<span class="badge badge-draft">${s}</span>`).join('')}</div>
      </div>
      <div class="form-group">
        <div class="info-label">Assigned Projects</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">${projects.map(p => `<span class="badge badge-approved">${p.name}</span>`).join('')}</div>
      </div>
      ${c.status === 'Under Review' ? `<div class="sla-timer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span class="sla-timer-text">SLA: Review due within 5 business days of submission</span></div>` : ''}
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <div class="card-header"><div class="card-title">Approval History</div></div>
    <div class="card-body">
      <div class="history-timeline">
        ${c.approvalHistory.map((h, i) => `
          <div class="history-item">
            <div class="history-line"></div>
            <div class="history-dot ${h.action === 'Approved' ? 'success' : h.action === 'Rejected' || h.action === 'Suspended' ? 'danger' : ''}"></div>
            <div class="history-content">
              <div class="history-action">${h.action}</div>
              <div class="history-meta">${h.user} · ${formatDate(h.date)}</div>
              ${h.comment ? `<div class="history-comment">"${h.comment}"</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderDocumentsTab(c) {
  const role = APP_STATE.currentRole;
  const canUpload = role === 'contractor-admin';
  return `<div class="card">
    <div class="card-header">
      <div class="card-title">HSW Documentation</div>
      ${canUpload ? `<button class="btn btn-primary btn-sm" onclick="showToast('Document upload dialog opened', 'info')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload Document
      </button>` : ''}
    </div>
    <div class="card-body">
      ${c.documents.length === 0 ? `<div class="empty-state"><div class="empty-title">No documents uploaded</div><div class="empty-text">Upload required HSW documentation to proceed with approval.</div></div>` :
      c.documents.map(d => `
        <div class="doc-row">
          <div class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div class="doc-info">
            <div class="doc-name">${d.name}</div>
            <div class="doc-meta">Version ${d.version} · Uploaded ${formatDate(d.uploadDate)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${expiryBadge(d.expiry)}
            ${statusBadge(d.status)}
            <button class="btn btn-ghost btn-sm" onclick="showToast('Document preview opened', 'info')">View</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderWorkforceTab(c, workers) {
  return `<div class="card">
    <div class="card-header">
      <div class="card-title">Workforce</div>
      <button class="btn btn-primary btn-sm" onclick="navigateTo('workforce', {contractorId:'${c.id}'})">Manage Workforce</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Worker</th><th>Role</th><th>Project</th><th>Certifications</th><th>Expiry</th><th>Status</th></tr></thead>
        <tbody>
          ${workers.length === 0 ? `<tr><td colspan="6"><div class="empty-state"><div class="empty-title">No workers registered</div></div></td></tr>` :
      workers.map(w => {
        const proj = getProject(w.project);
        return `<tr>
              <td class="col-name">${w.name}<div class="col-muted">${w.idNum}</div></td>
              <td>${w.role}</td>
              <td>${proj ? proj.name : '—'}</td>
              <td><div style="display:flex;flex-wrap:wrap;gap:3px">${w.certifications.slice(0, 2).map(cert => `<span class="badge badge-draft" style="font-size:10px">${cert}</span>`).join('')}${w.certifications.length > 2 ? `<span class="badge badge-draft" style="font-size:10px">+${w.certifications.length - 2}</span>` : ''}</div></td>
              <td>${expiryBadge(w.expiryDate)}</td>
              <td>${statusBadge(w.complianceStatus)}</td>
            </tr>`;
      }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderIncidentsTab(c, incidents) {
  return `<div class="card">
    <div class="card-header">
      <div class="card-title">Linked Incidents</div>
      <span class="badge badge-draft" style="font-size:11px">Integration Placeholder</span>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Type</th><th>Severity</th><th>Description</th><th>Status</th></tr></thead>
        <tbody>
          ${incidents.length === 0 ? `<tr><td colspan="5"><div class="empty-state"><div class="empty-title">No incidents recorded</div></div></td></tr>` :
      incidents.map(i => `<tr>
            <td>${formatDate(i.date)}</td>
            <td>${i.type}</td>
            <td><span class="badge ${i.severity === 'Critical' || i.severity === 'Serious' ? 'badge-noncompliant' : i.severity === 'High' ? 'badge-high' : 'badge-expiring'}">${i.severity}</span></td>
            <td>${i.description}</td>
            <td>${statusBadge(i.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderActionsTab(c, actions) {
  return `<div class="card">
    <div class="card-header">
      <div class="card-title">Corrective Actions</div>
      <button class="btn btn-primary btn-sm" onclick="showToast('New corrective action created', 'success')">Add Action</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Description</th><th>Priority</th><th>Due Date</th><th>Assignee</th><th>Status</th></tr></thead>
        <tbody>
          ${actions.length === 0 ? `<tr><td colspan="5"><div class="empty-state"><div class="empty-title">No corrective actions</div></div></td></tr>` :
      actions.map(a => `<tr>
            <td>${a.description}</td>
            <td><span class="badge ${a.priority === 'Critical' ? 'badge-critical' : a.priority === 'High' ? 'badge-high' : 'badge-expiring'}">${a.priority}</span></td>
            <td>${expiryBadge(a.dueDate)}</td>
            <td>${a.assignee}</td>
            <td>${statusBadge(a.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderPerformanceTab(c) {
  const esc = checkEscalation(c);
  const role = APP_STATE.currentRole;
  const canApprove = ['enterprise-hse', 'bu-hse'].includes(role);
  const td = c.trendData || { incidents: [0, 0, 0, 0, 0, 0, 0], compliance: [80, 80, 80, 80, 80, 80, 80], actions: [0, 0, 0, 0, 0, 0, 0] };
  const labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  const maxInc = Math.max(...td.incidents, 1);
  const maxAct = Math.max(...td.actions, 1);

  // Find escalation history for this contractor
  const escHistory = DB.escalationLog.filter(e => e.contractorId === c.id);

  return `<div>
    <!-- AI Summary -->
    <div class="card" style="border-left:4px solid #8B5CF6;margin-bottom:16px">
      <div class="card-body" style="display:flex;gap:14px;align-items:flex-start">
        <div style="font-size:28px">🤖</div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:#8B5CF6;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">AI Risk Summary (Predictive)</div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${c.aiSummary || 'No AI summary available.'}</div>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            ${predictiveRiskBadge(c.predictiveRisk || 'Stable')}
            ${ifrTrendBadge(c.ifrTrend || 'stable')}
            <span class="badge badge-draft" style="font-size:10px">Closure Speed: ${c.closureSpeed || '—'}d avg</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance KPI Cards -->
    <div class="performance-kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card" style="--kpi-color:#EF4444;--kpi-bg:#FEE2E2">
        <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
        <div class="kpi-value">${c.incidents}</div><div class="kpi-label">Total Incidents</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">${c.incidents90d || 0} in last 90 days</div>
      </div>
      <div class="kpi-card" style="--kpi-color:#F97316;--kpi-bg:#FFEDD5">
        <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <div class="kpi-value">${c.ifr.toFixed(1)}</div><div class="kpi-label">IFR</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">Industry benchmark: 3.8</div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10B981;--kpi-bg:#D1FAE5">
        <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="kpi-value">${c.compliancePercent}%</div><div class="kpi-label">Workforce Compliance</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">Target: ≥ 90%</div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3B82F6;--kpi-bg:#DBEAFE">
        <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div class="kpi-value">${c.closureSpeed || '—'}d</div><div class="kpi-label">Avg Closure Speed</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">Benchmark: &lt; 10 days</div>
      </div>
    </div>

    <!-- 6-month Trend Charts -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Incident Trend (7 months)</div></div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:100px;padding:8px 12px 0">
          ${td.incidents.map((v, i) => {
    const h = Math.round((v / maxInc) * 80);
    const color = v > 3 ? 'var(--color-noncompliant)' : v > 1 ? 'var(--color-expiring)' : 'var(--color-compliant)';
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
                <div style="font-size:9px;color:var(--text-muted)">${v}</div>
                <div style="width:100%;height:${Math.max(h, 4)}px;background:${color};border-radius:3px 3px 0 0"></div>
                <div style="font-size:9px;color:var(--text-muted)">${labels[i]}</div>
              </div>`;
  }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Compliance Trend (7 months)</div></div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:100px;padding:8px 12px 0">
          ${td.compliance.map((v, i) => {
    const h = Math.round(((v - 50) / 50) * 80);
    const color = v >= 90 ? 'var(--color-compliant)' : v >= 70 ? 'var(--color-expiring)' : 'var(--color-noncompliant)';
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
                <div style="font-size:9px;color:var(--text-muted)">${v}%</div>
                <div style="width:100%;height:${Math.max(h, 4)}px;background:${color};border-radius:3px 3px 0 0"></div>
                <div style="font-size:9px;color:var(--text-muted)">${labels[i]}</div>
              </div>`;
  }).join('')}
        </div>
      </div>
    </div>

    <!-- Benchmarking -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Benchmarking vs Enterprise & Industry</div></div>
      <div class="card-body">
        ${[{ label: c.name, ifr: c.ifr, color: getRiskColor(c.riskLevel) }, { label: 'Enterprise Avg', ifr: DB.enterpriseKPIs.ifr, color: '#8B5CF6' }, { label: 'Industry Benchmark', ifr: 3.8, color: '#3B82F6' }].map(row => {
    const pct = Math.min((row.ifr / 15) * 100, 100);
    return `<div class="benchmark-row">
              <div class="benchmark-name">${row.label}</div>
              <div class="benchmark-bar-wrap"><div class="progress-bar-wrap"><div style="height:100%;width:${pct}%;background:${row.color};border-radius:4px;transition:width 0.5s"></div></div></div>
              <div class="benchmark-val">${row.ifr.toFixed(1)} IFR</div>
            </div>`;
  }).join('')}
      </div>
    </div>

    <!-- Escalation History -->
    ${escHistory.length > 0 ? `<div class="card">
      <div class="card-header">
        <div class="card-title">🚨 Escalation History</div>
        ${canApprove && esc.triggered ? `<button class="btn btn-sm btn-primary" onclick="promptEscalationReview('${c.id}')">Add Intervention</button>` : ''}
      </div>
      <div class="card-body">
        ${escHistory.map(e => `
          <div style="border:1px solid ${e.status === 'Open' ? 'var(--color-noncompliant)' : 'var(--border)'};border-radius:8px;padding:12px;margin-bottom:10px;background:${e.status === 'Open' ? 'rgba(220,38,38,0.04)' : 'var(--bg-elevated)'}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-weight:700;font-size:13px">${e.trigger}</span>
              <span class="badge ${e.status === 'Open' ? 'badge-noncompliant' : 'badge-compliant'}">${e.status}</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted)">Logged: ${e.date}</div>
            ${e.notes ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:6px;padding:8px;background:var(--bg-primary);border-radius:6px">💬 ${e.reviewedBy}: "${e.notes}"</div>` : ''}
          </div>`).join('')}
      </div>
    </div>` : ''}
  </div>`;
}

function approveContractor(id) {
  const c = getContractor(id);
  if (c) { c.status = 'Approved'; c.approvedDate = new Date().toISOString().split('T')[0]; c.reviewDue = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; c.approvalHistory.unshift({ date: c.approvedDate, action: 'Approved', user: DB.roles[APP_STATE.currentRole].name, comment: 'Approved via portal.' }); }
  showToast(`${c.name} has been approved`, 'success');
  renderContractorProfile(id);
}

function rejectContractor(id) {
  const c = getContractor(id);
  if (c) { c.status = 'Rejected'; c.approvalHistory.unshift({ date: new Date().toISOString().split('T')[0], action: 'Rejected', user: DB.roles[APP_STATE.currentRole].name, comment: 'Rejected — documentation incomplete.' }); }
  showToast(`${c.name} has been rejected`, 'error');
  renderContractorProfile(id);
}
