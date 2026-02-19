/* ============================================================
   HSW Digital — Contractor Management Portal
   app.js — Application Entry Point & State Management
   ============================================================ */

const APP_STATE = {
    currentRole: 'enterprise-hse',
    currentBU: 'bu-1',
    sidebarCollapsed: false,
    pageHistory: []
};

// ── Role Switch ──
function switchRole(role) {
    APP_STATE.currentRole = role;
    const roleData = DB.roles[role];
    if (!roleData) return;

    // Update top bar
    document.getElementById('top-avatar').textContent = roleData.initials;
    document.getElementById('top-username').textContent = roleData.name;
    document.getElementById('top-role').textContent = roleData.title;
    document.getElementById('menu-avatar').textContent = roleData.initials;
    document.getElementById('menu-username').textContent = roleData.name;
    document.getElementById('menu-role').textContent = roleData.title;
    document.getElementById('sidebar-role-label').textContent = roleData.title.split(' ').slice(0, 2).join(' ');

    // Update sidebar role dot
    const dot = document.querySelector('.sidebar-role-badge .role-dot');
    if (dot) dot.style.background = roleData.color;

    // Update avatar gradient
    document.getElementById('top-avatar').style.background = `linear-gradient(135deg, ${roleData.color}cc, ${roleData.color})`;

    // Apply role-based nav visibility
    applyRolePermissions(role);

    toggleUserMenu();
    showToast(`Switched to ${roleData.title}`, 'info');
    navigateTo('dashboard');
}

function applyRolePermissions(role) {
    // Benchmarking only for enterprise-hse and bu-hse
    document.querySelectorAll('.enterprise-only').forEach(el => {
        el.style.display = (role === 'enterprise-hse') ? '' : 'none';
    });
    document.querySelectorAll('.bu-and-above').forEach(el => {
        el.style.display = ['enterprise-hse', 'bu-hse'].includes(role) ? '' : 'none';
    });
    document.querySelectorAll('.no-contractor-admin').forEach(el => {
        el.style.display = (role === 'contractor-admin') ? 'none' : '';
    });
    document.querySelectorAll('.approver-only').forEach(el => {
        el.style.display = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role) ? '' : 'none';
    });

    // Update role badge in sidebar
    const demoBadge = document.getElementById('demo-role-badge');
    if (demoBadge) {
        const roleData = DB.roles[role];
        demoBadge.textContent = roleData ? roleData.title : role;
        demoBadge.style.background = roleData ? roleData.color + '33' : '';
        demoBadge.style.color = roleData ? roleData.color : '';
    }
}

// ── Demo Role Switcher Panel ──
function showRoleSwitcher() {
    const roles = DB.roles;
    const html = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:420px">
        <div class="modal-header">
          <div>
            <div class="modal-title">🎭 Demo Mode — Switch Role</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Simulates governance-level access differences</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:8px">
          ${Object.entries(roles).map(([key, r]) => `
            <button onclick="switchRole('${key}');closeModal()" style="
              display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;
              border:2px solid ${APP_STATE.currentRole === key ? r.color : 'var(--border)'};
              background:${APP_STATE.currentRole === key ? r.color + '18' : 'var(--bg-elevated)'};
              cursor:pointer;width:100%;text-align:left;transition:all 0.15s">
              <div style="width:36px;height:36px;border-radius:50%;background:${r.color};
                display:flex;align-items:center;justify-content:center;font-size:12px;
                font-weight:800;color:#fff;flex-shrink:0">${r.initials}</div>
              <div>
                <div style="font-weight:700;font-size:13px;color:var(--text-primary)">${r.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${r.title}</div>
              </div>
              ${APP_STATE.currentRole === key ? `<span style="margin-left:auto;color:${r.color};font-size:11px;font-weight:700">● Active</span>` : ''}
            </button>`).join('')}
        </div>
      </div>
    </div>`;
    openModal(html);
}


// ── Business Unit Switch ──
function switchBusinessUnit(buId) {
    APP_STATE.currentBU = buId;
    const bu = DB.businessUnits.find(b => b.id === buId);
    showToast(`Switched to ${bu ? bu.name : 'All Projects'}`, 'info');
    navigateTo(ROUTER.currentPage || 'dashboard', ROUTER.currentParams);
}

// ── Sidebar Toggle ──
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    APP_STATE.sidebarCollapsed = !APP_STATE.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', APP_STATE.sidebarCollapsed);
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
    }
}

// ── User Menu ──
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('hidden');
}

// Close user menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    const pill = document.querySelector('.user-pill');
    if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && pill && !pill.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// ── Splash Screen ──
function initApp() {
    const splash = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');

    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            mainApp.classList.remove('hidden');
            navigateTo('dashboard');
        }, 400);
    }, 2200);
}

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});
