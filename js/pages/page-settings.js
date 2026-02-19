/* ============================================================
   settings.js — System Settings
   ============================================================ */

function renderSettings() {
    const container = document.getElementById('page-container');
    return `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Settings</div>
          <div class="page-subtitle">Configure portal preferences and user access</div>
        </div>
      </div>
      <div class="card">
        <div style="padding: 3rem; text-align: center; color: var(--text-muted);">
          <div style="font-size: 48px; margin-bottom: 1rem;">⚙️</div>
          <h3>Preferences</h3>
          <p>System settings panel.</p>
        </div>
      </div>
    </div>`;
}
