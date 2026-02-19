// ============================================
// PERMIT DETAIL PAGE - MODULE C (RAMS)
// ============================================

window.renderPermitDetail = function () {
  const container = document.getElementById('page-container');
  const permit = findPermit(APP_STATE.currentPermitId);

  if (!permit) {
    container.innerHTML = '<div class="empty-state"><p class="empty-title">Permit not found</p></div>';
    return;
  }

  const statusClass = getStatusBadgeClass(permit.status);
  const statusLabel = getStatusLabel(permit.status);
  const riskClass = getRiskBadgeClass(permit.riskLevel);

  container.innerHTML = `
    <div>
      <!-- Hero -->
      <div class="permit-detail-hero">
        <p class="permit-detail-id">${permit.id}</p>
        <h1 class="permit-detail-title">${permit.typeIcon} ${permit.title}</h1>
        <div class="permit-detail-badges">
          <span class="badge ${statusClass}">${statusLabel}</span>
          <span class="risk-badge ${riskClass}">${permit.riskLevel} RISK</span>
          ${permit.simopsConflicts && permit.simopsConflicts.length > 0 ? `<span style="background:var(--danger-bg);color:var(--danger);border:1px solid rgba(230,57,70,0.3);padding:3px 8px;border-radius:var(--radius-sm);font-size:11px;font-weight:700">⚠ SIMOPS</span>` : ''}
        </div>
      </div>

      <!-- Suspended Banner -->
      ${permit.status === 'SUSPENDED' ? `
        <div class="alert alert-danger" style="margin:var(--space-4);border-radius:var(--radius-md)">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          <div class="alert-content">
            <p class="alert-title">PERMIT SUSPENDED</p>
            <p class="alert-body">${permit.suspendedReason || 'Permit has been suspended by HSE Manager.'}</p>
          </div>
        </div>
      ` : ''}

      <!-- Expired Banner -->
      ${permit.status === 'EXPIRED' ? `
        <div class="alert alert-warning" style="margin:var(--space-4);border-radius:var(--radius-md)">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div class="alert-content">
            <p class="alert-title">PERMIT EXPIRED</p>
            <p class="alert-body">This permit expired on ${permit.endDate} at ${permit.endTime}. No work may proceed under this permit.</p>
          </div>
        </div>
      ` : ''}

      <!-- Tabs -->
      <div class="permit-detail-tabs">
        ${['details', 'rams', 'checklist', 'timeline'].map(tab => `
          <button class="detail-tab ${APP_STATE.currentDetailTab === tab ? 'active' : ''}"
                  onclick="switchDetailTab('${tab}')">
            ${tab === 'details' ? 'Details' : tab === 'rams' ? 'RAMS' : tab === 'checklist' ? 'Checklist' : 'Audit Log'}
          </button>
        `).join('')}
      </div>

      <!-- Tab Content -->
      <div class="detail-tab-content" id="detail-tab-content">
        ${renderDetailTabContent(permit)}
      </div>

      <!-- Action Buttons -->
      ${renderPermitActions(permit)}
    </div>
  `;
}

function renderDetailTabContent(permit) {
  switch (APP_STATE.currentDetailTab) {
    case 'details': return renderDetailsTab(permit);
    case 'rams': return renderRamsTab(permit);
    case 'checklist': return renderChecklistTab(permit);
    case 'timeline': return renderTimelineTab(permit);
    default: return renderDetailsTab(permit);
  }
}

function renderDetailsTab(permit) {
  return `
    <div>
      <div class="detail-section">
        <p class="detail-section-title">Job Information</p>
        <div class="detail-row"><span class="detail-key">Permit Type</span><span class="detail-value">${permit.typeIcon} ${permit.typeName}</span></div>
        <div class="detail-row"><span class="detail-key">Location</span><span class="detail-value">${permit.location}</span></div>
        <div class="detail-row"><span class="detail-key">Zone</span><span class="detail-value">${permit.zone}</span></div>
        <div class="detail-row"><span class="detail-key">Contractor</span><span class="detail-value">${permit.contractor}</span></div>
        <div class="detail-row"><span class="detail-key">Supervisor</span><span class="detail-value">${permit.supervisor}</span></div>
        <div class="detail-row"><span class="detail-key">Team</span><span class="detail-value">${permit.team}</span></div>
      </div>
      <div class="detail-section">
        <p class="detail-section-title">Time Window</p>
        <div class="detail-row"><span class="detail-key">Start</span><span class="detail-value">${permit.startDate} at ${permit.startTime}</span></div>
        <div class="detail-row"><span class="detail-key">End</span><span class="detail-value">${permit.endDate} at ${permit.endTime}</span></div>
      </div>
      <div class="detail-section">
        <p class="detail-section-title">Approval</p>
        <div class="detail-row"><span class="detail-key">Created By</span><span class="detail-value">${permit.createdBy}</span></div>
        <div class="detail-row"><span class="detail-key">Created At</span><span class="detail-value">${formatDateTime(permit.createdAt)}</span></div>
        <div class="detail-row"><span class="detail-key">Approved By</span><span class="detail-value">${permit.approvedBy || '—'}</span></div>
        <div class="detail-row"><span class="detail-key">Approved At</span><span class="detail-value">${permit.approvedAt ? formatDateTime(permit.approvedAt) : '—'}</span></div>
      </div>
      ${permit.description ? `
        <div class="detail-section">
          <p class="detail-section-title">Description</p>
          <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:1.6">${permit.description}</p>
        </div>
      ` : ''}
      ${permit.status === 'APPROVED' || permit.status === 'ACTIVE' ? `
        <button class="btn btn-secondary btn-full" onclick="showQrCode('${permit.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          View QR Code
        </button>
      ` : ''}
    </div>
  `;
}

function renderRamsTab(permit) {
  const rams = permit.rams;
  const isValidated = rams.status === 'VALIDATED';

  return `
    <div class="rams-section" style="padding:0">
      <!-- Validation Status -->
      <div class="alert ${isValidated ? 'alert-success' : 'alert-warning'}" style="margin-bottom:var(--space-4)">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${isValidated ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>'}
        </svg>
        <div class="alert-content">
          <p class="alert-title">${isValidated ? 'RAMS Validated' : 'RAMS Pending Validation'}</p>
          <p class="alert-body">${isValidated ? `Validated by ${rams.files[0]?.validatedBy} on ${formatDate(rams.files[0]?.date)}` : 'RAMS document requires HSE Manager validation before permit can be approved.'}</p>
        </div>
      </div>

      <!-- Current RAMS File -->
      <p style="font-size:var(--font-size-xs);font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-3)">Current Document</p>
      ${rams.files.map(file => `
        <div class="file-item" style="margin-bottom:var(--space-3)">
          <div class="file-icon ${file.type}">
            ${file.type.toUpperCase().slice(0, 3)}
          </div>
          <div class="file-info">
            <p class="file-name">${file.name}</p>
            <p class="file-meta">v${file.version} · ${file.size} · ${formatDate(file.date)}</p>
          </div>
          <span class="hse-badge ${file.validated ? 'validated' : 'pending'}">
            ${file.validated ? '✓ HSE Validated' : 'Pending'}
          </span>
        </div>
      `).join('')}

      <!-- Actions -->
      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5)">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="showToast('Opening document preview...', 'info')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </button>
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="simulateNewRamsVersion('${permit.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/></svg>
          Upload New Version
        </button>
        ${!isValidated ? `
          <button class="btn btn-success btn-sm" style="flex:1" onclick="validateRams('${permit.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Validate
          </button>
        ` : ''}
      </div>

      <!-- Version History -->
      <p style="font-size:var(--font-size-xs);font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-3)">Version History</p>
      ${rams.files.map((file, i) => `
        <div class="rams-version-item">
          <div class="rams-version-num ${i === 0 ? 'current' : ''}">v${file.version}</div>
          <div class="rams-version-info">
            <p class="rams-version-name">${file.name}</p>
            <p class="rams-version-meta">${formatDate(file.date)} · ${file.size}</p>
          </div>
          <span class="hse-badge ${file.validated ? 'validated' : 'pending'}" style="font-size:10px">
            ${file.validated ? '✓ Valid' : 'Pending'}
          </span>
        </div>
      `).join('')}

      <!-- Comments -->
      <div style="margin-top:var(--space-5)">
        <p style="font-size:var(--font-size-xs);font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-3)">HSE Comments</p>
        <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-3);margin-bottom:var(--space-3)">
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="avatar" style="width:24px;height:24px;font-size:9px">PS</div>
            <p style="font-size:var(--font-size-xs);font-weight:600;color:var(--text-primary)">Prakash Senghani</p>
            <p style="font-size:var(--font-size-xs);color:var(--text-muted);margin-left:auto">2h ago</p>
          </div>
          <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:1.5">RAMS reviewed and validated. All hazards adequately addressed. Method statement is clear and comprehensive.</p>
        </div>
        <div style="display:flex;gap:var(--space-2)">
          <input class="form-input" type="text" placeholder="Add a comment..." style="flex:1" />
          <button class="btn btn-primary btn-sm" onclick="showToast('Comment added', 'success')">Send</button>
        </div>
      </div>
    </div>
  `;
}

function renderChecklistTab(permit) {
  const permitType = getPermitType(permit.type);
  if (!permitType) return '<p style="color:var(--text-muted)">No checklist available</p>';

  const checklist = permitType.checklist;
  const checked = permit.checklist.filter(Boolean).length;

  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
        <p style="font-size:var(--font-size-sm);color:var(--text-secondary)">${checked}/${checklist.length} items verified</p>
        <span class="badge ${checked === checklist.length ? 'badge-approved' : 'badge-under-review'}">${checked === checklist.length ? 'Complete' : 'Incomplete'}</span>
      </div>
      <div class="card">
        ${checklist.map((item, i) => `
          <div class="checklist-item">
            <div class="checkbox ${permit.checklist[i] ? 'checked' : ''}">
              ${permit.checklist[i] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <p class="checklist-text ${permit.checklist[i] ? 'checked-text' : ''}">${item}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTimelineTab(permit) {
  return `
    <div class="timeline">
      ${permit.auditLog.map(entry => {
    const style = getAuditIconColor(entry.type);
    return `
          <div class="timeline-item">
            <div class="timeline-dot" style="background:${style.bg}">
              <svg viewBox="0 0 24 24" fill="none" stroke="${style.color}" stroke-width="2" width="14" height="14">
                ${getAuditIcon(entry.type)}
              </svg>
            </div>
            <div class="timeline-content">
              <p class="timeline-action">${entry.action}</p>
              ${entry.detail ? `<p class="timeline-detail">${entry.detail}</p>` : ''}
              <p class="timeline-time">${formatDateTime(entry.time)} · ${entry.user}</p>
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function renderPermitActions(permit) {
  const actions = [];
  const role = APP_STATE.user.role;

  // APPROVER ACTIONS
  if (role === 'APPROVER' && (permit.status === 'SUBMITTED' || permit.status === 'UNDER_REVIEW')) {
    actions.push(`<button class="btn btn-success btn-full" onclick="approvePermit('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Approve Permit
    </button>`);
    actions.push(`<button class="btn btn-danger btn-full" onclick="rejectPermit('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      Reject Permit
    </button>`);
  }

  // WATCHER ACTIONS
  if (role === 'WATCHER' && permit.status === 'ACTIVE') {
    actions.push(`<button class="btn btn-primary btn-full" onclick="logCheckIn('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
      Log Safety Check
    </button>`);
    actions.push(`<button class="btn btn-danger btn-full" onclick="showStopWorkModal('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      Report Unsafe Condition
    </button>`);
  }

  // REQUESTER / MANAGER ACTIONS
  if ((role === 'REQUESTER' || role === 'ADMIN') && permit.status === 'ACTIVE') {
    actions.push(`<button class="btn btn-warning btn-full" onclick="suspendPermit('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      Suspend Permit
    </button>`);
    actions.push(`<button class="btn btn-secondary btn-full" onclick="closePermit('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
      Close Permit
    </button>`);
  }

  if (permit.status === 'SUSPENDED' && (role === 'ADMIN' || role === 'APPROVER')) {
    actions.push(`<button class="btn btn-success btn-full" onclick="reactivatePermit('${permit.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Reactivate Permit
    </button>`);
  }

  if (actions.length === 0) return '';

  return `
    <div style="padding:var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);border-top:1px solid var(--border)">
      ${actions.join('')}
    </div>
  `;
}

function switchDetailTab(tab) {
  APP_STATE.currentDetailTab = tab;
  const permit = findPermit(APP_STATE.currentPermitId);
  document.getElementById('detail-tab-content').innerHTML = renderDetailTabContent(permit);
  document.querySelectorAll('.detail-tab').forEach(t => {
    t.classList.remove('active');
    if (t.textContent.trim().toLowerCase().includes(tab === 'timeline' ? 'audit' : tab)) {
      t.classList.add('active');
    }
  });
}

function approvePermit(id) {
  const permit = findPermit(id);
  if (!permit) return;

  if (permit.rams.status !== 'VALIDATED') {
    showToast('Cannot approve: RAMS document not validated', 'error', 4000); return;
  }

  permit.status = 'APPROVED';
  permit.approvedBy = 'Prakash Senghani';
  permit.approvedAt = new Date().toISOString();
  permit.auditLog.unshift({ action: 'Permit Approved', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'approve', detail: 'All conditions met. RAMS validated.' });

  showToast('Permit approved successfully!', 'success');
  renderPage('permit-detail');
}

function rejectPermit(id) {
  const permit = findPermit(id);
  if (!permit) return;
  permit.status = 'REJECTED';
  permit.auditLog.unshift({ action: 'Permit Rejected', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'reject' });
  showToast('Permit rejected', 'error');
  renderPage('permit-detail');
}

function suspendPermit(id) {
  const permit = findPermit(id);
  if (!permit) return;
  permit.status = 'SUSPENDED';
  permit.suspendedReason = 'Suspended by HSE Manager pending investigation.';
  permit.auditLog.unshift({ action: 'Permit Suspended', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'suspend', detail: 'Suspended by HSE Manager' });
  showToast('Permit suspended', 'warning');
  renderPage('permit-detail');
}

function reactivatePermit(id) {
  const permit = findPermit(id);
  if (!permit) return;
  permit.status = 'ACTIVE';
  permit.auditLog.unshift({ action: 'Permit Reactivated', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'activate' });
  showToast('Permit reactivated', 'success');
  renderPage('permit-detail');
}

function closePermit(id) {
  const permit = findPermit(id);
  if (!permit) return;
  permit.status = 'CLOSED';
  permit.auditLog.unshift({ action: 'Permit Closed', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'close', detail: 'Work completed. Site cleared.' });
  showToast('Permit closed', 'success');
  renderPage('permit-detail');
}

function validateRams(id) {
  const permit = findPermit(id);
  if (!permit) return;
  permit.rams.status = 'VALIDATED';
  permit.rams.files.forEach(f => { f.validated = true; f.validatedBy = 'Prakash Senghani'; });
  permit.auditLog.unshift({ action: 'RAMS Validated', user: 'Prakash Senghani', time: new Date().toISOString(), type: 'validate' });
  showToast('RAMS document validated', 'success');
  switchDetailTab('rams');
}

function simulateNewRamsVersion(id) {
  const permit = findPermit(id);
  if (!permit) return;
  const newVersion = permit.rams.files.length + 1;
  permit.rams.status = 'PENDING';
  permit.rams.files.unshift({
    name: `RAMS_Document_v${newVersion}.pdf`,
    size: '2.3 MB',
    type: 'pdf',
    version: newVersion,
    date: '2026-02-18',
    validated: false
  });
  permit.auditLog.unshift({ action: `RAMS Updated (v${newVersion})`, user: 'Prakash Senghani', time: new Date().toISOString(), type: 'upload', detail: 'New version uploaded. Validation reset.' });
  showToast('New RAMS version uploaded. Validation required.', 'warning', 4000);
  switchDetailTab('rams');
}

function showQrCode(id) {
  APP_STATE.currentPermitId = id;
  navigateTo('qr-view');
}

function logCheckIn(id) {
  const permit = findPermit(id);
  if (!permit) return;

  // Simulate check-in
  permit.auditLog.unshift({
    action: 'Safety Check Logged',
    user: APP_STATE.user.name,
    time: new Date().toISOString(),
    type: 'validate',
    detail: 'Zone safety verified. No hazards detected.'
  });

  showToast('Safety check logged successfully', 'success');
  renderPage('permit-detail');
}

function showStopWorkModal(id) {
  // Reuse the modal from watcher-dashboard if available, or simpler implementation here
  const reason = prompt("Enter reason for stopping work:");
  if (reason) {
    suspendPermit(id);
    const permit = findPermit(id);
    if (permit) permit.suspendedReason = reason;
  }
}
