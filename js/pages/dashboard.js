/* ============================================================
   dashboard.js — Enterprise Governance Dashboard
   ============================================================ */

let _dashTimeFilter = 'monthly';

function renderDashboard() {
  const role = APP_STATE.currentRole;
  const kpi = DB.enterpriseKPIs;
  const roleData = DB.roles[role];
  const contractors = scopeContractors(DB.contractors, role, APP_STATE.currentBU);
  const topRisk = [...contractors].sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);

  const container = document.getElementById('page-container');
  container.innerHTML = `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Enterprise Dashboard</div>
          <div class="page-subtitle">Contractor Risk Governance — Real-time Command Centre</div>
        </div>
        <div class="page-actions">
          <span id="demo-role-badge" style="
            padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;
            background:${roleData.color}22;color:${roleData.color};cursor:pointer;
            border:1px solid ${roleData.color}44" onclick="showRoleSwitcher()">
            ${roleData.title}
          </span>
          <button class="btn btn-secondary btn-sm" onclick="showRoleSwitcher()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            Switch Role (Demo)
          </button>
          <div style="display:flex;gap:4px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;padding:3px">
            <button class="btn btn-sm ${_dashTimeFilter === 'weekly' ? 'btn-primary' : 'btn-ghost'}" onclick="setDashFilter('weekly')">Weekly</button>
            <button class="btn btn-sm ${_dashTimeFilter === 'monthly' ? 'btn-primary' : 'btn-ghost'}" onclick="setDashFilter('monthly')">Monthly</button>
          </div>
        </div>
      </div>

      <!-- ── KPI Cards Row ── -->
      <div class="no-contractor-admin">
        <div class="kpi-grid-7" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px">
          ${kpiCard('Total Contractors', kpi.totalContractors, trendArrowGoodUp('up', kpi.totalContractorsPct), '#3B82F6', '🏢', 'navigateTo("contractors")')}
          ${kpiCard('Enterprise IFR', kpi.ifr.toFixed(1), trendArrow('up', kpi.ifrPct), '#EF4444', '📊', 'navigateTo("performance")', 'vs industry 3.8')}
          ${kpiCard('High Risk Contractors', kpi.highRisk, trendArrow('up', kpi.highRiskPct), '#F97316', '⚠️', 'navigateTo("contractors")')}
          ${kpiCard('Overdue Actions %', kpi.overdueActionsPct + '%', trendArrow('up', kpi.overdueActionsPctChange), '#DC2626', '🔴', 'navigateTo("contractors")')}
          ${kpiCard('Workforce Compliance', kpi.workforceCompliance + '%', trendArrowGoodUp('down', Math.abs(kpi.workforceCompliancePct)), '#10B981', '👷', 'navigateTo("workforce")')}
          ${kpiCard('Open Audit Findings', kpi.openAudits, trendArrow('up', kpi.openAuditsPct), '#8B5CF6', '🔍', 'navigateTo("compliance-alerts")')}
          ${kpiCard('Risk Exposure Score', kpi.riskExposureScore, trendArrow('up', kpi.riskExposurePct), '#F59E0B', '🎯', 'navigateTo("reports")', 'out of 100')}
        </div>
      </div>

      <!-- ── Top row: Ranking + Escalations ── -->
      <div style="display:grid;grid-template-columns:1fr 380px;gap:20px;margin-bottom:20px" class="bu-and-above">
        <!-- Contractor Risk Ranking -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Contractor Risk Ranking</div>
              <div class="card-subtitle">Sortable by all metrics · Click row to view profile</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('contractors')">View All →</button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr>
                <th>Rank</th>
                <th>Contractor</th>
                <th>IFR</th>
                <th>Overdue %</th>
                <th>Compliance</th>
                <th>Risk Score</th>
                <th>Escalation</th>
              </tr></thead>
              <tbody>
                ${topRisk.map((c, i) => {
    const esc = checkEscalation(c);
    const actions = getActionsByContractor(c.id);
    const overduePct = actions.length > 0 ? Math.round(actions.filter(a => a.status === 'Overdue').length / actions.length * 100) : 0;
    const rankColors = ['#F59E0B', '#94A3B8', '#CD7F32'];
    const rankStyle = i < 3 ? `background:${rankColors[i]};color:#fff` : 'background:var(--bg-elevated);color:var(--text-muted)';
    return `<tr onclick="navigateTo('contractor-profile',{id:'${c.id}'})" style="cursor:pointer">
                      <td><div style="width:24px;height:24px;border-radius:50%;${rankStyle};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">${i + 1}</div></td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div class="contractor-initials" style="width:30px;height:30px;border-radius:6px;font-size:11px">${getInitials(c.name)}</div>
                          <div>
                            <div class="col-name" style="font-size:13px">${c.name}</div>
                            <div class="col-muted">${c.riskLevel} Risk</div>
                          </div>
                        </div>
                      </td>
                      <td><span style="font-weight:700;color:${c.ifr > 5 ? 'var(--color-noncompliant)' : c.ifr > 2 ? 'var(--color-expiring)' : 'var(--color-compliant)'}">${c.ifr}</span> ${ifrTrendBadge(c.ifrTrend)}</td>
                      <td><span style="font-weight:700;color:${overduePct > 20 ? 'var(--color-noncompliant)' : 'var(--text-primary)'}">${overduePct}%</span></td>
                      <td>${complianceBadge(c.compliancePercent)}</td>
                      <td><span style="font-weight:800;color:${getRiskColor(c.riskLevel)};font-size:16px">${c.riskScore}</span></td>
                      <td>${c.riskLevel !== 'Low' ? '<span class="badge badge-noncompliant" style="font-size:10px;animation:pulse 2s infinite">⚡ Escalate</span>' : '<span class="badge badge-compliant" style="font-size:10px">✓ OK</span>'}</td>
                    </tr>`;
  }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Escalation Panel -->
        <div class="card enterprise-only">
          <div class="card-header">
            <div class="card-title">🚨 Open Escalations</div>
            <span class="badge badge-noncompliant">${DB.escalationLog.filter(e => e.status === 'Open').length} Open</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;padding-bottom:4px">
            ${DB.escalationLog.map(e => `
              <div style="border:1.5px solid ${e.status === 'Open' ? 'var(--color-noncompliant)' : 'var(--border)'};
                border-radius:10px;padding:12px;background:${e.status === 'Open' ? 'rgba(220,38,38,0.05)' : 'var(--bg-elevated)'}">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                  <div style="font-weight:700;font-size:13px;color:var(--text-primary)">${e.contractor}</div>
                  <span class="badge ${e.status === 'Open' ? 'badge-noncompliant' : 'badge-compliant'}" style="font-size:10px;white-space:nowrap">${e.status}</span>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin:4px 0">${e.trigger}</div>
                <div style="font-size:10px;color:var(--text-muted)">${e.date}</div>
                ${e.status === 'Open' ? `
                  <div style="display:flex;gap:6px;margin-top:8px">
                    <button class="btn btn-sm btn-primary" style="font-size:10px;padding:4px 8px"
                      onclick="event.stopPropagation();promptEscalationReview('${e.contractorId}')">Mark Reviewed</button>
                    <button class="btn btn-sm btn-ghost" style="font-size:10px;padding:4px 8px"
                      onclick="navigateTo('contractor-profile',{id:'${e.contractorId}'})">View Profile</button>
                  </div>` : `<div style="font-size:11px;color:var(--text-muted);margin-top:6px">Reviewed by ${e.reviewedBy} · ${e.reviewDate}</div>`}
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- ── Cross-Asset Benchmarking ── -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px" class="bu-and-above">
        <!-- IFR by Project -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 IFR by Project</div>
            <div class="card-subtitle">Industry benchmark: 3.8</div>
          </div>
          <div style="padding:0 4px 16px">
            ${DB.projectBenchmarks.map(p => {
    const pct = Math.min((p.ifr / 16) * 100, 100);
    const color = p.ifr > 7 ? 'var(--color-noncompliant)' : p.ifr > 3.8 ? 'var(--color-expiring)' : 'var(--color-compliant)';
    return `<div style="margin-bottom:10px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:12px;font-weight:600;color:var(--text-primary)">${p.name}</span>
                    <span style="font-size:12px;font-weight:800;color:${color}">${p.ifr}</span>
                  </div>
                  <div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden">
                    <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width 0.5s ease"></div>
                  </div>
                </div>`;
  }).join('')}
            <div style="display:flex;align-items:center;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
              <div style="height:2px;width:30px;background:var(--text-muted);border-style:dashed"></div>
              <span style="font-size:11px;color:var(--text-muted)">Industry benchmark: 3.8</span>
            </div>
          </div>
        </div>

        <!-- Compliance by BU -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">✅ Compliance % by Project</div>
          </div>
          <div style="padding:16px 8px;display:flex;align-items:flex-end;gap:24px;justify-content:center;height:180px">
            ${DB.buBenchmarks.map(bu => {
    const color = bu.compliance >= 85 ? 'var(--color-compliant)' : bu.compliance >= 70 ? 'var(--color-expiring)' : 'var(--color-noncompliant)';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1">
                  <div style="font-weight:800;font-size:14px;color:${color}">${bu.compliance}%</div>
                  <div style="width:100%;background:${color};border-radius:6px 6px 0 0;height:${bu.compliance}px;max-height:130px;transition:height 0.5s ease"></div>
                  <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-align:center">${bu.name}</div>
                  <div style="font-size:10px;color:var(--text-muted)">${bu.contractors} contractors</div>
                </div>`;
  }).join('')}
          </div>
        </div>
      </div>

      <!-- ── Risk Quadrant ── -->
      <div class="card enterprise-only" style="margin-bottom:20px">
        <div class="card-header">
          <div>
            <div class="card-title">🎯 Risk Quadrant — IFR vs Corrective Action Closure Speed</div>
            <div class="card-subtitle">X-axis: Incident Frequency Rate · Y-axis: Closure Speed (days) · Bubble = Risk Score</div>
          </div>
        </div>
        <div style="position:relative;height:320px;margin:16px 16px 40px;border-left:2px solid var(--border);border-bottom:2px solid var(--border)">
          <!-- Quadrant Labels -->
          <div style="position:absolute;top:4px;right:4px;font-size:10px;font-weight:700;color:var(--color-noncompliant);opacity:0.6">HIGH RISK / POOR CONTROL ▼</div>
          <div style="position:absolute;top:4px;left:4px;font-size:10px;font-weight:700;color:var(--color-expiring);opacity:0.6">▼ DETERIORATING</div>
          <div style="position:absolute;bottom:28px;left:4px;font-size:10px;font-weight:700;color:var(--color-compliant);opacity:0.6">▲ HIGH PERFORMING</div>
          <div style="position:absolute;bottom:28px;right:4px;font-size:10px;font-weight:700;color:var(--color-expiring);opacity:0.6">IMPROVING ▲</div>
          <!-- Divider lines -->
          <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:var(--border);opacity:0.5"></div>
          <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--border);opacity:0.5"></div>

          <!-- Plot contractors (exclude Draft/BlueWave with no data) -->
          ${contractors.filter(c => c.ifr !== undefined && c.closureSpeed !== undefined && c.workerCount > 0).map(c => {
    // X = IFR (0-16 maps to 0-100%), Y = closureSpeed (0-50 maps to 100-0%)
    const x = Math.min((c.ifr / 14) * 100, 95);
    const y = Math.max(100 - Math.min((c.closureSpeed / 45) * 100, 95), 5);
    const size = Math.max(28, Math.min(c.riskScore / 3, 48));
    const color = getRiskColor(c.riskLevel);
    return `<div style="
                position:absolute;
                left:${x}%;top:${y}%;
                width:${size}px;height:${size}px;
                transform:translate(-50%,-50%);
                background:${color}cc;border:2px solid ${color};
                border-radius:50%;cursor:pointer;
                display:flex;align-items:center;justify-content:center;
                font-size:9px;font-weight:800;color:#fff;
                transition:transform 0.2s;z-index:2"
                title="${c.name} | IFR: ${c.ifr} | Closure: ${c.closureSpeed}d | Score: ${c.riskScore}"
                onclick="navigateTo('contractor-profile',{id:'${c.id}'})"
                onmouseover="this.style.transform='translate(-50%,-50%) scale(1.3)'"
                onmouseout="this.style.transform='translate(-50%,-50%) scale(1)'"
              >${getInitials(c.name)}</div>`;
  }).join('')}

          <!-- Axis Labels -->
          <div style="position:absolute;bottom:-28px;left:0;right:0;text-align:center;font-size:11px;color:var(--text-muted);font-weight:600">Incident Frequency Rate (IFR) →</div>
          <div style="position:absolute;top:50%;left:-52px;transform:translateY(-50%) rotate(-90deg);font-size:11px;color:var(--text-muted);font-weight:600;white-space:nowrap">← Closure Speed (days)</div>
        </div>
        <!-- Legend -->
        <div style="display:flex;gap:16px;flex-wrap:wrap;padding:0 16px 16px">
          ${['Low', 'Medium', 'High', 'Critical'].map(l => `
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:12px;height:12px;border-radius:50%;background:${getRiskColor(l)}"></div>
              <span style="font-size:11px;color:var(--text-muted)">${l} Risk</span>
            </div>`).join('')}
          <span style="font-size:11px;color:var(--text-muted);margin-left:8px">· Bubble size = Risk Score · Click to open profile</span>
        </div>
      </div>

      <!-- ── Incident Trend ── -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px" class="no-contractor-admin">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 Enterprise Incident Trend</div>
          </div>
          <div id="incident-chart" style="height:160px;padding:0 8px 8px"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">📋 Compliance Trend</div>
          </div>
          <div id="compliance-chart" style="height:160px;padding:0 8px 8px"></div>
        </div>
      </div>
    </div>`;

  // Render bar charts
  const trend = DB.performanceTrend[_dashTimeFilter];
  renderBarChart('incident-chart', trend.labels, trend.incidents, 'red');
  renderBarChart('compliance-chart', trend.labels, trend.compliance, 'blue');

  // Apply role permissions
  applyRolePermissions(APP_STATE.currentRole);
}

function kpiCard(title, value, trendHtml, color, icon, clickFn, sub = '') {
  return `
    <div class="kpi-card" onclick="${clickFn}" style="cursor:pointer;position:relative;overflow:hidden;border-top:3px solid ${color}">
      <div style="position:absolute;top:-10px;right:-10px;font-size:48px;opacity:0.08">${icon}</div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">${title}</div>
      <div style="font-size:28px;font-weight:900;color:var(--text-primary);line-height:1;margin-bottom:6px">${value}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>${trendHtml} <span style="font-size:10px;color:var(--text-muted)">vs last period</span></div>
        ${sub ? `<div style="font-size:10px;color:var(--text-muted)">${sub}</div>` : ''}
      </div>
    </div>`;
}

function setDashFilter(filter) {
  _dashTimeFilter = filter;
  renderDashboard();
}

function promptEscalationReview(contractorId) {
  const role = APP_STATE.currentRole;
  const roleData = DB.roles[role];
  const html = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:400px">
        <div class="modal-header">
          <div class="modal-title">Mark Escalation Reviewed</div>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
          <div style="font-size:13px;color:var(--text-secondary)">Add intervention notes before marking as reviewed:</div>
          <textarea id="esc-notes" rows="4" class="form-input"
            placeholder="e.g. Monthly audit scheduled. Contractor issued formal warning. Follow-up due 28 Feb 2026..."
            style="resize:vertical"></textarea>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="
              const notes = document.getElementById('esc-notes').value;
              if(!notes.trim()){showToast('Please add intervention notes','warning');return;}
              markEscalationReviewed('${contractorId}','${roleData.name}',notes);
              closeModal();
              showToast('Escalation marked as reviewed','success');
              renderDashboard();">
              Confirm Review
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;
  openModal(html);
}
