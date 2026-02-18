// ============================================
// PERMIT LIST PAGE
// ============================================

function renderPermitList() {
    return `
    <div class="permit-list-page">
      <div class="permit-list-header">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search permits..." id="permit-search" oninput="filterPermits()" />
        </div>
        <div class="filter-chips" id="filter-chips">
          ${['ALL', 'ACTIVE', 'UNDER_REVIEW', 'APPROVED', 'SUSPENDED', 'EXPIRED', 'CLOSED'].map(s => `
            <button class="filter-chip ${APP_STATE.filterStatus === s ? 'active' : ''}" onclick="setFilter('${s}')">${s === 'ALL' ? 'All' : getStatusLabel(s)}</button>
          `).join('')}
        </div>
      </div>
      <div class="permit-list-body" id="permit-list-body">
        ${renderFilteredPermits()}
      </div>
    </div>
  `;
}

function renderFilteredPermits() {
    const search = document.getElementById('permit-search')?.value?.toLowerCase() || '';
    let permits = PTW_DATA.permits;

    if (APP_STATE.filterStatus !== 'ALL') {
        permits = permits.filter(p => p.status === APP_STATE.filterStatus);
    }

    if (search) {
        permits = permits.filter(p =>
            p.id.toLowerCase().includes(search) ||
            p.title.toLowerCase().includes(search) ||
            p.location.toLowerCase().includes(search) ||
            p.contractor.toLowerCase().includes(search)
        );
    }

    if (permits.length === 0) {
        return `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p class="empty-title">No permits found</p>
        <p class="empty-subtitle">Try adjusting your search or filter criteria</p>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('create-permit')" style="margin-top:var(--space-3)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create New PTW
        </button>
      </div>
    `;
    }

    return permits.map(p => renderPermitCard(p)).join('');
}

function setFilter(status) {
    APP_STATE.filterStatus = status;
    // Re-render filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.textContent.trim() === (status === 'ALL' ? 'All' : getStatusLabel(status))) {
            chip.classList.add('active');
        }
    });
    document.getElementById('permit-list-body').innerHTML = renderFilteredPermits();
}

function filterPermits() {
    document.getElementById('permit-list-body').innerHTML = renderFilteredPermits();
}
