/* ============================================================
   HSW Digital — Settings Page
   page-settings.js — Enterprise settings with RBAC visibility
   ============================================================ */

window.renderSettings = function () {
  const role = APP_STATE.currentRole;
  const isAdmin = ['enterprise-hse'].includes(role);
  const container = document.getElementById('page-container');

  container.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Settings</div>
        <div class="page-subtitle">Portal configuration, notifications, thresholds and user access</div>
      </div>
      <button class="btn btn-primary" onclick="showToast('Settings saved','success')">Save Changes</button>
    </div>

    <div class="grid grid-2" style="gap:16px">

      <!-- Company Info -->
      <div class="card">
        <div class="card-header"><div class="card-title">🏢 Company Information</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group" style="margin:0">
            <label class="form-label">Company Name</label>
            <input type="text" class="form-input" value="nAI Client Portal">
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">ABN</label>
            <input type="text" class="form-input" value="12 345 678 901">
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">HSE Contact Email</label>
            <input type="email" class="form-input" value="hse@hswdigital.com.au">
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Default Business Unit</label>
            <select class="form-select">
              <option>All Business Units</option>
              ${DB.businessUnits.map(bu => `<option>${bu.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card">
        <div class="card-header"><div class="card-title">🔔 Notifications</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:0">
          ${[
      { label: 'Email alerts for expiring documents', checked: true, detail: 'Triggered 30 days before expiry' },
      { label: 'Email digest for overdue actions', checked: true, detail: 'Sent every Monday' },
      { label: 'Escalation notifications', checked: true, detail: 'Immediate for critical risk' },
      { label: 'AI risk alerts', checked: false, detail: 'Predictive flag notifications' },
      { label: 'New contractor submission alerts', checked: true, detail: 'Approvers notified on submission' }
    ].map(n => `
            <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border-subtle)">
              <div>
                <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${n.label}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${n.detail}</div>
              </div>
              <label style="position:relative;display:inline-flex;align-items:center;cursor:pointer;flex-shrink:0">
                <input type="checkbox" ${n.checked ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="this.nextElementSibling.style.background=this.checked?'var(--primary)':'var(--bg-elevated)'">
                <div style="width:40px;height:22px;border-radius:11px;background:${n.checked ? 'var(--primary)' : 'var(--bg-elevated)'};border:1px solid var(--border);transition:background 0.2s;position:relative">
                  <div style="position:absolute;top:2px;left:${n.checked ? '19px' : '2px'};width:16px;height:16px;border-radius:50%;background:${n.checked ? 'white' : 'var(--text-muted)'};transition:left 0.2s"></div>
                </div>
              </label>
            </div>`).join('')}
        </div>
      </div>

      <!-- Risk Thresholds -->
      <div class="card ${!isAdmin ? 'no-contractor-admin' : ''}">
        <div class="card-header">
          <div class="card-title">⚡ Risk & Escalation Thresholds</div>
          <span class="badge badge-primary">Enterprise Only</span>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          ${[
      { label: 'Auto-Escalation — Overdue Actions %', val: '30', unit: '%' },
      { label: 'Auto-Escalation — IFR Threshold', val: '1.5', unit: 'IFR' },
      { label: 'Auto-Escalation — Compliance Below', val: '70', unit: '%' },
      { label: 'Document Expiry Warning (days)', val: '30', unit: 'days' },
      { label: 'Critical Risk Review Interval (months)', val: '3', unit: 'mths' }
    ].map(t => `
            <div style="display:flex;align-items:center;justify-content:space-between">
              <label style="font-size:12px;font-weight:600;color:var(--text-secondary);flex:1">${t.label}</label>
              <div style="display:flex;align-items:center;gap:6px">
                <input type="number" class="form-input" value="${t.val}" style="width:70px;text-align:center">
                <span style="font-size:11px;color:var(--text-muted)">${t.unit}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- User Access -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">👥 Role & Access Simulation</div>
          <div class="card-subtitle" style="font-size:11px">Demo: switch between governance roles</div>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
          ${Object.entries(DB.roles).map(([key, r]) => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;border:2px solid ${APP_STATE.currentRole === key ? r.color : 'var(--border)'};background:${APP_STATE.currentRole === key ? r.color + '12' : 'var(--bg-elevated)'};cursor:pointer" onclick="switchRole('${key}')">
              <div class="user-avatar" style="background:${r.color};width:32px;height:32px;font-size:10px">${r.initials}</div>
              <div style="flex:1">
                <div style="font-weight:700;font-size:12px;color:var(--text-primary)">${r.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${r.title}</div>
              </div>
              ${APP_STATE.currentRole === key ? `<span style="font-size:10px;font-weight:800;color:${r.color}">● ACTIVE</span>` : ''}
            </div>`).join('')}
        </div>
      </div>

      <!-- System Maintenance -->
      <div class="card full-width">
        <div class="card-header"><div class="card-title">🛠 System Maintenance</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
            ${[
      { label: 'Clear Local Cache', detail: 'Reset all cached data and application state', action: "localStorage.clear();window.location.reload()", btn: 'Clear Cache', type: 'secondary' },
      { label: 'Force Data Refresh', detail: 'Re-sync all contractor records from source', action: "showToast('Data refresh queued','info')", btn: 'Refresh Data', type: 'secondary' },
      { label: 'Export All Data', detail: 'Download full portfolio data as CSV', action: "exportToCSV('full-export')", btn: 'Export All', type: 'primary' }
    ].map(m => `
              <div style="padding:16px;background:var(--bg-elevated);border-radius:10px;border:1px solid var(--border)">
                <div style="font-weight:700;font-size:13px;color:var(--text-primary);margin-bottom:4px">${m.label}</div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">${m.detail}</div>
                <button class="btn btn-${m.type} btn-sm" onclick="${m.action}">${m.btn}</button>
              </div>`).join('')}
          </div>
        </div>
      </div>

    </div>
  </div>`;
};
