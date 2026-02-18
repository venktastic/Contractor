
// ============================================
// WATCHER DASHBOARD - MODULE C
// Active Permit Monitoring & Check-ins
// ============================================

function renderWatcherDashboard() {
    const myPermits = PTW_DATA.permits.filter(p =>
        p.status === 'ACTIVE' &&
        (p.competentPerson?.id === APP_STATE.user.id || p.competentPerson === APP_STATE.user.id) // Handle object or ID
    );

    return `
    <div class="page-content">
      <div class="section-header">
        <h2 class="section-title">My Active Watch</h2>
        <p class="section-subtitle">Permits assigned to you for monitoring</p>
      </div>

      ${myPermits.length === 0 ? renderEmptyWatcher() : renderWatcherCards(myPermits)}
      
      <div class="card" style="margin-top:var(--space-4);background:var(--brand-secondary);color:#4a3b22">
         <div class="card-body" style="display:flex;align-items:center;gap:12px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
               <p style="font-weight:700">Next Scheduled Check-in</p>
               <p style="font-size:12px">Zone C - Hot Work in 15 mins</p>
            </div>
            <button class="btn btn-sm" style="margin-left:auto;background:white;color:var(--brand-secondary-dark)">Check In</button>
         </div>
      </div>
    </div>
  `;
}

function renderEmptyWatcher() {
    return `
    <div class="empty-state">
      <div class="empty-icon" style="background:rgba(212, 185, 149, 0.2);color:var(--brand-secondary)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><path d="M2 12h10"/><path d="M9 16v6"/><path d="M13 16v6"/><path d="M11 12l-5-5-1 1"/><path d="M11 12l5-5 1 1"/><circle cx="11" cy="7" r="2"/></svg>
      </div>
      <p class="empty-text">No Active Duties</p>
      <p class="empty-subtext">You have no active permits assigned to watch right now.</p>
    </div>
  `;
}

function renderWatcherCards(permits) {
    return `
    <div class="permit-list">
      ${permits.map(permit => `
        <div class="permit-card" onclick="navigateTo('active-permit', { permitId: '${permit.id}' })">
          <div class="permit-card-header">
            <span class="badge badge-success pulse">Live</span>
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-left:auto">Expires ${permit.endTime}</span>
          </div>
          
          <div style="margin:12px 0">
             <h3 class="permit-title" style="font-size:16px">${permit.typeName}</h3>
             <p style="font-size:12px;color:var(--text-secondary)">${permit.location} (${permit.zone})</p>
          </div>

          <div style="display:flex;gap:8px;margin-top:12px">
             <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation(); navigateTo('active-permit', { permitId: '${permit.id}' })">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="margin-right:4px"><polyline points="20 6 9 17 4 12"/></svg>
               Log Check
             </button>
             <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); showStopWorkModal('${permit.id}')">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
             </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showStopWorkModal(permitId) {
    showModal(`
      <div class="modal-overlay" id="active-modal">
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <h3 class="modal-title" style="color:var(--danger)">🛑 Stop Work Authority</h3>
          <p style="font-size:var(--font-size-sm);margin-bottom:var(--space-4)">
             You are initiating a Stop Work order for permit <strong>${permitId}</strong>. This will immediately suspend all activities.
          </p>
          <div class="form-group">
            <label class="form-label">Reason for Stoppage</label>
            <textarea class="form-textarea" placeholder="Describe the unsafe condition..."></textarea>
          </div>
          <div style="display:flex;gap:12px;margin-top:16px">
             <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
             <button class="btn btn-danger" style="flex:1">Confirm Stop</button>
          </div>
        </div>
      </div>
    `);
}
