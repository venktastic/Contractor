// ============================================
// NOTIFICATIONS PAGE
// ============================================

function renderNotifications() {
    const unread = APP_STATE.notifications.filter(n => !n.read);
    const read = APP_STATE.notifications.filter(n => n.read);

    const notifIcons = {
        conflict: { icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', color: 'var(--danger)', bg: 'var(--danger-bg)' },
        approval: { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', color: 'var(--purple)', bg: 'var(--purple-light)' },
        suspend: { icon: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>', color: 'var(--warning)', bg: 'var(--warning-bg)' },
        expiry: { icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', color: 'var(--amber-dark)', bg: 'var(--amber-light)' },
        rams: { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', color: 'var(--info)', bg: 'var(--info-bg)' }
    };

    const renderNotifItem = (n) => {
        const iconData = notifIcons[n.type] || notifIcons.approval;
        return `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead('${n.id}')">
        <div style="width:36px;height:36px;border-radius:var(--radius-full);background:${iconData.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="${iconData.color}" stroke-width="2" width="16" height="16">${iconData.icon}</svg>
        </div>
        <div class="notif-content">
          <p class="notif-title">${n.title}</p>
          <p class="notif-body">${n.body}</p>
          <p class="notif-time">${timeAgo(n.time)}</p>
        </div>
        ${!n.read ? '<div class="notif-dot"></div>' : ''}
      </div>
    `;
    };

    return `
    <div class="notifications-page">
      <div style="padding:var(--space-3) var(--space-4);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)">
        <p style="font-size:var(--font-size-sm);color:var(--text-muted)">${unread.length} unread</p>
        <button style="font-size:var(--font-size-sm);color:var(--brand-primary);font-weight:600" onclick="markAllRead()">Mark all read</button>
      </div>
      ${unread.length > 0 ? `
        <div class="notif-group-header">New</div>
        ${unread.map(renderNotifItem).join('')}
      ` : ''}
      ${read.length > 0 ? `
        <div class="notif-group-header">Earlier</div>
        ${read.map(renderNotifItem).join('')}
      ` : ''}
      ${APP_STATE.notifications.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <p class="empty-title">No notifications</p>
          <p class="empty-subtitle">You're all caught up!</p>
        </div>
      ` : ''}
    </div>
  `;
}

function markNotifRead(id) {
    const notif = APP_STATE.notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        updateNotifBadge();
        renderPage('notifications');
    }
}

function markAllRead() {
    APP_STATE.notifications.forEach(n => n.read = true);
    updateNotifBadge();
    renderPage('notifications');
    showToast('All notifications marked as read', 'success');
}
