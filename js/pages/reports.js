/* ============================================================
   reports.js — Reports & AI Placeholders
   ============================================================ */

let _reportType = 'contractor-risk';
let _reportStatus = 'idle'; // idle | pending | generating | ready
let _reportTimer = null;

window.renderReports = function () {
  const container = document.getElementById('page-container');

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Reports & Analytics</div>
          <div class="page-subtitle">Generate enterprise-grade HSW contractor reports</div>
        </div>
      </div>

      <!-- AI Card -->
      <div class="ai-card" style="margin-bottom:24px">
        <div class="ai-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          AI-Powered
        </div>
        <div class="ai-title">Predictive Risk Intelligence</div>
        <div class="ai-subtitle">AI analyzes contractor performance patterns to predict future risk exposure and generate actionable insights</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:200px;padding:12px;border-radius:8px;background:rgba(255,255,255,0.08)">
            <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Predictive Risk Score</div>
            <div style="font-size:22px;font-weight:800;color:#F59E0B">67 / 100</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px">Medium-High risk trajectory detected</div>
          </div>
          <div style="flex:1;min-width:200px;padding:12px;border-radius:8px;background:rgba(255,255,255,0.08)">
            <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">AI Performance Summary</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.5">3 contractors showing deteriorating compliance trends. Recommend enhanced monitoring for Ironclad Demolition and Pinnacle Scaffolding.</div>
          </div>
        </div>
      </div>

      <!-- Report Type Selection -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><div class="card-title">Select Report Type</div></div>
        <div class="card-body">
          <div class="report-type-grid">
            ${[
      { id: 'contractor-risk', name: 'Contractor Risk Report', desc: 'Risk scores, trends, and recommendations', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>' },
      { id: 'compliance', name: 'Compliance Status Report', desc: 'Document and workforce compliance overview', icon: '<polyline points="20 6 9 17 4 12"/>' },
      { id: 'performance', name: 'Performance Benchmarking', desc: 'LTIFR, incidents, and action closure rates', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
      { id: 'workforce', name: 'Workforce Competency', desc: 'Certification status and expiry tracking', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
      { id: 'incident', name: 'Incident Analysis', desc: 'Incident trends, types, and root causes', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
      { id: 'audit', name: 'Audit Findings Report', desc: 'Audit results and corrective action status', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>' }
    ].map(r => `
              <div class="report-type-card ${_reportType === r.id ? 'selected' : ''}" onclick="selectReportType('${r.id}')">
                <div class="report-type-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${r.icon}</svg></div>
                <div class="report-type-name">${r.name}</div>
                <div class="report-type-desc">${r.desc}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><div class="card-title">Report Filters</div></div>
        <div class="card-body">
          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Project</label>
              <select class="form-select">
                <option>All Projects</option>
                ${DB.businessUnits.map(b => `<option>${b.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Project</label>
              <select class="form-select">
                <option>All Projects</option>
                ${DB.projects.map(p => `<option>${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date Range</label>
              <select class="form-select">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last 6 Months</option>
                <option selected>Last 12 Months</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Contractor</label>
              <select class="form-select">
                <option>All Contractors</option>
                ${DB.contractors.map(c => `<option>${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Risk Level</label>
              <select class="form-select">
                <option>All Risk Levels</option>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Format</label>
              <select class="form-select">
                <option>PDF Report</option>
                <option>Excel Workbook</option>
                <option>CSV Data</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Button & AI Status -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
        <button class="btn btn-primary btn-lg" onclick="generateReport()" id="generate-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Generate Contractor Risk Report
        </button>
        <button class="btn btn-secondary btn-lg" onclick="exportCSV(getReportData(), 'contractor_report')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Quick Export CSV
        </button>
      </div>

      <div id="report-status-area"></div>

      <!-- Recent Reports -->
      <div class="card">
        <div class="card-header"><div class="card-title">Recent Reports</div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Report Name</th><th>Type</th><th>Generated By</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${[
      { name: 'Q4 2025 Contractor Risk Summary', type: 'Risk Report', by: 'Prakash Senghani', date: '2026-01-15', status: 'Ready' },
      { name: 'Infrastructure Division Compliance', type: 'Compliance', by: 'Marcus Chen', date: '2026-01-10', status: 'Ready' },
      { name: 'Ironclad Demolition — AI Risk Report', type: 'AI Report', by: 'System', date: '2026-01-08', status: 'Ready' },
      { name: 'Workforce Competency Dec 2025', type: 'Workforce', by: 'Sarah Okafor', date: '2025-12-31', status: 'Ready' }
    ].map(r => `<tr>
                <td class="col-name">${r.name}</td>
                <td><span class="badge badge-approved">${r.type}</span></td>
                <td>${r.by}</td>
                <td>${fmtDate(r.date)}</td>
                <td><span class="badge badge-compliant">Ready</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="showToast('Report downloaded', 'success')">Download</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

function selectReportType(type) {
  _reportType = type;
  document.querySelectorAll('.report-type-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

function generateReport() {
  _reportStatus = 'pending';
  const btn = document.getElementById('generate-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Initiating...'; }

  document.getElementById('report-status-area').innerHTML = `
    <div class="ai-report-status">
      <div class="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>AI Report Generation</div>
      <div class="ai-title">Generating Contractor Risk Report</div>
      <div class="ai-subtitle">AI is analyzing contractor data, incident patterns, and compliance trends. Estimated time: 5–8 minutes.</div>
      <div class="ai-status-indicator" id="ai-status-indicator">
        <div class="ai-dot pending" id="ai-dot"></div>
        <span id="ai-status-text">Pending — Queued for processing...</span>
      </div>
      <div class="ai-report-progress">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.5)">
          <span>Progress</span><span id="ai-progress-pct">0%</span>
        </div>
        <div class="ai-progress-bar"><div class="ai-progress-fill" id="ai-progress-fill" style="width:0%"></div></div>
      </div>
    </div>`;

  // Simulate AI generation
  setTimeout(() => {
    document.getElementById('ai-dot').className = 'ai-dot generating';
    document.getElementById('ai-status-text').textContent = 'Generating — Analyzing 24 contractors across 3 projects...';
    animateProgress(0, 35, 3000);
  }, 1000);

  setTimeout(() => {
    document.getElementById('ai-status-text').textContent = 'Generating — Computing risk scores and incident correlations...';
    animateProgress(35, 70, 3000);
  }, 4000);

  setTimeout(() => {
    document.getElementById('ai-status-text').textContent = 'Generating — Compiling recommendations and benchmarks...';
    animateProgress(70, 95, 2000);
  }, 7000);

  setTimeout(() => {
    document.getElementById('ai-dot').className = 'ai-dot';
    document.getElementById('ai-dot').style.background = '#10B981';
    document.getElementById('ai-status-text').textContent = 'Ready — Report generated successfully';
    document.getElementById('ai-progress-fill').style.width = '100%';
    document.getElementById('ai-progress-pct').textContent = '100%';
    document.getElementById('report-status-area').innerHTML += `
      <div class="alert-banner alert-success" style="margin-top:12px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <div class="alert-banner-content">
          <div class="alert-banner-title">Report Ready</div>
          <div class="alert-banner-text">Your AI-generated Contractor Risk Report is ready. <a href="#" onclick="showToast('Report downloaded', 'success');return false;" style="color:var(--color-compliant-text);font-weight:700">Download Now →</a></div>
        </div>
      </div>`;
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Generate New Report'; }
    showToast('AI report ready for download', 'success');
  }, 9500);
}

function animateProgress(from, to, duration) {
  const fill = document.getElementById('ai-progress-fill');
  const pct = document.getElementById('ai-progress-pct');
  if (!fill) return;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(from + (to - from) * progress);
    fill.style.width = current + '%';
    if (pct) pct.textContent = current + '%';
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function getReportData() {
  return DB.contractors.map(c => ({ Contractor: c.name, Status: c.status, Risk: c.riskLevel, Score: c.riskScore, Compliance: c.compliancePercent + '%', LTIFR: c.ifr, Incidents: c.incidents, OpenActions: c.openActions, OverdueActions: c.overdueActions }));
}
