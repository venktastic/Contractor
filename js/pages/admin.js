// ============================================
// ADMIN CONFIGURATION PAGE
// ============================================

function renderAdmin() {
    return `
    <div class="admin-page">
      <!-- Profile Section -->
      <div style="background:linear-gradient(135deg,#1E293B,#0F172A);padding:var(--space-6) var(--space-4);text-align:center;border-bottom:1px solid var(--border)">
        <div class="avatar-lg" style="width:64px;height:64px;font-size:var(--font-size-lg);margin:0 auto var(--space-3)">JD</div>
        <p style="font-size:var(--font-size-lg);font-weight:700;color:var(--text-primary)">John Davies</p>
        <p style="font-size:var(--font-size-sm);color:var(--text-muted)">HSE Manager · Enterprise License</p>
        <div style="display:flex;gap:var(--space-2);justify-content:center;margin-top:var(--space-3)">
          <span class="badge badge-approved">Full Access</span>
          <span class="badge badge-active">Admin</span>
        </div>
      </div>

      <!-- Workflow Configuration -->
      <div class="admin-section">
        <p class="admin-section-header">Workflow Configuration</p>
        ${adminRow('🔧', 'Permit Types', 'Configure permit categories and risk levels', 'var(--warning-bg)', 'var(--warning)')}
        ${adminRow('📋', 'Approval Workflow', 'Set approval chains and escalation rules', 'var(--info-bg)', '#38BDF8')}
        ${adminRow('⏱️', 'Time Limits', 'Max permit duration and renewal rules', 'var(--purple-light)', 'var(--purple)')}
        ${adminRow('🔔', 'Notifications', 'Configure alerts and reminder schedules', 'var(--success-bg)', 'var(--success)')}
      </div>

      <!-- RAMS Settings -->
      <div class="admin-section">
        <p class="admin-section-header">RAMS & Safety</p>
        <div class="admin-row">
          <div class="admin-row-left">
            <div class="admin-row-icon" style="background:var(--danger-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p class="admin-row-title">Mandatory RAMS</p>
              <p class="admin-row-sub">Require RAMS before approval</p>
            </div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked onchange="showToast('Setting saved', 'success')" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="admin-row">
          <div class="admin-row-left">
            <div class="admin-row-icon" style="background:var(--warning-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </div>
            <div>
              <p class="admin-row-title">SIMOPS Auto-Detection</p>
              <p class="admin-row-sub">Detect conflicts on submission</p>
            </div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked onchange="showToast('Setting saved', 'success')" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="admin-row">
          <div class="admin-row-left">
            <div class="admin-row-icon" style="background:var(--success-bg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div>
              <p class="admin-row-title">QR Code Generation</p>
              <p class="admin-row-sub">Auto-generate on approval</p>
            </div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked onchange="showToast('Setting saved', 'success')" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${adminRow('📁', 'Accepted File Types', 'PDF, DOC, DOCX, JPG, PNG', 'var(--info-bg)', '#38BDF8')}
      </div>

      <!-- Zone Management -->
      <div class="admin-section">
        <p class="admin-section-header">Zone Management</p>
        ${adminRow('🗺️', 'Manage Zones', `${PTW_DATA.zones.length} zones configured`, 'var(--purple-light)', 'var(--purple)')}
        ${adminRow('👥', 'Contractors', `${PTW_DATA.contractors.length} contractors registered`, 'var(--info-bg)', '#38BDF8')}
        ${adminRow('🏗️', 'Supervisors', `${PTW_DATA.supervisors.length} supervisors on file`, 'var(--success-bg)', 'var(--success)')}
      </div>

      <!-- System -->
      <div class="admin-section">
        <p class="admin-section-header">System</p>
        ${adminRow('📊', 'Reports & Analytics', 'Export permit data and trends', 'var(--warning-bg)', 'var(--warning)')}
        ${adminRow('🔒', 'Role Permissions', 'Manage user roles and access', 'var(--danger-bg)', 'var(--danger)')}
        ${adminRow('💾', 'Data Backup', 'Last backup: Today 06:00', 'var(--success-bg)', 'var(--success)')}
        ${adminRow('ℹ️', 'App Version', 'SafeWork PTW v2.4.1', 'rgba(100,116,139,0.15)', 'var(--gray-400)')}
      </div>

      <div style="height:var(--space-8)"></div>
    </div>
  `;
}

function adminRow(icon, title, sub, bg, color) {
    return `
    <div class="admin-row" onclick="showToast('Opening ${title}...', 'info')">
      <div class="admin-row-left">
        <div class="admin-row-icon" style="background:${bg}">
          <span style="font-size:16px">${icon}</span>
        </div>
        <div>
          <p class="admin-row-title">${title}</p>
          <p class="admin-row-sub">${sub}</p>
        </div>
      </div>
      <div class="admin-row-right">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  `;
}
