// ============================================
// QR CODE VIEW PAGE - MODULE H
// ============================================

function renderQrView() {
    const permit = findPermit(APP_STATE.currentPermitId);
    if (!permit) return '<div class="empty-state"><p class="empty-title">Permit not found</p></div>';

    const isExpired = permit.status === 'EXPIRED';
    const isSuspended = permit.status === 'SUSPENDED';
    const isActive = permit.status === 'ACTIVE';
    const isApproved = permit.status === 'APPROVED';

    return `
    <div class="qr-view-page">
      <!-- Header -->
      <div class="qr-view-header">
        <p class="qr-view-logo">SafeWork PTW · Official Permit</p>
        <h1 class="qr-view-permit-type">${permit.typeIcon} ${permit.typeName}</h1>
        <p class="qr-view-id">${permit.id}</p>
      </div>

      <div class="qr-view-body">
        <!-- Status Banner -->
        ${isExpired ? `
          <div class="qr-view-status-banner expired">
            <p style="font-size:var(--font-size-lg);font-weight:800;color:var(--danger);margin-bottom:4px">⛔ PERMIT EXPIRED</p>
            <p style="font-size:var(--font-size-sm);color:#FCA5A5">This permit expired on ${permit.endDate} at ${permit.endTime}. No work may proceed.</p>
          </div>
        ` : isSuspended ? `
          <div class="qr-view-status-banner suspended">
            <p style="font-size:var(--font-size-lg);font-weight:800;color:var(--warning);margin-bottom:4px">⚠ PERMIT SUSPENDED</p>
            <p style="font-size:var(--font-size-sm);color:#FDB97D">${permit.suspendedReason || 'This permit has been suspended. All work must stop immediately.'}</p>
          </div>
        ` : `
          <div class="qr-view-status-banner active">
            <p style="font-size:var(--font-size-lg);font-weight:800;color:var(--success);margin-bottom:4px">✓ PERMIT ${isActive ? 'ACTIVE' : 'APPROVED'}</p>
            <p style="font-size:var(--font-size-sm);color:var(--success)">Valid from ${permit.startDate} ${permit.startTime} to ${permit.endDate} ${permit.endTime}</p>
          </div>
        `}

        <!-- QR Code -->
        <div class="qr-code-section">
          <div class="qr-container" id="qr-code-display"></div>
          <p class="qr-code-label">Scan to verify permit authenticity</p>
          <p style="font-size:var(--font-size-xs);color:var(--text-muted);font-family:monospace">${permit.id}</p>
        </div>

        <!-- Permit Info Grid -->
        <div class="permit-info-grid">
          <div class="permit-info-item">
            <p class="permit-info-label">Permit Type</p>
            <p class="permit-info-value">${permit.typeIcon} ${permit.typeName}</p>
          </div>
          <div class="permit-info-item">
            <p class="permit-info-label">Risk Level</p>
            <p class="permit-info-value" style="color:${permit.riskLevel === 'CRITICAL' ? 'var(--danger)' : permit.riskLevel === 'HIGH' ? 'var(--warning)' : 'var(--success)'}">
              ${permit.riskLevel}
            </p>
          </div>
          <div class="permit-info-item" style="grid-column:1/-1">
            <p class="permit-info-label">Location</p>
            <p class="permit-info-value">${permit.location}</p>
          </div>
          <div class="permit-info-item" style="grid-column:1/-1">
            <p class="permit-info-label">Zone</p>
            <p class="permit-info-value">${permit.zone}</p>
          </div>
          <div class="permit-info-item">
            <p class="permit-info-label">Valid From</p>
            <p class="permit-info-value">${permit.startDate}<br/><span style="color:var(--text-muted)">${permit.startTime}</span></p>
          </div>
          <div class="permit-info-item">
            <p class="permit-info-label">Valid Until</p>
            <p class="permit-info-value">${permit.endDate}<br/><span style="color:var(--text-muted)">${permit.endTime}</span></p>
          </div>
          <div class="permit-info-item" style="grid-column:1/-1">
            <p class="permit-info-label">Supervisor</p>
            <p class="permit-info-value">${permit.supervisor}</p>
          </div>
          <div class="permit-info-item" style="grid-column:1/-1">
            <p class="permit-info-label">Contractor</p>
            <p class="permit-info-value">${permit.contractor}</p>
          </div>
          <div class="permit-info-item" style="grid-column:1/-1">
            <p class="permit-info-label">Approved By</p>
            <p class="permit-info-value">${permit.approvedBy || '—'}</p>
          </div>
        </div>

        <!-- Status Badge -->
        <div style="text-align:center;margin-bottom:var(--space-5)">
          <span class="badge ${getStatusBadgeClass(permit.status)}" style="font-size:var(--font-size-sm);padding:8px 20px">
            ${getStatusLabel(permit.status)}
          </span>
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-lg);border:1px solid var(--border)">
          <p style="font-size:var(--font-size-xs);color:var(--text-muted);line-height:1.6">
            This permit is issued under the SafeWork PTW HSE Management System.<br/>
            Verify authenticity by scanning the QR code above.<br/>
            <strong style="color:var(--text-secondary)">SafeWork PTW v2.4.1 · Enterprise Edition</strong>
          </p>
        </div>

        <div style="height:var(--space-8)"></div>
      </div>
    </div>
  `;
}

// Initialize QR code after render
function init_qr_view() {
    const permit = findPermit(APP_STATE.currentPermitId);
    if (!permit) return;

    const container = document.getElementById('qr-code-display');
    if (!container) return;

    try {
        new QRCode(container, {
            text: `https://safework-ptw.com/verify/${permit.id}`,
            width: 160,
            height: 160,
            colorDark: '#0F172A',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        // Fallback if QRCode library not available
        container.innerHTML = `
      <div style="width:160px;height:160px;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border-radius:8px">
        <div style="text-align:center">
          <p style="font-size:10px;color:#333;font-weight:700;font-family:monospace">${permit.id}</p>
          <p style="font-size:9px;color:#666;margin-top:4px">QR Code</p>
        </div>
      </div>
    `;
    }
}
