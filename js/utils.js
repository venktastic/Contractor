/* ============================================================
   HSW Digital — Contractor Management Portal
   utils.js — Utility Functions
   ============================================================ */

// ── Date Utilities ──
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
    return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

function expiryStatus(dateStr) {
    const days = daysUntil(dateStr);
    if (days === null) return 'unknown';
    if (days < 0) return 'expired';
    if (days <= 7) return 'critical';
    if (days <= 30) return 'expiring';
    return 'valid';
}

function expiryBadge(dateStr) {
    const days = daysUntil(dateStr);
    const status = expiryStatus(dateStr);
    if (status === 'expired') return `<span class="badge badge-noncompliant">Expired</span>`;
    if (status === 'critical') return `<span class="badge badge-noncompliant">Expires in ${days}d</span>`;
    if (status === 'expiring') return `<span class="badge badge-expiring">Expires in ${days}d</span>`;
    return `<span class="badge badge-compliant">${formatDate(dateStr)}</span>`;
}

// ── Status Badges ──
function statusBadge(status) {
    const map = {
        'Approved': 'badge-approved',
        'Draft': 'badge-draft',
        'Submitted': 'badge-submitted',
        'Under Review': 'badge-review',
        'Rejected': 'badge-rejected',
        'Suspended': 'badge-suspended',
        'Compliant': 'badge-compliant',
        'Expiring': 'badge-expiring',
        'Non-Compliant': 'badge-noncompliant',
        'Open': 'badge-submitted',
        'Closed': 'badge-compliant',
        'Overdue': 'badge-noncompliant',
        'Under Investigation': 'badge-review'
    };
    return `<span class="badge ${map[status] || 'badge-draft'}">${status}</span>`;
}

function riskBadge(level) {
    const map = { 'Low': 'badge-low', 'Medium': 'badge-medium', 'High': 'badge-high', 'Critical': 'badge-critical' };
    return `<span class="badge ${map[level] || 'badge-draft'}">${level} Risk</span>`;
}

function complianceBadge(pct) {
    if (pct >= 90) return `<span class="badge badge-compliant">${pct}%</span>`;
    if (pct >= 70) return `<span class="badge badge-expiring">${pct}%</span>`;
    return `<span class="badge badge-noncompliant">${pct}%</span>`;
}

function riskScoreBadge(score, level) {
    return `<div class="risk-score-badge ${level.toLowerCase()}">
    <span class="score-num">${score}</span>
    <div><div class="score-label">Risk Score</div><div style="font-size:11px;font-weight:700">${level}</div></div>
  </div>`;
}

// ── Risk Calculation ──
function calculateRiskLevel(score) {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 35) return 'Medium';
    return 'Low';
}

function getRiskColor(level) {
    const map = { 'Low': '#10B981', 'Medium': '#F59E0B', 'High': '#F97316', 'Critical': '#DC2626' };
    return map[level] || '#94A3B8';
}

// ── Compliance Status ──
function workerComplianceStatus(worker) {
    const days = daysUntil(worker.expiryDate);
    if (days === null) return 'Non-Compliant';
    if (days < 0) return 'Non-Compliant';
    if (days <= 30) return 'Expiring';
    return 'Compliant';
}

// ── Escalation Engine ──
function checkEscalation(contractor) {
    const actions = getActionsByContractor(contractor.id);
    const overdue = actions.filter(a => a.status === 'Overdue').length;
    const total = actions.length;
    const overduePercent = total > 0 ? (overdue / total) * 100 : 0;
    const incidents90d = contractor.incidents90d || 0;
    const compliance = contractor.compliancePercent || 100;

    const reasons = [];
    if (overduePercent >= 20) reasons.push(`${Math.round(overduePercent)}% corrective actions overdue`);
    if (incidents90d >= 3) reasons.push(`${incidents90d} serious incidents in rolling 90 days`);
    if (compliance < 80) reasons.push(`Workforce compliance ${compliance}% (below 80% threshold)`);

    return { triggered: reasons.length > 0, reasons };
}

function markEscalationReviewed(contractorId, reviewerName, notes) {
    const existing = DB.escalationLog.find(e => e.contractorId === contractorId && e.status === 'Open');
    if (existing) {
        existing.status = 'Reviewed';
        existing.reviewedBy = reviewerName;
        existing.reviewDate = new Date().toISOString().split('T')[0];
        existing.notes = notes;
    } else {
        DB.escalationLog.unshift({
            id: 'esc-' + Date.now(),
            contractorId, contractor: DB.contractors.find(c => c.id === contractorId)?.name || '',
            date: new Date().toISOString().split('T')[0],
            trigger: 'Manual review',
            status: 'Reviewed', reviewedBy: reviewerName,
            reviewDate: new Date().toISOString().split('T')[0], notes
        });
    }
}

// ── Trend Arrow ──
function trendArrow(direction, pct) {
    const isGood = direction === 'down'; // for IFR, down=good; compliance up=good handled separately
    const color = isGood ? 'var(--color-compliant)' : 'var(--color-noncompliant)';
    const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—';
    return `<span style="color:${color};font-weight:700;font-size:11px">${arrow} ${Math.abs(pct)}%</span>`;
}

function trendArrowGoodUp(direction, pct) {
    // for compliance, workforce — up is good
    const color = direction === 'up' ? 'var(--color-compliant)' : direction === 'down' ? 'var(--color-noncompliant)' : 'var(--text-muted)';
    const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—';
    return `<span style="color:${color};font-weight:700;font-size:11px">${arrow} ${Math.abs(pct)}%</span>`;
}

function ifrTrendBadge(trend) {
    if (trend === 'up') return `<span class="badge badge-noncompliant" style="font-size:10px">↑ IFR Rising</span>`;
    if (trend === 'down') return `<span class="badge badge-compliant" style="font-size:10px">↓ IFR Falling</span>`;
    return `<span class="badge badge-expiring" style="font-size:10px">→ Stable</span>`;
}

function predictiveRiskBadge(risk) {
    const map = {
        'High Risk / Poor Control': 'badge-critical',
        'Deteriorating': 'badge-high',
        'Stable': 'badge-expiring',
        'Improving': 'badge-compliant',
        'High Performing': 'badge-approved'
    };
    return `<span class="badge ${map[risk] || 'badge-draft'}" style="font-size:10px">🤖 ${risk}</span>`;
}

// ── Toast Notifications ──
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = '0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── Modal ──
function openModal(html) {
    const container = document.getElementById('modals-container');
    container.innerHTML = html;
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('modals-container').innerHTML = '';
    document.body.style.overflow = '';
}

// ── Export CSV ──
function exportCSV(data, filename) {
    if (!data || !data.length) { showToast('No data to export', 'warning'); return; }
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename + '.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${data.length} records`, 'success');
}

// ── Pagination ──
function paginate(data, page, perPage = 10) {
    const start = (page - 1) * perPage;
    return { items: data.slice(start, start + perPage), total: data.length, page, perPage, totalPages: Math.ceil(data.length / perPage) };
}

function renderPagination(containerId, pagination, onPageChange) {
    const { page, totalPages, total, perPage } = pagination;
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    const container = document.getElementById(containerId);
    if (!container) return;

    let pages = '';
    const maxPages = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    if (endPage - startPage < maxPages - 1) startPage = Math.max(1, endPage - maxPages + 1);

    for (let i = startPage; i <= endPage; i++) {
        pages += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
    }

    container.innerHTML = `
    <div class="pagination">
      <span class="pagination-info">Showing ${start}–${end} of ${total} records</span>
      <div class="pagination-controls">
        <button class="page-btn" onclick="${onPageChange}(${page - 1})" ${page === 1 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        ${pages}
        <button class="page-btn" onclick="${onPageChange}(${page + 1})" ${page === totalPages ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>`;
}

// ── Sort Table ──
function sortData(data, key, dir = 'asc') {
    return [...data].sort((a, b) => {
        const av = a[key] ?? ''; const bv = b[key] ?? '';
        if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
        return dir === 'asc' ? av.toString().localeCompare(bv.toString()) : bv.toString().localeCompare(av.toString());
    });
}

// ── Bar Chart ──
function renderBarChart(containerId, labels, values, color = 'blue') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const max = Math.max(...values, 1);
    const bars = labels.map((label, i) => {
        const pct = Math.round((values[i] / max) * 100);
        return `<div class="bar-col">
      <div class="bar-value">${values[i]}</div>
      <div class="bar-fill ${color}" style="height:${pct}%"></div>
      <div class="bar-label">${label}</div>
    </div>`;
    }).join('');
    container.innerHTML = `<div class="bar-chart">${bars}</div>`;
}

// ── Initials ──
function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

// ── Contractor Filter ──
function filterContractors(contractors, { search = '', status = '', risk = '', bu = '' } = {}) {
    return contractors.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.contact.toLowerCase().includes(search.toLowerCase())) return false;
        if (status && c.status !== status) return false;
        if (risk && c.riskLevel !== risk) return false;
        if (bu && bu !== 'all' && c.buId !== bu) return false;
        return true;
    });
}

// ── Scope Filter based on role ──
function scopeContractors(contractors, role, buId) {
    if (role === 'enterprise-hse' || role === 'procurement') return contractors;
    if (role === 'bu-hse') return contractors.filter(c => c.buId === buId);
    if (role === 'project-hse') return contractors.filter(c => c.buId === buId);
    if (role === 'contractor-admin') return contractors.filter(c => c.id === 'c-001'); // demo: own contractor
    if (role === 'site-supervisor') return contractors.filter(c => c.buId === buId);
    return contractors;
}
