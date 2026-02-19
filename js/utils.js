/* ============================================================
   HSW Digital — Contractor Management Portal
   utils.js — Shared Utility Functions
   ============================================================ */

// ── Toast Notifications ─────────────────────────────────────
const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${TOAST_ICONS[type] || TOAST_ICONS.info}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── Modal System ────────────────────────────────────────────
function openModal(html) {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = html;
}
function closeModal() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
}

// ── Formatters ──────────────────────────────────────────────
function fmtDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
}
function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function isExpired(dateStr) { return daysUntil(dateStr) < 0; }
function isExpiringSoon(dateStr, days = 30) {
    const d = daysUntil(dateStr);
    return d !== null && d >= 0 && d <= days;
}

// ── Badge Helpers ────────────────────────────────────────────
function getStatusBadge(status) {
    const map = {
        'Approved': 'badge-approved',
        'Draft': 'badge-draft',
        'Under Review': 'badge-review',
        'Suspended': 'badge-suspended',
        'Non-Compliant': 'badge-danger',
        'Expiring': 'badge-warning',
        'Compliant': 'badge-approved',
        'Overdue': 'badge-critical',
        'Open': 'badge-warning',
        'Closed': 'badge-approved',
        'Under Investigation': 'badge-review'
    };
    return map[status] || 'badge-draft';
}

function getRiskBadge(level) {
    const map = {
        'Low': 'risk-low',
        'Medium': 'risk-medium',
        'High': 'risk-high',
        'Critical': 'risk-critical'
    };
    return map[level] || 'risk-low';
}

function getRiskScoreClass(score) {
    if (score >= 80) return 'risk-critical';
    if (score >= 60) return 'risk-high';
    if (score >= 40) return 'risk-medium';
    return 'risk-low';
}

function getComplianceClass(pct) {
    if (pct >= 90) return 'good';
    if (pct >= 75) return 'ok';
    return 'bad';
}

function getProgressClass(pct) {
    if (pct >= 90) return 'progress-good';
    if (pct >= 70) return 'progress-ok';
    return 'progress-bad';
}

// ── Mini Sparkline (SVG) ─────────────────────────────────────
function renderSparkline(data, color, width = 80, height = 32) {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ── Bar Chart Helper ─────────────────────────────────────────
function renderBarChart(labels, values, color, maxHeight = 140) {
    const max = Math.max(...values, 1);
    return `<div class="bar-chart-wrap">
    ${labels.map((l, i) => `
      <div class="bar-col">
        <div class="bar-fill" style="height:${(values[i] / max) * maxHeight}px;background:${color};border-radius:4px 4px 0 0;"></div>
        <div class="bar-label">${l}</div>
      </div>`).join('')}
  </div>`;
}

// ── Time filter ───────────────────────────────────────────────
let APP_TIME_FILTER = 'monthly';
function setTimeFilter(filter) {
    APP_TIME_FILTER = filter;
    document.querySelectorAll('.topbar-filter-pill').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(`filter-${filter}`);
    if (el) el.classList.add('active');
    // Re-render current page
    if (ROUTER && ROUTER.currentPage) navigateTo(ROUTER.currentPage, ROUTER.currentParams);
}

// ── BU Selector Modal ────────────────────────────────────────
function showBUSelector() {
    const html = `
  <div class="modal-overlay" onclick="closeModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width:380px">
      <div class="modal-header">
        <div class="modal-title">Select Business Unit</div>
        <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
      </div>
      <div style="padding:16px;display:flex;flex-direction:column;gap:8px">
        <button onclick="setBU(null)" style="text-align:left;padding:12px 14px;border-radius:10px;border:2px solid ${!APP_STATE.currentBU ? 'var(--primary)' : 'var(--border)'};background:${!APP_STATE.currentBU ? 'var(--primary-light)' : 'var(--bg-elevated)'};cursor:pointer;font-weight:600;color:var(--text-primary);font-family:var(--font-main);font-size:13px">
          🏢 All Business Units
        </button>
        ${DB.businessUnits.map(bu => `
          <button onclick="setBU('${bu.id}')" style="text-align:left;padding:12px 14px;border-radius:10px;border:2px solid ${APP_STATE.currentBU === bu.id ? 'var(--primary)' : 'var(--border)'};background:${APP_STATE.currentBU === bu.id ? 'var(--primary-light)' : 'var(--bg-elevated)'};cursor:pointer;font-weight:600;color:var(--text-primary);font-family:var(--font-main);font-size:13px">
            ${bu.name} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${bu.code})</span>
          </button>`).join('')}
      </div>
    </div>
  </div>`;
    openModal(html);
}

function setBU(buId) {
    APP_STATE.currentBU = buId;
    const label = buId ? (DB.businessUnits.find(b => b.id === buId)?.name || 'All') : 'All Business Units';
    const el = document.getElementById('bu-selector-label');
    if (el) el.textContent = label;
    closeModal();
    showToast(`Viewing: ${label}`, 'info');
    if (ROUTER && ROUTER.currentPage) navigateTo(ROUTER.currentPage, ROUTER.currentParams);
}

// ── Pagination Helper ────────────────────────────────────────
function paginate(items, page, perPage = 10) {
    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        items: items.slice(start, end),
        total, totalPages, page,
        start: start + 1, end: Math.min(end, total)
    };
}

function renderPagination(pg, onNavigate) {
    if (pg.totalPages <= 1) return '';
    const pages = [];
    for (let i = 1; i <= pg.totalPages; i++) {
        if (i === 1 || i === pg.totalPages || (i >= pg.page - 1 && i <= pg.page + 1)) {
            pages.push(`<button class="page-btn ${i === pg.page ? 'active' : ''}" onclick="${onNavigate}(${i})">${i}</button>`);
        } else if (pages[pages.length - 1] !== '<span style="padding:0 4px;color:var(--text-muted)">…</span>') {
            pages.push('<span style="padding:0 4px;color:var(--text-muted)">…</span>');
        }
    }
    return `<div class="pagination">
    <div class="pagination-info">Showing ${pg.start}–${pg.end} of ${pg.total}</div>
    <div class="pagination-controls">
      <button class="page-btn" onclick="${onNavigate}(${pg.page - 1})" ${pg.page === 1 ? 'disabled' : ''}>‹</button>
      ${pages.join('')}
      <button class="page-btn" onclick="${onNavigate}(${pg.page + 1})" ${pg.page === pg.totalPages ? 'disabled' : ''}>›</button>
    </div>
  </div>`;
}

// ── Export to CSV (mock) ─────────────────────────────────────
function exportToCSV(filename) {
    showToast(`Exporting ${filename}.csv…`, 'success');
}

// ── Escalation Check ─────────────────────────────────────────
function checkEscalation(contractor) {
    if (!contractor) return false;
    const overdueRatio = contractor.overdueActions / Math.max(contractor.openActions, 1);
    const highOverdue = overdueRatio >= 0.2 || contractor.overdueActions >= 4;
    const highIncidents = contractor.incidents90d >= 3;
    const lowCompliance = contractor.compliancePercent < 80;
    return highOverdue || highIncidents || lowCompliance;
}

// ── Risk Score Color ──────────────────────────────────────────
function riskScoreColor(score) {
    if (score >= 80) return '#DC2626';
    if (score >= 60) return '#EA580C';
    if (score >= 40) return '#D97706';
    return '#059669';
}

// ── Contractor Filter (shared) ────────────────────────────────
function filterContractors(search = '', status = 'all', risk = 'all') {
    let list = [...DB.contractors];
    if (APP_STATE.currentBU) list = list.filter(c => c.buId === APP_STATE.currentBU);
    if (search) {
        const q = search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q));
    }
    if (status !== 'all') list = list.filter(c => c.status.toLowerCase() === status);
    if (risk !== 'all') list = list.filter(c => c.riskLevel.toLowerCase() === risk);
    return list;
}
