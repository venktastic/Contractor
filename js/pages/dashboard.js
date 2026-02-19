// ============================================
// DASHBOARD PAGE
// ============================================

function renderDashboard() {
  const dateStr = 'Monday, 24 February 2026';

  const active = PTW_DATA.permits.filter(p => p.status === 'ACTIVE').length;
  const approved = PTW_DATA.permits.filter(p => p.status === 'APPROVED').length;
  const underReview = PTW_DATA.permits.filter(p => p.status === 'UNDER_REVIEW').length;
  const suspended = PTW_DATA.permits.filter(p => p.status === 'SUSPENDED').length;
  const conflicts = PTW_DATA.permits.filter(p => p.simopsConflicts && p.simopsConflicts.length > 0).length;

  const recentPermits = PTW_DATA.permits.slice(0, 3);

  return `
    <div class="dashboard-page">
      <!-- Hero -->
      <div class="dashboard-hero">
        <p class="hero-greeting">Permit to Work</p>
        <h1 class="hero-title" style="color:white;background:none;-webkit-background-clip:unset;-webkit-text-fill-color:white">Prakash Senghani</h1>
        <p class="hero-date">📅 ${dateStr}</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card" onclick="navigateTo('permit-list')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p class="stat-label">Active Permits</p>
              <p class="stat-value" style="color:var(--success)">${active}</p>
            </div>
            <div class="stat-icon" style="background:var(--success-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 18 15 15"/><line x1="12" y1="12" x2="12" y2="18"/></svg>
            </div>
          </div>
          <p class="stat-change up">↑ 2 from yesterday</p>
        </div>

        <div class="stat-card" onclick="navigateTo('permit-list')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p class="stat-label">Under Review</p>
              <p class="stat-value" style="color:#A78BFA">${underReview}</p>
            </div>
            <div class="stat-icon" style="background:var(--purple-light)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>
          <p class="stat-change" style="color:var(--text-muted)">Awaiting approval</p>
        </div>

        <div class="stat-card" onclick="navigateTo('simops-dashboard')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p class="stat-label">SIMOPS Conflicts</p>
              <p class="stat-value" style="color:var(--danger)">${conflicts}</p>
            </div>
            <div class="stat-icon" style="background:var(--danger-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <p class="stat-change down">⚠ Requires attention</p>
        </div>

        <div class="stat-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p class="stat-label">Suspended</p>
              <p class="stat-value" style="color:var(--warning)">${suspended}</p>
            </div>
            <div class="stat-icon" style="background:var(--warning-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </div>
          </div>
          <p class="stat-change" style="color:var(--warning)">Investigate now</p>
        </div>
      </div>

      <!-- SIMOPS Alert -->
      ${conflicts > 0 ? `
      <div class="simops-alert-banner" onclick="navigateTo('simops-dashboard')">
        <div class="simops-alert-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <h4>⚠ SIMOPS CONFLICT ACTIVE</h4>
        </div>
        <p class="simops-alert-body">${conflicts} simultaneous operation conflict detected in Zone E. PTW-2026-0141 and PTW-2026-0143 overlap on 19 Feb 2026 (08:00–14:00). Tap to review.</p>
      </div>
      ` : ''}

      <!-- Quick Actions -->
      <div class="section-header">
        <div>
          <p class="section-title">Quick Actions</p>
        </div>
      </div>
      <div class="quick-actions">
        <button class="quick-action-btn" onclick="navigateTo('create-permit')">
          <div class="quick-action-icon" style="background:var(--danger-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <p class="quick-action-label">New PTW</p>
          <p class="quick-action-sub">Create permit</p>
        </button>
        <button class="quick-action-btn" onclick="navigateTo('simops-dashboard')">
          <div class="quick-action-icon" style="background:var(--warning-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          </div>
          <p class="quick-action-label">SIMOPS</p>
          <p class="quick-action-sub">View conflicts</p>
        </button>
        <button class="quick-action-btn" onclick="navigateTo('permit-list')">
          <div class="quick-action-icon" style="background:var(--info-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <p class="quick-action-label">All Permits</p>
          <p class="quick-action-sub">View & manage</p>
        </button>
        <button class="quick-action-btn" onclick="navigateTo('audit-log')">
          <div class="quick-action-icon" style="background:var(--purple-light)">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <p class="quick-action-label">Audit Log</p>
          <p class="quick-action-sub">Activity trail</p>
        </button>
      </div>

      <!-- Recent Permits -->
      <div class="section-header">
        <div>
          <p class="section-title">Recent Permits</p>
          <p class="section-subtitle">Today's activity</p>
        </div>
        <span class="section-action" onclick="navigateTo('permit-list')">View all</span>
      </div>
      <div style="padding: 0 var(--space-4); display:flex; flex-direction:column; gap:var(--space-3)">
        ${recentPermits.map(p => renderPermitCard(p)).join('')}
      </div>
    </div>
  `;
}

function renderPermitCard(permit) {
  const statusClass = getStatusBadgeClass(permit.status);
  const statusLabel = getStatusLabel(permit.status);
  const riskClass = getRiskBadgeClass(permit.riskLevel);

  return `
    <div class="permit-card risk-${permit.riskLevel.toLowerCase()}-card" onclick="navigateTo('permit-detail', {permitId: '${permit.id}'})">
      <div class="permit-card-header">
        <div>
          <p class="permit-card-id">${permit.id}</p>
          <p class="permit-card-title">${permit.typeIcon} ${permit.title}</p>
        </div>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="permit-card-meta">
        <span class="permit-card-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${permit.location}
        </span>
        <span class="permit-card-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${permit.startDate} ${permit.startTime}–${permit.endTime}
        </span>
        <span class="risk-badge ${riskClass}">${permit.riskLevel}</span>
        ${permit.simopsConflicts && permit.simopsConflicts.length > 0 ? `<span style="color:var(--danger);font-size:11px;font-weight:700">⚠ SIMOPS</span>` : ''}
      </div>
    </div>
  `;
}
