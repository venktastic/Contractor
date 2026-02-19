/* ============================================================
   HSW Digital — Contractor Management Portal
   router.js — Client-Side Router
   ============================================================ */

const ROUTER = {
    currentPage: null,
    currentParams: {},
    history: []
};

function navigateTo(page, params = {}) {
    // Update state
    if (ROUTER.currentPage) {
        ROUTER.history.push({ page: ROUTER.currentPage, params: ROUTER.currentParams });
    }

    ROUTER.currentPage = page;
    ROUTER.currentParams = params;

    // Render page
    const container = document.getElementById('page-container');

    // Clear previous content
    container.innerHTML = '';

    // Rendering logic based on page
    let content = '';

    try {
        switch (page) {
            case 'dashboard':
                content = renderDashboard();
                break;
            case 'contractors':
                content = renderContractors();
                break;
            case 'contractor-profile':
                content = renderContractorProfile(params.id);
                break;
            case 'onboarding':
                content = renderOnboarding();
                break;
            case 'workforce':
                content = renderWorkforce();
                break;
            case 'performance':
                content = renderPerformance();
                break;
            case 'compliance-alerts':
                content = renderComplianceAlerts();
                break;
            case 'reports':
                content = renderReports();
                break;
            case 'settings':
                content = renderSettings();
                break;
            default:
                content = renderDashboard(); // Default to dashboard
        }

        container.innerHTML = content;

        // Post-render init (charts, etc.)
        if (page === 'dashboard' && window.initDashboard) window.initDashboard();
        if (page === 'contractors' && window.initContractors) window.initContractors();
        if (page === 'contractor-profile' && window.initContractorProfile) window.initContractorProfile(params.id);
        if (page === 'reports' && window.initReports) window.initReports();

    } catch (error) {
        console.error(`Error rendering page ${page}:`, error);
        container.innerHTML = `
      <div style="padding: 2rem; color: var(--danger); text-align: center;">
        <h2>Error Loading Module</h2>
        <p>Failed to load ${page}. Please try again.</p>
        <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 1rem;">${error.message}</p>
      </div>
    `;
    }

    // Update Navigation State
    updateActiveNavItem(page);

    // Scroll to top
    container.scrollTop = 0;
}

function updateActiveNavItem(page) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Add to current
    const activeBtn = document.getElementById(`nav-${page}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    } else if (page === 'contractor-profile') {
        // Keep contractors active when viewing profile
        document.getElementById('nav-contractors')?.classList.add('active');
    }
}

// Initial Load
window.addEventListener('popstate', (e) => {
    if (e.state) {
        navigateTo(e.state.page, e.state.params);
    }
});
