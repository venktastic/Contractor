// ============================================
// SAFEWORK PTW - ROUTER
// Single Page Application Navigation
// ============================================

function navigateTo(page, params = {}) {
    // Close user menu if open
    const userMenu = document.getElementById('user-menu');
    if (userMenu) userMenu.classList.add('hidden');

    // Save current page to history
    if (APP_STATE.currentPage !== page) {
        APP_STATE.pageHistory.push(APP_STATE.currentPage);
    }

    APP_STATE.currentPage = page;

    // Update params
    if (params.permitId) APP_STATE.currentPermitId = params.permitId;

    // Render page
    renderPage(page);

    // Update bottom nav
    updateBottomNav(page);

    // Update back button
    updateBackButton(page);

    // Update nav title
    updateNavTitle(page);

    // Scroll to top
    const container = document.getElementById('page-container');
    if (container) container.scrollTop = 0;
}

function goBack() {
    if (APP_STATE.pageHistory.length > 0) {
        const prev = APP_STATE.pageHistory.pop();
        APP_STATE.currentPage = prev;
        renderPage(prev);
        updateBottomNav(prev);
        updateBackButton(prev);
        updateNavTitle(prev);
    } else {
        navigateTo('dashboard');
    }
}

function renderPage(page) {
    const container = document.getElementById('page-container');

    const pages = {
        'dashboard': renderDashboard,
        'permit-list': renderPermitList,
        'create-permit': renderCreatePermit,
        'permit-detail': renderPermitDetail,
        'simops-dashboard': renderSimopsDashboard,
        'audit-log': renderAuditLog,
        'notifications': renderNotifications,
        'admin': renderAdmin,
        'qr-view': renderQrView
    };

    const renderer = pages[page];
    if (renderer) {
        container.innerHTML = `<div class="page">${renderer()}</div>`;
        // Run post-render hooks
        if (window[`init_${page.replace(/-/g, '_')}`]) {
            window[`init_${page.replace(/-/g, '_')}`]();
        }
    }
}

function updateBottomNav(page) {
    const navMap = {
        'dashboard': 'nav-dashboard',
        'permit-list': 'nav-permits',
        'create-permit': 'nav-create',
        'simops-dashboard': 'nav-simops',
        'audit-log': 'nav-audit'
    };

    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeId = navMap[page];
    if (activeId) {
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

function updateBackButton(page) {
    const backBtn = document.getElementById('back-btn');
    const noBackPages = ['dashboard', 'permit-list', 'simops-dashboard', 'audit-log', 'notifications'];

    if (backBtn) {
        if (noBackPages.includes(page)) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }
    }
}

function updateNavTitle(page) {
    const titles = {
        'dashboard': 'SafeWork PTW',
        'permit-list': 'All Permits',
        'create-permit': 'New Permit',
        'permit-detail': 'Permit Details',
        'simops-dashboard': 'SIMOPS Monitor',
        'audit-log': 'Audit Log',
        'notifications': 'Notifications',
        'admin': 'Admin Settings',
        'qr-view': 'Permit View'
    };

    const titleEl = document.getElementById('nav-title');
    if (titleEl) titleEl.textContent = titles[page] || 'SafeWork PTW';
}
