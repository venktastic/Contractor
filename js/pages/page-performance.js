/* ============================================================
   HSW Digital — Performance Analytics Page
   page-performance.js — Enterprise KPI + Trend Charts + Benchmarking
   ============================================================ */

window.renderPerformance = function () {
    const kpi = DB.enterpriseKPIs;
    const tf = APP_TIME_FILTER;
    const trend = DB.performanceTrend[tf];
    const container = document.getElementById('page-container');

    container.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Performance Analytics</div>
        <div class="page-subtitle">Detailed safety metrics, trend analysis, and cross-contractor benchmarking</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="exportToCSV('performance-report')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-4" style="margin-bottom:20px">
      ${[
            { label: 'Total Incidents', val: kpi.totalIncidents, sub: 'across portfolio', color: '#DC2626', bg: 'var(--danger-bg)', trend: '↑ 8%' },
            { label: 'Avg IFR', val: kpi.ifr, sub: 'vs 3.1 last period', color: '#EA580C', bg: 'var(--orange-bg)', trend: '↑ Rising' },
            { label: 'Open Actions', val: kpi.openActions, sub: `${kpi.overdueActions} overdue`, color: '#D97706', bg: 'var(--warning-bg)', trend: '⚠ Review' },
            { label: 'Avg Compliance', val: kpi.avgCompliancePct + '%', sub: `${kpi.compliantWorkers} workers`, color: '#059669', bg: 'var(--success-bg)', trend: '↑ Stable' }
        ].map(k => `
        <div class="kpi-card trend-neutral">
          <div class="kpi-top">
            <div>
              <div class="kpi-label">${k.label}</div>
              <div class="kpi-value" style="color:${k.color}">${k.val}</div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px">${k.sub}</div>
          <div style="font-size:11px;font-weight:700;color:${k.color};margin-top:4px">${k.trend}</div>
        </div>`).join('')}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-2" style="margin-bottom:20px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Incident Trend (${tf === 'monthly' ? 'Monthly' : 'Weekly'})</div>
          <span class="badge badge-danger">${kpi.totalIncidents} YTD</span>
        </div>
        <div class="card-body">
          ${renderBarChart(trend.labels, trend.incidents, '#DC2626', 160)}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Open vs Overdue Actions</div>
          <span class="badge badge-warning">${kpi.overdueActions} overdue</span>
        </div>
        <div class="card-body">
          ${renderBarChart(trend.labels, trend.actions, '#D97706', 160)}
        </div>
      </div>
    </div>

    <!-- Contractor Benchmarking Table -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div>
          <div class="card-title">📊 Contractor IFR Benchmarking</div>
          <div class="card-subtitle">All contractors benchmarked against portfolio average (IFR ${kpi.ifr})</div>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Contractor</th>
            <th>IFR</th>
            <th>vs Portfolio Avg</th>
            <th>Incidents (90d)</th>
            <th>Action Closure Speed</th>
            <th>IFR Trend</th>
            <th>Predictive State</th>
          </tr></thead>
          <tbody>
            ${DB.contractors.filter(c => c.ifr !== undefined).sort((a, b) => (b.ifr || 0) - (a.ifr || 0)).map(c => {
            const diff = ((c.ifr || 0) - kpi.ifr).toFixed(1);
            const diffColor = parseFloat(diff) > 0 ? 'var(--danger)' : 'var(--success)';
            return `<tr onclick="navigateTo('contractor-profile',{id:'${c.id}'})" style="cursor:pointer">
                <td>
                  <div style="font-weight:600">${c.name}</div>
                  <div class="text-xs text-muted">${c.riskLevel} Risk</div>
                </td>
                <td><div style="font-size:16px;font-weight:900;color:${(c.ifr || 0) >= 5 ? 'var(--danger)' : (c.ifr || 0) >= 2 ? 'var(--warning)' : 'var(--success)'}">${c.ifr || '—'}</div></td>
                <td>
                  <div style="font-weight:700;color:${diffColor}">${parseFloat(diff) > 0 ? '+' : ''}${diff}</div>
                  <div style="font-size:11px;color:${parseFloat(diff) > 0 ? 'var(--danger)' : 'var(--success)'}"> ${parseFloat(diff) > 0 ? '▲ Above avg' : '▼ Below avg'}</div>
                </td>
                <td style="font-weight:600;color:${(c.incidents90d || 0) >= 3 ? 'var(--danger)' : 'var(--text-primary)'}">${c.incidents90d ?? '—'}</td>
                <td>
                  ${c.closureSpeed !== undefined ? `
                    <div style="display:flex;align-items:center;gap:6px">
                      <div class="progress-bar-wrap" style="width:60px"><div class="progress-bar-fill ${c.closureSpeed <= 7 ? 'progress-good' : c.closureSpeed <= 14 ? 'progress-ok' : 'progress-bad'}" style="width:${Math.min(100, 100 - (c.closureSpeed / 50 * 100))}%"></div></div>
                      <span style="font-size:12px;font-weight:600;color:${c.closureSpeed <= 7 ? 'var(--success)' : c.closureSpeed <= 14 ? 'var(--warning)' : 'var(--danger)'}">${c.closureSpeed}d</span>
                    </div>` : '—'}
                </td>
                <td>
                  <span class="badge ${c.ifrTrend === 'up' ? 'badge-danger' : c.ifrTrend === 'down' ? 'badge-approved' : 'badge-draft'}">
                    ${c.ifrTrend === 'up' ? '↑ Rising' : c.ifrTrend === 'down' ? '↓ Improving' : '→ Stable'}
                  </span>
                </td>
                <td>
                  <span class="badge ${c.predictiveRisk === 'High Performing' || c.predictiveRisk === 'Improving' ? 'badge-approved' : c.predictiveRisk === 'Stable' ? 'badge-draft' : 'badge-critic…al'}" style="white-space:nowrap">${c.predictiveRisk || 'N/A'}</span>
                </td>
              </tr>`;
        }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Project Benchmarking -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">🗂 Project Benchmarking</div>
        <div class="card-subtitle">Safety performance metrics by project site</div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Project</th><th>IFR</th><th>Compliance %</th><th>Contractors</th><th>Incidents</th><th>Performance</th></tr></thead>
          <tbody>
            ${DB.projectBenchmarks.map(p => `
              <tr>
                <td style="font-weight:600">${p.name}</td>
                <td style="font-weight:700;color:${p.ifr >= 5 ? 'var(--danger)' : p.ifr >= 2 ? 'var(--warning)' : 'var(--success)'}">${p.ifr}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div class="progress-bar-wrap" style="width:64px"><div class="progress-bar-fill ${getProgressClass(p.compliance)}" style="width:${p.compliance}%"></div></div>
                    <span style="font-size:12px;font-weight:700">${p.compliance}%</span>
                  </div>
                </td>
                <td>${p.contractors}</td>
                <td>${p.incidents}</td>
                <td><span class="badge ${p.compliance >= 85 && p.ifr < 3 ? 'badge-approved' : p.compliance >= 70 ? 'badge-warning' : 'badge-danger'}">${p.compliance >= 85 && p.ifr < 3 ? '✓ On Track' : p.compliance >= 70 ? '⚠ Monitor' : '⛔ Review'}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>`;
};
