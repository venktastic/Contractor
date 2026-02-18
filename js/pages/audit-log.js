// ============================================
// AUDIT LOG PAGE
// ============================================

function renderAuditLog() {
    return `
    <div class="audit-page">
      <div style="padding:var(--space-4);border-bottom:1px solid var(--border)">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search audit log..." />
        </div>
      </div>
      <div class="audit-filters">
        ${['All', 'Approvals', 'Conflicts', 'Overrides', 'RAMS', 'Status Changes'].map((f, i) => `
          <button class="filter-chip ${i === 0 ? 'active' : ''}">${f}</button>
        `).join('')}
      </div>
      <div>
        ${PTW_DATA.auditLog.map(entry => {
        const style = getAuditIconColor(entry.type);
        return `
            <div class="audit-entry" onclick="navigateTo('permit-detail', {permitId: '${entry.permitId}'})">
              <div class="audit-entry-icon" style="background:${style.bg}">
                <svg viewBox="0 0 24 24" fill="none" stroke="${style.color}" stroke-width="2" width="16" height="16">
                  ${getAuditIcon(entry.type)}
                </svg>
              </div>
              <div class="audit-entry-content">
                <p class="audit-entry-action">${entry.action}</p>
                <p style="font-size:var(--font-size-xs);color:var(--text-muted);font-family:monospace;margin-bottom:2px">${entry.permitId}</p>
                ${entry.detail ? `<p class="audit-entry-detail">${entry.detail}</p>` : ''}
                <div class="audit-entry-meta">
                  <span class="audit-entry-time">${timeAgo(entry.time)}</span>
                  <span class="audit-entry-user">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    ${entry.user}
                  </span>
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    </div>
  `;
}
