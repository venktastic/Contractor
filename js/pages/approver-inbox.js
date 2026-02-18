
// ============================================
// APPROVER INBOX - MODULE B
// Management of Pending Permits
// ============================================

function renderApproverInbox() {
    const pendingPermits = PTW_DATA.permits.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');

    return `
    <div class="page-content">
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <h2 class="section-title">Approval Queue</h2>
          <p class="section-subtitle">You have ${pendingPermits.length} permits awaiting review</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="renderApproverInbox()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1 2.12-9.36L23 10"/></svg>
        </button>
      </div>

      ${pendingPermits.length === 0 ? renderEmptyInbox() : renderPermitCards(pendingPermits)}
    </div>
  `;
}

function renderEmptyInbox() {
    return `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="48" height="48"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </div>
      <p class="empty-text">All caught up!</p>
      <p class="empty-subtext">There are no permits pending your approval at this time.</p>
    </div>
  `;
}

function renderPermitCards(permits) {
    return `
    <div class="permit-list">
      ${permits.map(permit => `
        <div class="permit-card" onclick="navigateTo('permit-detail', { permitId: '${permit.id}' })">
          <div class="permit-card-header">
            <div class="permit-icon-wrapper" style="background:${getPermitType(permit.type)?.color || '#999'}22">
               <span style="font-size:20px">${permit.typeIcon || '📄'}</span>
            </div>
            <div class="permit-info">
              <h3 class="permit-id">${permit.id}</h3>
              <p class="permit-title">${permit.typeName}</p>
            </div>
            <span class="badge ${getStatusBadgeClass(permit.status)}">${getStatusLabel(permit.status)}</span>
          </div>
          
          <div class="permit-details">
            <div class="permit-detail-item">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${permit.location}</span>
            </div>
            <div class="permit-detail-item">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${formatDate(permit.startDate)} · ${permit.startTime}-${permit.endTime}</span>
            </div>
          </div>

          <div class="permit-card-footer" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
             <div style="display:flex;align-items:center;gap:8px">
               <div class="user-avatar" style="width:24px;height:24px;font-size:10px">${getInitials(permit.supervisor)}</div>
               <span style="font-size:12px;color:var(--text-secondary)">${permit.supervisor}</span>
             </div>
             ${permit.riskLevel === 'HIGH' || permit.riskLevel === 'CRITICAL' ? `
               <span class="badge badge-danger" style="margin-left:auto">High Risk</span>
             ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getInitials(name) {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
}
