/* ============================================================
   HSW Digital — Compliance Alerts Page
   page-compliance-alerts.js — Enterprise alert centre + escalations
   ============================================================ */

let _alertFilter = 'all';

window.renderComplianceAlerts = function () {
  const role = APP_STATE.currentRole;
  const canReview = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role);
  const container = document.getElementById('page-container');
  const alerts = DB.complianceAlerts;
  const escalations = DB.escalationLog;

  const filtered = _alertFilter === 'all' ? alerts : alerts.filter(a => a.type === _alertFilter);
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  container.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Compliance Alerts</div>
        <div class="page-subtitle">Active alerts, document expirations, and escalation reviews</div>
      </div>
      <div class="page-actions">
        <span class="badge badge-critical" style="font-size:12px;padding:6px 12px">${criticalCount} Critical</span>
        <button class="btn btn-secondary" onclick="exportToCSV('compliance-alerts')">Export</button>
      </div>
    </div>

    <!-- Summary Row -->
    <div class="grid grid-4" style="margin-bottom:20px">
      ${[
      { label: 'Critical Alerts', val: alerts.filter(a => a.type === 'critical').length, color: 'var(--danger)', bg: 'var(--danger-bg)' },
      { label: 'Warnings', val: alerts.filter(a => a.type === 'warning').length, color: 'var(--warning)', bg: 'var(--warning-bg)' },
      { label: 'Open Escalations', val: escalations.filter(e => e.status === 'Open').length, color: '#7C3AED', bg: 'var(--purple-bg)' },
      { label: 'Resolved', val: escalations.filter(e => e.status === 'Reviewed').length, color: 'var(--success)', bg: 'var(--success-bg)' }
    ].map(s => `
        <div class="card" style="padding:16px;display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;background:${s.bg};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:${s.color};flex-shrink:0">${s.val}</div>
          <div style="font-size:12px;font-weight:600;color:var(--text-muted)">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Alert Filters -->
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      ${['all', 'critical', 'warning'].map(f => `
        <div class="filter-chip ${_alertFilter === f ? 'active' : ''}" onclick="setAlertFilter('${f}')">
          ${f === 'all' ? `All Alerts (${alerts.length})` : f === 'critical' ? `🔴 Critical (${alerts.filter(a => a.type === 'critical').length})` : `⚠ Warnings (${alerts.filter(a => a.type === 'warning').length})`}
        </div>`).join('')}
    </div>

    <!-- Alert Cards -->
    <div class="card" style="margin-bottom:20px">
      ${filtered.length === 0 ? `<div class="empty-state"><div class="empty-title">No alerts</div></div>` :
      filtered.map(a => `
          <div class="notif-item ${a.type === 'critical' ? 'unread' : ''}">
            <div class="notif-dot" style="background:${a.type === 'critical' ? 'var(--danger)' : 'var(--warning)'}"></div>
            <div class="notif-content">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <div class="notif-title" style="color:${a.type === 'critical' ? 'var(--danger)' : 'var(--warning)'}">${a.title}</div>
                <span class="badge ${a.type === 'critical' ? 'badge-critical' : 'badge-warning'}">${a.category}</span>
              </div>
              <div class="notif-body">${a.detail}</div>
              <div style="display:flex;align-items:center;gap:12px;margin-top:4px">
                <span class="notif-time">${fmtDate(a.date)} · <strong>${a.contractor}</strong></span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
              <button class="btn btn-sm btn-secondary" onclick="navigateTo('contractor-profile',{id:'${a.contractorId}'})">View Contractor</button>
              ${canReview ? `<button class="btn btn-sm btn-primary" onclick="resolveAlert('${a.id}',this)">Resolve</button>` : ''}
            </div>
          </div>`).join('')}
    </div>

    <!-- Escalation Log -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🚨 Escalation Log</div>
          <div class="card-subtitle">All contractor escalation events and review status</div>
        </div>
        ${canReview ? `<button class="btn btn-sm btn-danger" onclick="showNewEscalationModal()">+ New Escalation</button>` : ''}
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Contractor</th>
            <th>Date</th>
            <th>Trigger Reason</th>
            <th>Status</th>
            <th>Reviewed By</th>
            <th>Review Date</th>
            ${canReview ? '<th>Action</th>' : ''}
          </tr></thead>
          <tbody>
            ${escalations.map(e => `
              <tr>
                <td><span style="font-weight:600;cursor:pointer;color:var(--primary)" onclick="navigateTo('contractor-profile',{id:'${e.contractorId}'})">${e.contractor}</span></td>
                <td>${fmtDate(e.date)}</td>
                <td><div style="font-size:12px;color:var(--text-muted);max-width:220px">${e.trigger}</div></td>
                <td><span class="badge ${e.status === 'Open' ? 'badge-critical' : 'badge-approved'}">${e.status}</span></td>
                <td>${e.reviewedBy || '<span style="color:var(--text-muted);font-size:12px">Pending</span>'}</td>
                <td>${fmtDate(e.reviewDate)}</td>
                ${canReview ? `<td>
                  ${e.status === 'Open' ? `
                    <button class="btn btn-sm btn-success" onclick="reviewEscalation('${e.id}')">Mark Reviewed</button>` :
            `<div style="display:flex;align-items:center;gap:4px"><svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:12px;color:var(--success)">Resolved</span></div>`}
                </td>` : ''}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>`;
};

function setAlertFilter(f) {
  _alertFilter = f;
  window.renderComplianceAlerts();
}

function resolveAlert(alertId, btn) {
  if (btn) { btn.textContent = '✓ Resolved'; btn.disabled = true; btn.style.background = 'var(--success)'; btn.style.color = 'white'; }
  showToast('Alert resolved', 'success');
}

function reviewEscalation(id) {
  const esc = DB.escalationLog.find(e => e.id === id);
  if (!esc) return;
  const role = DB.roles[APP_STATE.currentRole];
  esc.status = 'Reviewed';
  esc.reviewedBy = role?.name || 'Current User';
  esc.reviewDate = new Date().toISOString().split('T')[0];
  showToast('Escalation marked as reviewed', 'success');
  window.renderComplianceAlerts();
}

function showNewEscalationModal() {
  const html = `
  <div class="modal-overlay" onclick="closeModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width:460px">
      <div class="modal-header">
        <div class="modal-title">🚨 Raise New Escalation</div>
        <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Contractor</label>
          <select class="form-select" id="esc-contractor">
            ${DB.contractors.filter(c => c.status !== 'Draft').map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trigger Reason</label>
          <textarea class="form-textarea" id="esc-trigger" placeholder="Describe the escalation trigger…"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-danger" onclick="submitEscalation()">Raise Escalation</button>
      </div>
    </div>
  </div>`;
  openModal(html);
}

function submitEscalation() {
  const cId = document.getElementById('esc-contractor')?.value;
  const trigger = document.getElementById('esc-trigger')?.value;
  if (!cId || !trigger) { showToast('Please fill all fields', 'warning'); return; }
  const c = getContractor(cId);
  const role = DB.roles[APP_STATE.currentRole];
  DB.escalationLog.unshift({
    id: 'esc-' + Date.now(), contractorId: cId, contractor: c?.name || 'Unknown',
    date: new Date().toISOString().split('T')[0], trigger, status: 'Open',
    reviewedBy: null, reviewDate: null, notes: null
  });
  closeModal();
  showToast('Escalation raised successfully', 'warning');
  window.renderComplianceAlerts();
}
