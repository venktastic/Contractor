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

    // Clear previous content (optional, but good for safety)
    // container.innerHTML = ''; 

    try {
        switch (page) {
            case 'dashboard':
                if (window.renderDashboard) window.renderDashboard();
                break;
            case 'contractors':
                if (window.renderContractors) window.renderContractors();
                break;
            case 'contractor-profile':
                if (window.renderContractorProfile) window.renderContractorProfile(params.id);
                break;
            case 'onboarding':
                if (window.renderOnboarding) window.renderOnboarding(params);
                break;
            case 'active-permit':
                // Ensure renderPermitDetail is available or handle gracefully
                if (window.renderPermitDetail) window.renderPermitDetail(params.id);
                break;
            case 'workforce':
                if (window.renderWorkforce) window.renderWorkforce();
                break;
            case 'performance':
                if (window.renderPerformance) window.renderPerformance();
                break;
            case 'compliance-alerts':
                if (window.renderComplianceAlerts) window.renderComplianceAlerts();
                break;
            case 'reports':
                if (window.renderReports) window.renderReports();
                break;
            case 'settings':
                if (window.renderSettings) window.renderSettings();
                break;
            default:
                if (window.renderDashboard) window.renderDashboard();
        }

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
