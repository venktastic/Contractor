// ============================================
// CREATE PERMIT WIZARD - MODULE B
// 6-Step Mobile PTW Creation Flow
// ============================================

function renderCreatePermit() {
  const step = APP_STATE.wizard.currentStep;
  const data = APP_STATE.wizard.data;

  const stepLabels = ['Type', 'Details', 'Time', 'Checklist', 'RAMS', 'SIMOPS'];

  const progressHTML = `
    <div class="progress-steps">
      ${stepLabels.map((label, i) => {
    const stepNum = i + 1;
    const isCompleted = stepNum < step;
    const isActive = stepNum === step;
    return `
          <div class="progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
            <div class="step-circle">
              ${isCompleted ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>' : stepNum}
            </div>
            <span class="step-label">${label}</span>
          </div>
        `;
  }).join('')}
    </div>
  `;

  const stepContent = getWizardStepContent(step, data);

  return `
    <div class="wizard-page">
      <div class="wizard-header">
        ${progressHTML}
        <h2 class="wizard-step-title">${getStepTitle(step)}</h2>
        <p class="wizard-step-subtitle">${getStepSubtitle(step)}</p>
      </div>
      <div class="draft-indicator">
        <div class="draft-dot"></div>
        <span>Auto-saved as draft</span>
        <span style="margin-left:auto;font-size:10px">Step ${step} of 6</span>
      </div>
      <div class="wizard-body" id="wizard-body">
        ${stepContent}
      </div>
      <div class="wizard-footer">
        ${step > 1 ? `<button class="btn btn-secondary" onclick="wizardPrev()">Back</button>` : `<button class="btn btn-secondary" onclick="navigateTo('dashboard')">Cancel</button>`}
        ${step < 6
      ? `<button class="btn btn-primary" onclick="wizardNext()">Continue</button>`
      : `<button class="btn btn-primary" onclick="submitPermit()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Permit
            </button>`
    }
      </div>
    </div>
  `;
}

function getStepTitle(step) {
  const titles = {
    1: 'Select Permit Type',
    2: 'Job Details',
    3: 'Time Window',
    4: 'Risk Control Checklist',
    5: 'RAMS Document',
    6: 'SIMOPS Check & Submit'
  };
  return titles[step];
}

function getStepSubtitle(step) {
  const subs = {
    1: 'Choose the type of work being performed',
    2: 'Enter location, contractor, and team details',
    3: 'Define the permit validity window',
    4: 'Complete all required safety checks',
    5: 'Upload mandatory Risk Assessment & Method Statement',
    6: 'Review conflicts and submit for approval'
  };
  return subs[step];
}

function getWizardStepContent(step, data) {
  switch (step) {
    case 1: return renderStep1(data);
    case 2: return renderStep2(data);
    case 3: return renderStep3(data);
    case 4: return renderStep4(data);
    case 5: return renderStep5(data);
    case 6: return renderStep6(data);
    default: return '';
  }
}

// Step 1: Permit Type
function renderStep1(data) {
  return `
    <div class="permit-type-grid">
      ${PTW_DATA.permitTypes.map(type => `
        <div class="permit-type-card ${data.permitType === type.id ? 'selected' : ''}"
             onclick="selectPermitType('${type.id}')">
          <div class="permit-type-icon" style="background:${type.color}22">
            <span style="font-size:28px">${type.icon}</span>
          </div>
          <p class="permit-type-name">${type.name}</p>
          <span class="risk-badge ${getRiskBadgeClass(type.riskLevel)}">${type.riskLevel}</span>
          <p class="permit-type-risk" style="font-size:10px;color:var(--text-muted);text-align:center">${type.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function selectPermitType(typeId) {
  APP_STATE.wizard.data.permitType = typeId;
  // Re-render step 1
  document.getElementById('wizard-body').innerHTML = renderStep1(APP_STATE.wizard.data);
}

// Step 2: Job Details
function renderStep2(data) {
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <div class="form-group">
        <label class="form-label">Location <span class="required-star">*</span></label>
        <input class="form-input" type="text" id="w-location" placeholder="e.g. Block C - Level 4"
               value="${data.location}" oninput="saveWizardField('location', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Zone <span class="required-star">*</span></label>
        <select class="form-select" id="w-zone" onchange="saveWizardField('zone', this.value)">
          <option value="">Select zone...</option>
          ${PTW_DATA.zones.map(z => `<option value="${z}" ${data.zone === z ? 'selected' : ''}>${z}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Contractor <span class="required-star">*</span></label>
        <select class="form-select" id="w-contractor" onchange="saveWizardField('contractor', this.value)">
          <option value="">Select contractor...</option>
          ${PTW_DATA.contractors.map(c => `<option value="${c}" ${data.contractor === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Supervisor <span class="required-star">*</span></label>
        <select class="form-select" id="w-supervisor" onchange="saveWizardField('supervisor', this.value)">
          <option value="">Select supervisor...</option>
          ${PTW_DATA.supervisors.map(s => `<option value="${s.name}" ${data.supervisor === s.name ? 'selected' : ''}>${s.name} (${s.cert})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Team Description</label>
        <input class="form-input" type="text" id="w-team" placeholder="e.g. Welding Team Alpha (4 persons)"
               value="${data.team}" oninput="saveWizardField('team', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Work Description</label>
        <textarea class="form-textarea" id="w-desc" placeholder="Describe the work to be performed..."
                  oninput="saveWizardField('description', this.value)">${data.description}</textarea>
      </div>
    </div>
  `;
}

// Step 3: Time Window
function renderStep3(data) {
  const today = '2026-02-18';

  // FIX: Initialize defaults if missing so validation passes
  if (!data.startDate) APP_STATE.wizard.data.startDate = today;
  if (!data.startTime) APP_STATE.wizard.data.startTime = '08:00';
  if (!data.endDate) APP_STATE.wizard.data.endDate = today;
  if (!data.endTime) APP_STATE.wizard.data.endTime = '17:00';

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <div class="alert alert-warning">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="alert-content">
          <p class="alert-title">Time Window Notice</p>
          <p class="alert-body">Permits cannot exceed 24 hours. For longer works, create multiple permits with handover.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
        <div class="form-group">
          <label class="form-label">Start Date <span class="required-star">*</span></label>
          <input class="form-input" type="date" id="w-start-date" value="${data.startDate || today}"
                 min="${today}" onchange="saveWizardField('startDate', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Start Time <span class="required-star">*</span></label>
          <input class="form-input" type="time" id="w-start-time" value="${data.startTime || '08:00'}"
                 onchange="saveWizardField('startTime', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">End Date <span class="required-star">*</span></label>
          <input class="form-input" type="date" id="w-end-date" value="${data.endDate || today}"
                 min="${today}" onchange="saveWizardField('endDate', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">End Time <span class="required-star">*</span></label>
          <input class="form-input" type="time" id="w-end-time" value="${data.endTime || '17:00'}"
                 onchange="saveWizardField('endTime', this.value)" />
        </div>
      </div>
      <div class="card" style="padding:var(--space-4)">
        <p style="font-size:var(--font-size-xs);color:var(--text-muted);margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:0.05em;font-weight:700">Duration Summary</p>
        <p style="font-size:var(--font-size-lg);font-weight:700;color:var(--text-primary)" id="duration-display">9 hours 0 minutes</p>
        <p style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:4px">Permit validity window</p>
      </div>
    </div>
  `;
}

// Step 4: Risk Control Checklist
function renderStep4(data) {
  const permitType = getPermitType(data.permitType);
  if (!permitType) return '<p style="color:var(--text-muted);padding:var(--space-4)">Please select a permit type first.</p>';

  const checklist = permitType.checklist;
  if (data.checklist.length === 0) {
    data.checklist = new Array(checklist.length).fill(false);
  }

  const checked = data.checklist.filter(Boolean).length;

  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
        <div>
          <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary)">${permitType.name} Safety Checks</p>
          <p style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:2px">${checked}/${checklist.length} completed</p>
        </div>
        <div style="width:48px;height:48px;position:relative">
          <svg viewBox="0 0 36 36" width="48" height="48">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${checked === checklist.length ? 'var(--success)' : 'var(--brand-primary)'}" stroke-width="3"
              stroke-dasharray="${(checked / checklist.length) * 100} 100"
              stroke-linecap="round"
              transform="rotate(-90 18 18)"/>
          </svg>
          <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--text-primary)">${Math.round((checked / checklist.length) * 100)}%</span>
        </div>
      </div>
      <div class="card">
        ${checklist.map((item, i) => `
          <div class="checklist-item" onclick="toggleChecklistItem(${i})">
            <div class="checkbox ${data.checklist[i] ? 'checked' : ''}">
              ${data.checklist[i] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <p class="checklist-text ${data.checklist[i] ? 'checked-text' : ''}">${item}</p>
          </div>
        `).join('')}
      </div>
      ${checked < checklist.length ? `
        <div class="alert alert-warning" style="margin-top:var(--space-4)">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          <div class="alert-content">
            <p class="alert-title">Incomplete Checklist</p>
            <p class="alert-body">${checklist.length - checked} items remaining. All checks must be completed before submission.</p>
          </div>
        </div>
      ` : `
        <div class="alert alert-success" style="margin-top:var(--space-4)">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div class="alert-content">
            <p class="alert-title">All Checks Complete</p>
            <p class="alert-body">All safety controls have been verified. You may proceed.</p>
          </div>
        </div>
      `}
    </div>
  `;
}

function toggleChecklistItem(index) {
  APP_STATE.wizard.data.checklist[index] = !APP_STATE.wizard.data.checklist[index];
  document.getElementById('wizard-body').innerHTML = renderStep4(APP_STATE.wizard.data);
}

// Step 5: RAMS Upload
function renderStep5(data) {
  const hasRams = data.rams !== null;

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <div class="alert alert-danger">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <div class="alert-content">
          <p class="alert-title">RAMS Required</p>
          <p class="alert-body">A validated Risk Assessment & Method Statement is mandatory. The permit cannot be approved without it.</p>
        </div>
      </div>

      ${hasRams ? `
        <div class="file-item">
          <div class="file-icon pdf">PDF</div>
          <div class="file-info">
            <p class="file-name">${data.rams.name}</p>
            <p class="file-meta">${data.rams.size} · Uploaded just now</p>
          </div>
          <span class="hse-badge pending">Pending Validation</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="removeRams()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Remove & Re-upload
        </button>
      ` : `
        <div class="upload-zone" onclick="simulateRamsUpload()" id="upload-zone">
          <div class="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          </div>
          <p class="upload-title">Upload RAMS Document</p>
          <p class="upload-subtitle">Tap to select or drag & drop</p>
          <div class="upload-types">
            <span class="upload-type-tag">PDF</span>
            <span class="upload-type-tag">DOC</span>
            <span class="upload-type-tag">DOCX</span>
            <span class="upload-type-tag">JPG/PNG</span>
          </div>
        </div>
      `}

      <div class="card">
        <div class="card-header">
          <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary)">RAMS Requirements</p>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:var(--space-2)">
          ${[
      'Risk Assessment for all identified hazards',
      'Method Statement with step-by-step procedures',
      'Emergency response procedures',
      'PPE requirements specified',
      'Competency requirements listed',
      'Signed by responsible person'
    ].map(req => `
            <div style="display:flex;align-items:center;gap:var(--space-2)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
              <p style="font-size:var(--font-size-xs);color:var(--text-secondary)">${req}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function simulateRamsUpload() {
  const zone = document.getElementById('upload-zone');
  if (zone) {
    zone.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3)">
        <div style="width:40px;height:40px;border:3px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div>
        <p style="color:var(--text-secondary);font-size:var(--font-size-sm)">Uploading...</p>
      </div>
    `;
    setTimeout(() => {
      APP_STATE.wizard.data.rams = {
        name: 'RAMS_Document_v1.pdf',
        size: '2.1 MB',
        type: 'pdf'
      };
      document.getElementById('wizard-body').innerHTML = renderStep5(APP_STATE.wizard.data);
      showToast('RAMS document uploaded successfully', 'success');
    }, 1500);
  }
}

function removeRams() {
  APP_STATE.wizard.data.rams = null;
  document.getElementById('wizard-body').innerHTML = renderStep5(APP_STATE.wizard.data);
}

// Step 6: SIMOPS Check & Submit
function renderStep6(data) {
  const conflicts = data.zone ? detectSimopsConflicts(
    data.zone,
    data.startDate || '2026-02-18',
    data.startTime || '08:00',
    data.endDate || '2026-02-18',
    data.endTime || '17:00'
  ) : [];

  const permitType = getPermitType(data.permitType);
  const checkedCount = data.checklist.filter(Boolean).length;
  const totalChecks = permitType ? permitType.checklist.length : 0;

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <!-- Summary Card -->
      <div class="card">
        <div class="card-header">
          <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary)">Permit Summary</p>
          <span class="badge badge-draft">Draft</span>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:var(--space-2)">
          <div class="detail-row">
            <span class="detail-key">Type</span>
            <span class="detail-value">${permitType ? `${permitType.icon} ${permitType.name}` : 'Not selected'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Zone</span>
            <span class="detail-value">${data.zone || 'Not set'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Contractor</span>
            <span class="detail-value">${data.contractor || 'Not set'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Time Window</span>
            <span class="detail-value">${data.startDate || '—'} ${data.startTime || ''}–${data.endTime || ''}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Checklist</span>
            <span class="detail-value" style="color:${checkedCount === totalChecks ? 'var(--success)' : 'var(--warning)'}">
              ${checkedCount}/${totalChecks} ✓
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-key">RAMS</span>
            <span class="detail-value" style="color:${data.rams ? 'var(--success)' : 'var(--danger)'}">
              ${data.rams ? '✓ Uploaded' : '✗ Missing'}
            </span>
          </div>
        </div>
      </div>

      <!-- SIMOPS Check -->
      <div>
        <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-3)">
          SIMOPS Conflict Check
        </p>
        ${conflicts.length > 0 ? `
          <div class="alert alert-danger" style="margin-bottom:var(--space-3)">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div class="alert-content">
              <p class="alert-title">⚠ ${conflicts.length} SIMOPS Conflict${conflicts.length > 1 ? 's' : ''} Detected</p>
              <p class="alert-body">Simultaneous operations detected in ${data.zone}. Review conflicts below.</p>
            </div>
          </div>
          ${conflicts.map(c => `
            <div class="conflict-card" style="margin-bottom:var(--space-2)">
              <div class="conflict-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                <p class="conflict-title">${c.permit.id} — ${c.permit.typeName}</p>
                <span class="badge ${getStatusBadgeClass(c.permit.status)}" style="margin-left:auto">${getStatusLabel(c.permit.status)}</span>
              </div>
              <p style="font-size:var(--font-size-xs);color:var(--text-secondary);margin-bottom:var(--space-2)">${c.permit.title}</p>
              <div class="conflict-overlap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Overlap: ${c.overlapStart}–${c.overlapEnd} (${c.overlapDuration})
              </div>
            </div>
          `).join('')}
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="showModifyTimeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Modify Time
            </button>
            <button class="btn btn-warning btn-sm" style="flex:1" onclick="showOverrideModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Request Override
            </button>
          </div>
        ` : `
          <div class="alert alert-success">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div class="alert-content">
              <p class="alert-title">No Conflicts Detected</p>
              <p class="alert-body">No simultaneous operations found in ${data.zone || 'the selected zone'} for the specified time window.</p>
            </div>
          </div>
        `}
      </div>

      ${!data.rams ? `
        <div class="alert alert-danger">
          <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div class="alert-content">
            <p class="alert-title">RAMS Missing</p>
            <p class="alert-body">Go back to Step 5 and upload your RAMS document before submitting.</p>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Wizard Navigation
function wizardNext() {
  const step = APP_STATE.wizard.currentStep;
  const data = APP_STATE.wizard.data;

  // Validation
  if (step === 1 && !data.permitType) {
    showToast('Please select a permit type', 'error'); return;
  }
  if (step === 2 && (!data.location || !data.zone || !data.contractor || !data.supervisor)) {
    showToast('Please fill in all required fields', 'error'); return;
  }
  if (step === 3 && (!data.startDate || !data.startTime || !data.endDate || !data.endTime)) {
    showToast('Please set the permit time window', 'error'); return;
  }
  if (step === 5 && !data.rams) {
    showToast('RAMS document is mandatory', 'error'); return;
  }

  APP_STATE.wizard.currentStep = Math.min(step + 1, 6);
  renderPage('create-permit');
  document.getElementById('page-container').scrollTop = 0;
}

function wizardPrev() {
  APP_STATE.wizard.currentStep = Math.max(APP_STATE.wizard.currentStep - 1, 1);
  renderPage('create-permit');
  document.getElementById('page-container').scrollTop = 0;
}

function saveWizardField(field, value) {
  APP_STATE.wizard.data[field] = value;
}

function submitPermit() {
  const data = APP_STATE.wizard.data;
  if (!data.rams) {
    showToast('RAMS document is required before submission', 'error'); return;
  }

  // Create new permit
  const newPermit = {
    id: generatePermitId(),
    type: data.permitType,
    typeName: getPermitType(data.permitType)?.name || '',
    typeIcon: getPermitType(data.permitType)?.icon || '',
    title: `${getPermitType(data.permitType)?.name} - ${data.location}`,
    status: 'SUBMITTED',
    riskLevel: getPermitType(data.permitType)?.riskLevel || 'HIGH',
    location: data.location,
    zone: data.zone,
    contractor: data.contractor,
    supervisor: data.supervisor,
    team: data.team,
    startDate: data.startDate,
    startTime: data.startTime,
    endDate: data.endDate,
    endTime: data.endTime,
    description: data.description,
    rams: { status: 'PENDING', files: [{ ...data.rams, version: 1, date: '2026-02-18', validated: false }] },
    checklist: data.checklist,
    simopsConflicts: [],
    approvedBy: null,
    createdAt: new Date().toISOString(),
    createdBy: 'John Davies',
    auditLog: [
      { action: 'Permit Created', user: 'John Davies', time: new Date().toISOString(), type: 'create' },
      { action: 'RAMS Uploaded', user: 'John Davies', time: new Date().toISOString(), type: 'upload', detail: data.rams.name },
      { action: 'Submitted for Review', user: 'John Davies', time: new Date().toISOString(), type: 'submit' }
    ]
  };

  PTW_DATA.permits.unshift(newPermit);

  // Reset wizard
  APP_STATE.wizard = {
    currentStep: 1,
    totalSteps: 6,
    data: { permitType: null, location: '', zone: '', contractor: '', supervisor: '', team: '', startDate: '', startTime: '', endDate: '', endTime: '', description: '', checklist: [], rams: null, simopsChecked: false, conflicts: [] }
  };

  showToast('Permit submitted successfully!', 'success', 4000);
  APP_STATE.currentPermitId = newPermit.id;
  navigateTo('permit-detail', { permitId: newPermit.id });
}

function showModifyTimeModal() {
  showModal(`
    <div class="modal-overlay" id="active-modal">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <h3 class="modal-title">Modify Time Window</h3>
        <p style="font-size:var(--font-size-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">
          Adjust the permit time window to avoid the detected SIMOPS conflict.
        </p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-4)">
          <div class="form-group">
            <label class="form-label">New Start Time</label>
            <input class="form-input" type="time" value="${APP_STATE.wizard.data.startTime || '08:00'}" />
          </div>
          <div class="form-group">
            <label class="form-label">New End Time</label>
            <input class="form-input" type="time" value="${APP_STATE.wizard.data.endTime || '17:00'}" />
          </div>
        </div>
        <div style="display:flex;gap:var(--space-3)">
          <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" style="flex:1" onclick="applyTimeModification()">Apply Changes</button>
        </div>
      </div>
    </div>
  `);
}

function applyTimeModification() {
  closeModal();
  showToast('Time window updated. Re-checking SIMOPS...', 'info');
  setTimeout(() => {
    document.getElementById('wizard-body').innerHTML = renderStep6(APP_STATE.wizard.data);
  }, 1000);
}

function showOverrideModal() {
  showModal(`
    <div class="modal-overlay" id="active-modal">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <h3 class="modal-title" style="color:var(--warning)">⚠ Request SIMOPS Override</h3>
        <div class="override-warning">
          <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--danger);margin-bottom:4px">High Risk Action</p>
          <p style="font-size:var(--font-size-xs);color:#FCA5A5">Overriding a SIMOPS conflict increases risk. This action will be recorded in the audit log and requires HSE Manager approval.</p>
        </div>
        <div class="form-group" style="margin-bottom:var(--space-4)">
          <label class="form-label">Justification <span class="required-star">*</span></label>
          <textarea class="form-textarea" id="override-justification" placeholder="Provide detailed justification for why this override is safe and necessary..." style="min-height:120px"></textarea>
          <p class="form-hint">Minimum 50 characters required. This will appear in the audit log.</p>
        </div>
        <div class="form-group" style="margin-bottom:var(--space-4)">
          <label class="form-label">Additional Safety Measures</label>
          <textarea class="form-textarea" id="override-measures" placeholder="Describe additional safety measures that will be implemented to mitigate the conflict risk..."></textarea>
        </div>
        <div style="display:flex;gap:var(--space-3)">
          <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
          <button class="btn btn-danger" style="flex:1" onclick="submitOverride()">Submit Override Request</button>
        </div>
      </div>
    </div>
  `);
}

function submitOverride() {
  const justification = document.getElementById('override-justification')?.value || '';
  if (justification.length < 20) {
    showToast('Please provide a detailed justification', 'error'); return;
  }

  // Add to audit log
  PTW_DATA.auditLog.unshift({
    id: 'A_NEW',
    action: 'SIMOPS Override Requested',
    permitId: 'PTW-DRAFT',
    user: 'John Davies',
    time: new Date().toISOString(),
    type: 'override',
    detail: justification
  });

  closeModal();
  showToast('Override request submitted. Pending HSE Manager approval.', 'warning', 4000);
}
