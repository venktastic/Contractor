// ============================================
// SAFEWORK PTW - MAIN APP
// Bootstrap & Initialization
// ============================================

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    // Show splash screen, then load app
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('main-app');

        splash.classList.add('fade-out');
        app.classList.remove('hidden');

        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);

        // Initialize app state
        APP_STATE.currentPage = 'dashboard';
        APP_STATE.currentDetailTab = 'details';

        // Render initial page
        navigateTo('dashboard');

        // Update notification badge
        updateNotifBadge();

        // Simulate offline-ready indicator
        if ('serviceWorker' in navigator) {
            // Would register SW in production
        }

    }, 2000);
});

// Handle browser back button
window.addEventListener('popstate', () => {
    goBack();
});

// Prevent zoom on double tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Auto-save wizard draft every 30 seconds
setInterval(() => {
    if (APP_STATE.currentPage === 'create-permit') {
        // In production, would save to localStorage/IndexedDB
        const draftIndicator = document.querySelector('.draft-indicator span');
        if (draftIndicator) {
            draftIndicator.textContent = 'Auto-saved just now';
            setTimeout(() => {
                if (draftIndicator) draftIndicator.textContent = 'Auto-saved as draft';
            }, 2000);
        }
    }
}, 30000);

// Simulate real-time updates (permit status changes, new notifications)
setTimeout(() => {
    // Simulate a new notification after 15 seconds
    const newNotif = {
        id: 'N_LIVE',
        type: 'approval',
        title: 'Permit Ready for Review',
        body: 'PTW-2026-0141 RAMS has been updated and is ready for re-validation.',
        time: new Date().toISOString(),
        read: false
    };
    APP_STATE.notifications.unshift(newNotif);
    updateNotifBadge();

    if (APP_STATE.currentPage !== 'notifications') {
        showToast('New notification: Permit ready for review', 'info', 4000);
    }
}, 15000);

console.log('🔒 SafeWork PTW v2.4.1 initialized');
console.log('📱 Mobile-First HSE Permit Management System');
console.log('✅ Modules loaded: B (Wizard), C (RAMS), D (SIMOPS), H (QR Code)');
