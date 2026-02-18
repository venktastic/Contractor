// ============================================
// SAFEWORK PTW - UTILITIES
// Helper Functions
// ============================================

// Format date/time
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return 'N/A';
    const d = new Date(dateTimeStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTime(timeStr) {
    if (!timeStr) return 'N/A';
    return timeStr;
}

function timeAgo(dateTimeStr) {
    const now = new Date('2026-02-18T11:34:00');
    const then = new Date(dateTimeStr);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Status helpers
function getStatusBadgeClass(status) {
    const map = {
        'DRAFT': 'badge-draft',
        'SUBMITTED': 'badge-submitted',
        'UNDER_REVIEW': 'badge-under-review',
        'APPROVED': 'badge-approved',
        'ACTIVE': 'badge-active',
        'SUSPENDED': 'badge-suspended',
        'EXPIRED': 'badge-expired',
        'CLOSED': 'badge-closed',
        'REJECTED': 'badge-rejected'
    };
    return map[status] || 'badge-draft';
}

function getStatusLabel(status) {
    const map = {
        'DRAFT': 'Draft',
        'SUBMITTED': 'Submitted',
        'UNDER_REVIEW': 'Under Review',
        'APPROVED': 'Approved',
        'ACTIVE': 'Active',
        'SUSPENDED': 'Suspended',
        'EXPIRED': 'Expired',
        'CLOSED': 'Closed',
        'REJECTED': 'Rejected'
    };
    return map[status] || status;
}

function getRiskBadgeClass(risk) {
    const map = {
        'LOW': 'risk-low',
        'MEDIUM': 'risk-medium',
        'HIGH': 'risk-high',
        'CRITICAL': 'risk-critical'
    };
    return map[risk] || 'risk-medium';
}

// Audit log type helpers
function getAuditIconColor(type) {
    const map = {
        'create': { bg: 'rgba(0, 119, 182, 0.15)', color: '#38BDF8' },
        'submit': { bg: 'rgba(123, 47, 190, 0.15)', color: '#A78BFA' },
        'approve': { bg: 'rgba(45, 198, 83, 0.15)', color: '#2DC653' },
        'reject': { bg: 'rgba(230, 57, 70, 0.15)', color: '#E63946' },
        'activate': { bg: 'rgba(45, 198, 83, 0.15)', color: '#2DC653' },
        'suspend': { bg: 'rgba(255, 107, 53, 0.15)', color: '#FF6B35' },
        'expire': { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748B' },
        'close': { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748B' },
        'conflict': { bg: 'rgba(230, 57, 70, 0.15)', color: '#E63946' },
        'override': { bg: 'rgba(255, 107, 53, 0.15)', color: '#FF6B35' },
        'upload': { bg: 'rgba(0, 119, 182, 0.15)', color: '#38BDF8' },
        'validate': { bg: 'rgba(45, 198, 83, 0.15)', color: '#2DC653' }
    };
    return map[type] || { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748B' };
}

function getAuditIcon(type) {
    const icons = {
        'create': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
        'submit': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
        'approve': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        'reject': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        'activate': '<polygon points="5 3 19 12 5 21 5 3"/>',
        'suspend': '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
        'expire': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'close': '<polyline points="20 6 9 17 4 12"/>',
        'conflict': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        'override': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        'upload': '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
        'validate': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
    };
    return icons[type] || '<circle cx="12" cy="12" r="10"/>';
}

// Generate permit ID
function generatePermitId() {
    const num = Math.floor(Math.random() * 900) + 100;
    return `PTW-2026-0${num}`;
}

// Toast notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };

    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Show modal
function showModal(content) {
    const container = document.getElementById('modals-container');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = content;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    container.appendChild(overlay);
}

function closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) modal.remove();
}

// Find permit by ID
function findPermit(id) {
    return PTW_DATA.permits.find(p => p.id === id);
}

// Get permit type
function getPermitType(typeId) {
    return PTW_DATA.permitTypes.find(t => t.id === typeId);
}

// Simulate SIMOPS conflict detection
function detectSimopsConflicts(zone, startDate, startTime, endDate, endTime, excludeId = null) {
    const conflicts = [];
    const newStart = new Date(`${startDate}T${startTime}`);
    const newEnd = new Date(`${endDate}T${endTime}`);

    PTW_DATA.permits.forEach(permit => {
        if (excludeId && permit.id === excludeId) return;
        if (!['ACTIVE', 'APPROVED', 'UNDER_REVIEW'].includes(permit.status)) return;
        if (permit.zone !== zone) return;

        const pStart = new Date(`${permit.startDate}T${permit.startTime}`);
        const pEnd = new Date(`${permit.endDate}T${permit.endTime}`);

        // Check overlap
        if (newStart < pEnd && newEnd > pStart) {
            const overlapStart = new Date(Math.max(newStart, pStart));
            const overlapEnd = new Date(Math.min(newEnd, pEnd));
            const overlapMins = Math.floor((overlapEnd - overlapStart) / 60000);
            const overlapHours = Math.floor(overlapMins / 60);
            const overlapRemMins = overlapMins % 60;

            conflicts.push({
                permit,
                overlapDuration: overlapHours > 0 ? `${overlapHours}h ${overlapRemMins}m` : `${overlapMins}m`,
                overlapStart: overlapStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                overlapEnd: overlapEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    return conflicts;
}

// Unread notification count
function getUnreadCount() {
    return APP_STATE.notifications.filter(n => !n.read).length;
}

// Update notification badge
function updateNotifBadge() {
    const count = getUnreadCount();
    const badge = document.getElementById('notif-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Toggle user menu
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('hidden');
}

// Close user menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    const avatarBtn = document.querySelector('.avatar-btn');
    if (menu && !menu.contains(e.target) && avatarBtn && !avatarBtn.contains(e.target)) {
        menu.classList.add('hidden');
    }
});
