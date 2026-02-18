// ============================================
// SIMOPS DASHBOARD - MODULE D
// ============================================

function renderSimopsDashboard() {
    const conflictPermits = PTW_DATA.permits.filter(p => p.simopsConflicts && p.simopsConflicts.length > 0);
    const totalConflicts = conflictPermits.length;

    return `
    <div class="simops-page">
      <!-- Header -->
      <div class="simops-header">
        <h1 class="simops-title">SIMOPS Monitor</h1>
        <p class="simops-subtitle">Simultaneous Operations Detection</p>
        ${totalConflicts > 0 ? `
          <div class="conflict-count-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${totalConflicts} Active Conflict${totalConflicts > 1 ? 's' : ''}
          </div>
        ` : `
          <div style="display:inline-flex;align-items:center;gap:var(--space-2);padding:6px 14px;background:var(--success-bg);border-radius:var(--radius-full);font-size:var(--font-size-sm);font-weight:700;color:var(--success);margin-top:var(--space-3)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            No Active Conflicts
          </div>
        `}
      </div>

      <!-- Zone Map -->
      <div class="zone-map">
        <div class="zone-map-header">
          🗺️ Zone Activity Map
          <span style="font-size:var(--font-size-xs);color:var(--text-muted);margin-left:var(--space-2)">Live view</span>
        </div>
        <div class="zone-grid">
          ${generateZoneGrid()}
        </div>
        <div style="display:flex;gap:var(--space-4);padding:var(--space-3);border-top:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:var(--text-muted)">
            <div style="width:10px;height:10px;border-radius:2px;background:rgba(45,198,83,0.2)"></div>Clear
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:var(--text-muted)">
            <div style="width:10px;height:10px;border-radius:2px;background:rgba(255,107,53,0.25)"></div>Active
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:var(--text-muted)">
            <div style="width:10px;height:10px;border-radius:2px;background:rgba(230,57,70,0.3)"></div>Conflict
          </div>
        </div>
      </div>

      <!-- Timeline View -->
      <div class="timeline-view">
        <div class="timeline-header">
          ⏱️ Today's Permit Timeline
          <span style="font-size:var(--font-size-xs);color:var(--text-muted);margin-left:var(--space-2)">18 Feb 2026</span>
        </div>
        <div class="timeline-bars">
          ${renderTimelineBars()}
        </div>
      </div>

      <!-- Active Conflicts -->
      ${totalConflicts > 0 ? `
        <div style="padding:0 var(--space-4) var(--space-4)">
          <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-3)">⚠ Active Conflicts</p>
          ${renderConflictCards()}
        </div>
      ` : ''}

      <!-- All Active Permits -->
      <div style="padding:0 var(--space-4) var(--space-4)">
        <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-3)">Active & Approved Permits</p>
        <div style="display:flex;flex-direction:column;gap:var(--space-2)">
          ${PTW_DATA.permits
            .filter(p => ['ACTIVE', 'APPROVED', 'UNDER_REVIEW'].includes(p.status))
            .map(p => renderSimopsPermitRow(p))
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function generateZoneGrid() {
    const zoneStatus = {
        'A': 'active', 'B': 'clear', 'C': 'active', 'D': 'clear',
        'E': 'conflict', 'F': 'clear', 'G': 'active', 'H': 'clear',
        'I': 'clear', 'J': 'clear', 'K': 'clear', 'L': 'empty'
    };

    return Object.entries(zoneStatus).map(([zone, status]) => `
    <div class="zone-cell ${status}" onclick="showToast('Zone ${zone}: ${status.charAt(0).toUpperCase() + status.slice(1)}', '${status === 'conflict' ? 'error' : status === 'active' ? 'warning' : 'info'}')">
      ${zone}
    </div>
  `).join('');
}

function renderTimelineBars() {
    const activePermits = PTW_DATA.permits.filter(p => ['ACTIVE', 'APPROVED', 'UNDER_REVIEW'].includes(p.status));

    return activePermits.map(p => {
        const startHour = parseInt(p.startTime?.split(':')[0] || 8);
        const endHour = parseInt(p.endTime?.split(':')[0] || 17);
        const leftPct = ((startHour - 6) / 14) * 100;
        const widthPct = ((endHour - startHour) / 14) * 100;
        const hasConflict = p.simopsConflicts && p.simopsConflicts.length > 0;

        return `
      <div class="timeline-bar-row">
        <span class="timeline-bar-label">${p.id.split('-').pop()}</span>
        <div class="timeline-bar-track">
          <div class="timeline-bar-fill" style="left:${leftPct}%;width:${widthPct}%;background:${hasConflict ? 'var(--danger)' : p.status === 'ACTIVE' ? 'var(--success)' : 'var(--info)'}">
            ${p.typeIcon}
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function renderConflictCards() {
    // The known conflict: PTW-0141 vs PTW-0143 in Zone E
    return `
    <div style="background:var(--danger-bg);border:1px solid rgba(230,57,70,0.4);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:var(--space-3)">
      <div style="background:rgba(230,57,70,0.15);padding:var(--space-3) var(--space-4);display:flex;align-items:center;gap:var(--space-2)">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--danger)">CONFLICT: Zone E — 19 Feb 2026</p>
      </div>
      <div style="padding:var(--space-4)">
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          ${['PTW-2026-0141', 'PTW-2026-0143'].map(id => {
        const p = findPermit(id);
        if (!p) return '';
        return `
              <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-3);cursor:pointer"
                   onclick="navigateTo('permit-detail', {permitId: '${p.id}'})">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
                  <p style="font-size:var(--font-size-xs);color:var(--text-muted);font-family:monospace">${p.id}</p>
                  <span class="badge ${getStatusBadgeClass(p.status)}">${getStatusLabel(p.status)}</span>
                </div>
                <p style="font-size:var(--font-size-sm);font-weight:600;color:var(--text-primary);margin-bottom:4px">${p.typeIcon} ${p.title}</p>
                <p style="font-size:var(--font-size-xs);color:var(--text-secondary)">${p.startTime}–${p.endTime} · ${p.contractor}</p>
              </div>
            `;
    }).join('')}
        </div>
        <div style="background:rgba(230,57,70,0.1);border-radius:var(--radius-sm);padding:var(--space-3);margin-top:var(--space-3)">
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p style="font-size:var(--font-size-xs);font-weight:700;color:var(--danger)">Overlap: 09:00–14:00 (5 hours)</p>
          </div>
          <p style="font-size:var(--font-size-xs);color:#FCA5A5">Both permits operate in Zone E (Basement) with overlapping time windows. Electrical work and confined space entry present combined high risk.</p>
        </div>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
          <button class="btn btn-secondary btn-sm" style="flex:1" onclick="navigateTo('permit-detail', {permitId: 'PTW-2026-0141'})">Review PTW-0141</button>
          <button class="btn btn-danger btn-sm" style="flex:1" onclick="showOverrideModal()">Override</button>
        </div>
      </div>
    </div>
  `;
}

function renderSimopsPermitRow(permit) {
    const hasConflict = permit.simopsConflicts && permit.simopsConflicts.length > 0;
    return `
    <div style="background:var(--bg-card);border:1px solid ${hasConflict ? 'rgba(230,57,70,0.4)' : 'var(--border)'};border-radius:var(--radius-md);padding:var(--space-3);cursor:pointer;display:flex;align-items:center;gap:var(--space-3)"
         onclick="navigateTo('permit-detail', {permitId: '${permit.id}'})">
      <span style="font-size:20px">${permit.typeIcon}</span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:var(--space-2)">
          <p style="font-size:var(--font-size-xs);color:var(--text-muted);font-family:monospace">${permit.id}</p>
          ${hasConflict ? '<span style="font-size:10px;color:var(--danger);font-weight:700">⚠ CONFLICT</span>' : ''}
        </div>
        <p style="font-size:var(--font-size-sm);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${permit.title}</p>
        <p style="font-size:var(--font-size-xs);color:var(--text-muted)">${permit.zone} · ${permit.startTime}–${permit.endTime}</p>
      </div>
      <span class="badge ${getStatusBadgeClass(permit.status)}">${getStatusLabel(permit.status)}</span>
    </div>
  `;
}
