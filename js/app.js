/* ============================================================
   HSW Digital — Contractor Management Portal
   app.js — Application Entry Point, State Management & RBAC
   ============================================================ */

const APP_STATE = {
    currentRole: 'enterprise-hse',
    currentBU: null,
    sidebarCollapsed: false,
    pageHistory: []
};

// ── Role Switch ──────────────────────────────────────────────
function switchRole(role) {
    APP_STATE.currentRole = role;
    const roleData = DB.roles[role];
    if (!roleData) return;

    // Update top bar
    const avatar = document.getElementById('top-avatar');
    if (avatar) {
        avatar.textContent = roleData.initials;
        avatar.style.background = `linear-gradient(135deg, ${roleData.color}cc, ${roleData.color})`;
    }
    const username = document.getElementById('top-username');
    if (username) username.textContent = roleData.name;
    const topRole = document.getElementById('top-role');
    if (topRole) topRole.textContent = roleData.title;

    // Update menu
    const menuUser = document.getElementById('menu-username');
    if (menuUser) menuUser.textContent = roleData.name;
    const menuRole = document.getElementById('menu-role');
    if (menuRole) menuRole.textContent = roleData.title;

    // Update demo badge
    const demoBadge = document.getElementById('demo-role-badge');
    if (demoBadge) {
        demoBadge.textContent = roleData.title.split(' ').slice(0, 2).join(' ');
    }

    // Apply RBAC
    applyRolePermissions(role);

    // Close menus
    const userMenu = document.getElementById('user-menu');
    if (userMenu) userMenu.classList.add('hidden');

    showToast(`Switched to ${roleData.title}`, 'info');
    navigateTo('dashboard');
}

function applyRolePermissions(role) {
    // enterprise-only elements
    document.querySelectorAll('.enterprise-only').forEach(el => {
        el.style.display = (role === 'enterprise-hse') ? '' : 'none';
    });
    // bu-and-above
    document.querySelectorAll('.bu-and-above').forEach(el => {
        el.style.display = ['enterprise-hse', 'bu-hse'].includes(role) ? '' : 'none';
    });
    // contractor-admin hidden
    document.querySelectorAll('.no-contractor-admin').forEach(el => {
        el.style.display = (role === 'contractor-admin') ? 'none' : '';
    });
    // approver-only
    document.querySelectorAll('.approver-only').forEach(el => {
        el.style.display = ['enterprise-hse', 'bu-hse', 'project-hse'].includes(role) ? '' : 'none';
    });

    // Update demo badge color
    const demoBadge = document.getElementById('demo-role-badge');
    if (demoBadge) {
        const rd = DB.roles[role];
        if (rd) {
            demoBadge.style.background = rd.color + '22';
            demoBadge.style.color = rd.color;
        }
    }

    // Sidebar role dot
    const dot = document.querySelector('.demo-role-btn .role-dot');
    if (dot && DB.roles[role]) dot.style.background = DB.roles[role].color;
}

// ── Demo Role Switcher Panel ─────────────────────────────────
function showRoleSwitcher() {
    const roles = DB.roles;
    const html = `
  <div class="modal-overlay" onclick="closeModal()">
    <div class="modal-box" onclick="event.stopPropagation()" style="max-width:400px">
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
            cursor:pointer;width:100%;text-align:left;font-family:var(--font-main)">
            <div style="width:36px;height:36px;border-radius:50%;background:${r.color};
              display:flex;align-items:center;justify-content:center;font-size:12px;
              font-weight:800;color:#fff;flex-shrink:0">${r.initials}</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px;color:var(--text-primary)">${r.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${r.title}</div>
            </div>
            ${APP_STATE.currentRole === key ? `<span style="color:${r.color};font-size:11px;font-weight:800">● Active</span>` : ''}
          </button>`).join('')}
      </div>
    </div>
  </div>`;
    openModal(html);
}

// ── Sidebar Toggle ───────────────────────────────────────────
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const shell = document.querySelector('.app-shell');
    APP_STATE.sidebarCollapsed = !APP_STATE.sidebarCollapsed;
    if (shell) shell.classList.toggle('sidebar-collapsed', APP_STATE.sidebarCollapsed);
    sidebar?.classList.toggle('collapsed', APP_STATE.sidebarCollapsed);
}

// ── User Menu ────────────────────────────────────────────────
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    const pill = document.querySelector('.user-pill');
    if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && pill && !pill.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// ── Splash Screen ────────────────────────────────────────────
function initApp() {
    const splash = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');

    setTimeout(() => {
        if (splash) { splash.classList.add('fade-out'); }
        setTimeout(() => {
            if (splash) splash.style.display = 'none';
            if (mainApp) mainApp.classList.remove('hidden');
            applyRolePermissions(APP_STATE.currentRole);
            navigateTo('dashboard');
        }, 400);
    }, 2200);
}

window.addEventListener('DOMContentLoaded', () => {
    initApp();
});
