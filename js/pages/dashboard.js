/* ============================================================
   HSW Digital — Enterprise Dashboard
   dashboard.js — Role-aware KPI + Benchmarking + Escalations
   ============================================================ */

window.renderDashboard = function () {
  const role = APP_STATE.currentRole;
  const kpi = DB.enterpriseKPIs;
  const tf = APP_TIME_FILTER;
  const trend = DB.performanceTrend[tf];

  const isEnterprise = role === 'enterprise-hse';
  const isBUAbove = ['enterprise-hse', 'bu-hse'].includes(role);
  const isContractorAdmin = role === 'contractor-admin';

  const container = document.getElementById('page-container');

  // Escalation banner
  const openEscalations = DB.escalationLog.filter(e => e.status === 'Open');

  container.innerHTML = `
  <div class="page">

    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-area">
        <div class="page-title">
          ${isEnterprise ? '🏢 Enterprise' : isBUAbove ? '📊 Business Unit' : '📋'} Dashboard
        </div>
        <div class="page-subtitle">${isEnterprise ? 'Real-time contractor risk command centre across all assets' : 'Contractor performance overview for your scope'}</div>
      </div>
      <div class="page-actions">
        ${isEnterprise ? `<button class="btn btn-secondary" onclick="exportToCSV('enterprise-kpi-report')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report</button>` : ''}
        <button class="btn btn-primary" onclick="navigateTo('contractors')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          All Contractors</button>
      </div>
    </div>

    <!-- Escalation Banner -->
    ${openEscalations.length > 0 && isBUAbove ? `
    <div class="escalation-banner" style="margin-bottom:20px">
      <div class="escalation-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        ${openEscalations.length} Escalation${openEscalations.length > 1 ? 's' : ''} Open
      </div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:#991B1B">Enterprise Reviews Required</div>
        <div style="font-size:12px;color:#B91C1C;margin-top:2px">${openEscalations.map(e => e.contractor).join(' · ')}</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="navigateTo('compliance-alerts')">View Escalations</button>
    </div>` : ''}

    <!-- KPI Cards Row -->
    <div class="grid grid-4" style="margin-bottom:20px">

      <div class="kpi-card trend-down" onclick="navigateTo('contractors')">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Active Contractors</div>
            <div class="kpi-value">${kpi.activeContractors}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--primary-light)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="kpi-trend down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
          <span>+${kpi.activeContractorsPct}%</span>
          <span class="kpi-change">vs last period</span>
        </div>
      </div>

      <div class="kpi-card trend-up" onclick="navigateTo('performance')">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Incident Freq. Rate</div>
            <div class="kpi-value">${kpi.ifr}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--danger-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
        </div>
        <div class="kpi-trend up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>+${kpi.ifrPct}%</span>
          <span class="kpi-change">↑ Requires attention</span>
        </div>
      </div>

      <div class="kpi-card trend-up" onclick="showHighRiskContractors()">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">High Risk Contractors</div>
            <div class="kpi-value">${kpi.highRisk}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--orange-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
        <div class="kpi-trend up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>+${kpi.highRiskPct}%</span>
          <span class="kpi-change">High + Critical</span>
        </div>
      </div>

      <div class="kpi-card trend-up" onclick="navigateTo('compliance-alerts')">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Overdue Actions %</div>
            <div class="kpi-value">${kpi.overdueActionsPct}%</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--danger-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="kpi-trend up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>+${kpi.overdueActionsPctChange}pp</span>
          <span class="kpi-change">Action required</span>
        </div>
      </div>

      <div class="kpi-card trend-down">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Workforce Compliance</div>
            <div class="kpi-value">${kpi.workforceCompliance}%</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--success-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
        <div class="kpi-trend down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
          <span>${kpi.workforceCompliancePct}%</span>
          <span class="kpi-change">${kpi.compliantWorkers}/${kpi.totalWorkers} workers</span>
        </div>
      </div>

      <div class="kpi-card trend-up no-contractor-admin" onclick="navigateTo('compliance-alerts')">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Open Audit Findings</div>
            <div class="kpi-value">${kpi.openAudits}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--warning-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        </div>
        <div class="kpi-trend up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>+${kpi.openAuditsPct}%</span>
          <span class="kpi-change">Trending up</span>
        </div>
      </div>

      <div class="kpi-card trend-up enterprise-only">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Risk Exposure Score</div>
            <div class="kpi-value">${kpi.riskExposureScore}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--danger-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
          </div>
        </div>
        <div class="kpi-trend up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>+${kpi.riskExposurePct}%</span>
          <span class="kpi-change">Enterprise score</span>
        </div>
      </div>

      <div class="kpi-card trend-down">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Fully Compliant</div>
            <div class="kpi-value">${kpi.fullyCompliant}</div>
          </div>
          <div class="kpi-icon-wrap" style="background:var(--success-bg)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div class="kpi-trend down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
          <span>${Math.round(kpi.fullyCompliant / kpi.activeContractors * 100)}% of active</span>
          <span class="kpi-change">tracking well</span>
        </div>
      </div>

    </div>

    <!-- Main Content Grid -->
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

      <!-- Incident Trend Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Incident Trend (${tf === 'monthly' ? '7 Months' : '7 Weeks'})</div>
            <div class="card-subtitle">Total incidents across all contractors</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="badge badge-danger">${kpi.totalIncidents} total</span>
          </div>
        </div>
        <div class="card-body">
          ${renderBarChart(trend.labels, trend.incidents, '#DC2626', 160)}
        </div>
      </div>

      <!-- Compliance Trend Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Workforce Compliance Trend</div>
            <div class="card-subtitle">% compliant workers across portfolio</div>
          </div>
          <span class="badge ${kpi.workforceCompliance >= 85 ? 'badge-approved' : 'badge-warning'}">${kpi.workforceCompliance}%</span>
        </div>
        <div class="card-body">
          ${renderBarChart(trend.labels, trend.compliance, '#2563EB', 160)}
        </div>
      </div>

    </div>

    <!-- Benchmarking + Risk Quadrant -->
    <div class="grid" style="grid-template-columns:1.4fr 1fr;gap:16px;margin-bottom:20px" id="benchmark-section">

      <!-- Contractor Ranking Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🏆 Contractor Performance Ranking</div>
            <div class="card-subtitle">Sortable by all metrics. Click contractor to drill down.</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="exportToCSV('contractor-ranking')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr>
              <th>Contractor</th>
              <th>IFR</th>
              <th>Overdue %</th>
              <th>Compliance</th>
              <th>Risk Score</th>
              <th>Escalation</th>
            </tr></thead>
            <tbody>
              ${DB.contractors.filter(c => c.riskScore !== undefined).sort((a, b) => b.riskScore - a.riskScore).map(c => {
    const overduePct = c.openActions > 0 ? Math.round(c.overdueActions / c.openActions * 100) : 0;
    const hasEsc = DB.escalationLog.find(e => e.contractorId === c.id && e.status === 'Open');
    return `<tr onclick="navigateTo('contractor-profile',{id:'${c.id}'})" style="cursor:pointer">
                  <td>
                    <div style="font-weight:600;color:var(--text-primary)">${c.name}</div>
                    <div class="text-xs text-muted">${c.projects.length} project(s)</div>
                  </td>
                  <td>
                    <div style="font-weight:700;color:${c.ifr > 1.5 ? 'var(--danger)' : c.ifr >= 1.0 ? 'var(--orange)' : c.ifr >= 0.5 ? 'var(--warning)' : 'var(--success)'}">${c.ifr || '—'}</div>
                  </td>
                  <td>
                    <div style="font-weight:700;color:${overduePct >= 30 ? 'var(--danger)' : overduePct >= 15 ? 'var(--warning)' : 'var(--success)'}">${overduePct}%</div>
                  </td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px">
                      <div class="progress-bar-wrap" style="width:50px"><div class="progress-bar-fill ${getProgressClass(c.compliancePercent)}" style="width:${c.compliancePercent}%"></div></div>
                      <span class="text-sm font-bold ${getComplianceClass(c.compliancePercent) === 'good' ? 'text-success' : getComplianceClass(c.compliancePercent) === 'ok' ? 'text-warning' : 'text-danger'}">${c.compliancePercent}%</span>
                    </div>
                  </td>
                  <td><span class="risk-badge ${getRiskBadge(c.riskLevel)}">${c.riskScore || '—'}</span></td>
                  <td>${hasEsc ? '<span class="badge badge-critical badge-dot">Escalated</span>' : '<span class="badge badge-draft">—</span>'}</td>
                </tr>`;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Risk Quadrant -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">⚡ Risk Quadrant Analysis</div>
            <div class="card-subtitle">IFR vs Corrective Action Closure Speed</div>
          </div>
        </div>
        <div class="card-body" style="padding:16px">
          <div style="position:relative;background:var(--bg-elevated);border-radius:12px;border:1px solid var(--border);overflow:hidden">
            <!-- Quadrant grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr;height:280px">
              <div style="background:rgba(234,88,12,0.06);border-right:1px dashed var(--border);border-bottom:1px dashed var(--border);padding:8px;display:flex;align-items:flex-start;justify-content:flex-start">
                <div style="font-size:9px;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:0.5px">⚠ High IFR / Slow Closure</div>
              </div>
              <div style="background:rgba(220,38,38,0.06);border-bottom:1px dashed var(--border);padding:8px;display:flex;align-items:flex-start;justify-content:flex-end">
                <div style="font-size:9px;font-weight:700;color:var(--danger);text-transform:uppercase;letter-spacing:0.5px">🔴 Critical / Poor Control</div>
              </div>
              <div style="background:rgba(37,99,235,0.04);border-right:1px dashed var(--border);padding:8px;display:flex;align-items:flex-end;justify-content:flex-start">
                <div style="font-size:9px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.5px">✅ High Performing</div>
              </div>
              <div style="background:rgba(16,185,129,0.04);padding:8px;display:flex;align-items:flex-end;justify-content:flex-end">
                <div style="font-size:9px;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:0.5px">📈 Low IFR / Fast Closure</div>
              </div>
            </div>

            <!-- Dots -->
            <div style="position:absolute;inset:0;pointer-events:none">
              ${DB.contractors.filter(c => c.ifr !== undefined && c.closureSpeed !== undefined).map(c => {
    const maxIfr = 3, maxSpeed = 50;
    const x = Math.min((c.ifr / maxIfr) * 100, 98);
    const y = Math.min((1 - c.closureSpeed / maxSpeed) * 100, 98);
    const color = c.riskLevel === 'Critical' ? '#DC2626' : c.riskLevel === 'High' ? '#EA580C' : c.riskLevel === 'Medium' ? '#D97706' : '#059669';
    const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    return `<div style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:white;cursor:pointer;pointer-events:all;z-index:10" onclick="navigateTo('contractor-profile',{id:'${c.id}'})" title="${c.name} — IFR: ${c.ifr}, Closure: ${c.closureSpeed}d">${initials}</div>`;
  }).join('')}
            </div>

            <!-- Axis Labels -->
            <div style="position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:10px;color:var(--text-muted);font-weight:600">IFR (Incident Frequency Rate) →</div>
            <div style="position:absolute;left:6px;top:50%;transform:translateY(-50%) rotate(-90deg);font-size:10px;color:var(--text-muted);font-weight:600;white-space:nowrap">Closure Speed →</div>
          </div>

          <!-- Legend -->
          <div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap">
            ${['Critical', 'High', 'Medium', 'Low'].map(l => {
    const colors = { Critical: '#DC2626', High: '#EA580C', Medium: '#D97706', Low: '#059669' };
    return `<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-muted)">
                <div style="width:10px;height:10px;border-radius:50%;background:${colors[l]}"></div>${l} Risk
              </div>`;
  }).join('')}
          </div>
        </div>
      </div>

    </div>

    <!-- Project + BU Benchmarking -->
    <div class="grid grid-2" style="gap:16px;margin-bottom:20px" id="bu-benchmark">

      <!-- Project Benchmark Bar Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">📊 Incident Rate by Project</div>
            <div class="card-subtitle">Click bar to drill into project contractor list</div>
          </div>
        </div>
        <div class="card-body" style="padding:16px">
          ${(() => {
      const projects = DB.projectBenchmarks;
      const maxIfr = Math.max(...projects.map(p => p.ifr), 1);
      return `<div style="display:flex;flex-direction:column;gap:8px">
              ${projects.map(p => `
                <div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="navigateTo('contractors')">
                  <div style="width:80px;font-size:11px;font-weight:600;color:var(--text-muted);text-align:right;flex-shrink:0">${p.name}</div>
                  <div style="flex:1;background:var(--bg-elevated);border-radius:4px;height:20px;overflow:hidden">
                    <div style="height:100%;width:${(p.ifr / maxIfr * 100)}%;background:${p.ifr > 1.5 ? 'var(--danger)' : p.ifr >= 1.0 ? 'var(--orange)' : p.ifr >= 0.5 ? 'var(--warning)' : 'var(--success)'};border-radius:4px;display:flex;align-items:center;padding:0 6px;transition:width 0.8s ease">
                      <span style="font-size:10px;font-weight:700;color:white">${p.ifr}</span>
                    </div>
                  </div>
                  <div style="font-size:11px;color:var(--text-muted);width:24px">${p.incidents}i</div>
                </div>`).join('')}
            </div>`;
    })()}
        </div>
      </div>

      <!-- BU Compliance Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🏢 Compliance % by Business Unit</div>
            <div class="card-subtitle">Aggregated contractor compliance score</div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:16px">
            ${DB.buBenchmarks.map(bu => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                  <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${bu.name}</div>
                  <div style="font-size:13px;font-weight:800;color:${getComplianceClass(bu.compliance) === 'good' ? 'var(--success)' : getComplianceClass(bu.compliance) === 'ok' ? 'var(--warning)' : 'var(--danger)'}">${bu.compliance}%</div>
                </div>
                <div class="progress-bar-wrap"><div class="progress-bar-fill ${getProgressClass(bu.compliance)}" style="width:${bu.compliance}%"></div></div>
                <div style="display:flex;justify-content:space-between;margin-top:4px">
                  <span style="font-size:11px;color:var(--text-muted)">${bu.contractors} contractors · ${bu.incidents} incidents</span>
                  <span class="badge ${bu.compliance >= 80 ? 'badge-approved' : 'badge-warning'}" style="font-size:10px">IFR ${bu.ifr}</span>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

    </div>

    <!-- Recent Escalations -->
    ${isBUAbove ? `
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div>
          <div class="card-title">🚨 Escalation Log</div>
          <div class="card-subtitle">Enterprise reviews and intervention history</div>
        </div>
        <span class="badge badge-critical">${openEscalations.length} Open</span>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Contractor</th>
            <th>Date</th>
            <th>Trigger</th>
            <th>Status</th>
            <th>Reviewed By</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            ${DB.escalationLog.map(e => `
              <tr>
                <td><span style="font-weight:600;cursor:pointer;color:var(--primary)" onclick="navigateTo('contractor-profile',{id:'${e.contractorId}'})">${e.contractor}</span></td>
                <td>${fmtDate(e.date)}</td>
                <td style="max-width:200px"><div style="font-size:12px;color:var(--text-muted)">${e.trigger}</div></td>
                <td><span class="badge ${e.status === 'Open' ? 'badge-critical' : 'badge-approved'}">${e.status}</span></td>
                <td>${e.reviewedBy ? e.reviewedBy : '<span style="color:var(--text-muted);font-size:12px">—</span>'}</td>
                <td>
                  ${e.status === 'Open' ? `<button class="btn btn-sm btn-secondary" onclick="markEscalationReviewed('${e.id}')">Mark Reviewed</button>` : `<span style="font-size:12px;color:var(--text-muted)">${fmtDate(e.reviewDate)}</span>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

  </div>`;

  // Apply role visibility
  applyRolePermissions(role);
};

function showHighRiskContractors() {
  const high = DB.contractors.filter(c => ['High', 'Critical'].includes(c.riskLevel));
  const html = `
  <div class="modal-overlay" onclick="closeModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width:500px">
      <div class="modal-header">
        <div class="modal-title">⚠ High Risk Contractors (${high.length})</div>
        <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
      </div>
      <div style="padding:0">
        ${high.map(c => `
          <div class="notif-item" onclick="closeModal();navigateTo('contractor-profile',{id:'${c.id}'})" style="cursor:pointer">
            <div class="notif-dot" style="background:${c.riskLevel === 'Critical' ? 'var(--danger)' : 'var(--orange)'}"></div>
            <div class="notif-content">
              <div class="notif-title">${c.name}</div>
              <div class="notif-body">IFR: ${c.ifr} · Compliance: ${c.compliancePercent}% · ${c.overdueActions} overdue actions</div>
            </div>
            <span class="risk-badge ${getRiskBadge(c.riskLevel)}">${c.riskLevel}</span>
          </div>`).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="closeModal();navigateTo('contractors')">View All Contractors</button>
      </div>
    </div>
  </div>`;
  openModal(html);
}

function markEscalationReviewed(id) {
  const esc = DB.escalationLog.find(e => e.id === id);
  if (!esc) return;
  const role = DB.roles[APP_STATE.currentRole];
  esc.status = 'Reviewed';
  esc.reviewedBy = role?.name || 'Current User';
  esc.reviewDate = new Date().toISOString().split('T')[0];
  showToast('Escalation marked as reviewed', 'success');
  window.renderDashboard();
}
