
// ============================================
// CREATE PERMIT WIZARD - MODULE B (AI-DRIVEN)
// 7-Step Mobile PTW Creation Flow
// ============================================

function renderCreatePermit() {
  const step = APP_STATE.wizard.currentStep;
  const data = APP_STATE.wizard.data;

  // Updated Step Labels for new Flow
  const stepLabels = ['Capture', 'Details', 'AI Scan', 'RAMS', 'Watcher', 'SIMOPS', 'Submit'];

  const progressHTML = `
    <div class="progress-steps" style="overflow-x:auto;padding-bottom:10px">
      ${stepLabels.map((label, i) => {
    const stepNum = i + 1;
    const isCompleted = stepNum < step;
    const isActive = stepNum === step;
    return `
          <div class="progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}" style="min-width:60px">
            <div class="step-circle">
              ${isCompleted ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>' : stepNum}
            </div>
            <span class="step-label" style="font-size:9px">${label}</span>
          </div>
        `;
  }).join('')}
    </div>
  `;

  // Dynamic Step Content
  const stepContent = getWizardStepContent(step, data);

  return `
    <div class="wizard-page">
      <div class="wizard-header">
        ${progressHTML}
        <div style="text-align:center;margin-top:var(--space-2)">
          <h2 class="wizard-step-title">${getStepTitle(step)}</h2>
          <p class="wizard-step-subtitle">${getStepSubtitle(step)}</p>
        </div>
      </div>
      
      <div class="wizard-body" id="wizard-body" style="padding-bottom:80px">
        ${stepContent}
      </div>

      <div class="wizard-footer">
        ${step > 1
      ? `<button class="btn btn-secondary" onclick="wizardPrev()">Back</button>`
      : `<button class="btn btn-secondary" onclick="navigateTo('dashboard')">Cancel</button>`}
        
        ${getFooterButton(step, data)}
      </div>
    </div>
  `;
}

function getStepTitle(step) {
  const titles = {
    1: 'Site Capture',
    2: 'Work Details',
    3: 'AI Risk Analysis',
    4: 'RAMS & Controls',
    5: 'Assign Watcher',
    6: 'SIMOPS Check',
    7: 'Review & Submit'
  };
  return titles[step];
}

function getStepSubtitle(step) {
  const subs = {
    1: 'Capture a photo of the work area to start',
    2: 'Describe the work and location',
    3: 'Review AI-detected risks and permit type',
    4: 'Link Risk Assessment and Method Statement',
    5: 'Nominate a Competent Person / Watcher',
    6: 'Check for conflicting activities',
    7: 'Confirm details and submit for approval'
  };
  return subs[step];
}

function getFooterButton(step, data) {
  if (step === 7) {
    return `<button class="btn btn-primary" onclick="submitPermit()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Permit
            </button>`;
  }
  // Step 1 requires image
  if (step === 1 && !data.capturedImage) {
    return `<button class="btn btn-primary" disabled style="opacity:0.5;cursor:not-allowed">Capture to Continue</button>`;
  }
  return `<button class="btn btn-primary" onclick="wizardNext()">Continue</button>`;
}

function getWizardStepContent(step, data) {
  switch (step) {
    case 1: return renderStep1(data);
    case 2: return renderStep2(data);
    case 3: return renderStep3(data);
    case 4: return renderStep4(data);
    case 5: return renderStep5(data);
    case 6: return renderStep6(data);
    case 7: return renderStep7(data);
    default: return '';
  }
}

// ============================================
// STEP 1: CAMERA CAPTURE
// ============================================
function renderStep1(data) {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-4);padding:var(--space-4) 0">
      ${data.capturedImage ? `
        <div class="captured-image-preview" style="width:100%;aspect-ratio:4/3;background:#000;border-radius:12px;overflow:hidden;position:relative">
          <img src="${data.capturedImage}" style="width:100%;height:100%;object-fit:cover" />
          <button onclick="clearCapture()" style="position:absolute;bottom:16px;right:16px;background:white;color:black;border:none;padding:8px 16px;border-radius:20px;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(0,0,0,0.3)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1 2.12-9.36L23 10"/></svg>
            Retake
          </button>
        </div>
      ` : `
        <div class="camera-placeholder" style="width:100%;aspect-ratio:4/3;background:var(--card-bg);border:2px dashed var(--border);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="64" height="64" style="margin-bottom:var(--space-2)"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <p>Tap below to capture site conditions</p>
        </div>
        <label class="btn btn-primary btn-lg" style="width:100%;justify-content:center;padding:16px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" style="margin-right:8px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          Capture Photo
          <input type="file" accept="image/*" capture="environment" onchange="handleImageCapture(this)" style="display:none">
        </label>
      `}
      <div class="ai-hint" style="background:var(--brand-primary);color:white;padding:12px;border-radius:8px;font-size:var(--font-size-xs);display:flex;align-items:center;gap:8px;width:100%">
        <span style="font-size:16px">✨</span>
        <p><strong>AI Assistant:</strong> I'll analyze this photo to identify hazards and suggest the correct permit type.</p>
      </div>
    </div>
  `;
}

function handleImageCapture(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      APP_STATE.wizard.data.capturedImage = e.target.result;
      APP_STATE.wizard.data.imageTimestamp = new Date().toISOString();

      // Simulate Auto-Advance
      setTimeout(() => {
        renderPage('create-permit');
      }, 500);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function clearCapture() {
  APP_STATE.wizard.data.capturedImage = null;
  renderPage('create-permit');
}

// ============================================
// STEP 2: JOB DETAILS
// ============================================
function renderStep2(data) {
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <div class="form-group">
        <label class="form-label">Work Description <span class="required-star">*</span></label>
        <textarea class="form-textarea" placeholder="Describe the high-risk work..." oninput="saveWizardField('description', this.value)">${data.description}</textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Location <span class="required-star">*</span></label>
        <div style="display:flex;gap:var(--space-2)">
          <input class="form-input" type="text" value="${data.location}" placeholder="e.g. Block C" oninput="saveWizardField('location', this.value)" style="flex:1" />
          <button class="btn btn-secondary" onclick="getLocationGPS()" title="Use GPS">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Zone <span class="required-star">*</span></label>
        <select class="form-select" onchange="saveWizardField('zone', this.value)">
          <option value="">Select Zone...</option>
          ${PTW_DATA.zones.map(z => `<option value="${z}" ${data.zone === z ? 'selected' : ''}>${z}</option>`).join('')}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
        <div class="form-group">
          <label class="form-label">Start Time</label>
          <input class="form-input" type="time" value="${data.startTime || '08:00'}" onchange="saveWizardField('startTime', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">End Time</label>
          <input class="form-input" type="time" value="${data.endTime || '17:00'}" onchange="saveWizardField('endTime', this.value)" />
        </div>
      </div>
    </div>
  `;
}

function getLocationGPS() {
  saveWizardField('location', 'GPS: 25.2048° N, 55.2708° E');
  renderPage('create-permit');
}

// ============================================
// STEP 3: AI ANALYSIS
// ============================================
function renderStep3(data) {
  // Trigger AI Simulation if not already done
  if (!data.aiAnalysis.detectedType) {
    runAIAnalysis();
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;text-align:center">
        <div style="width:60px;height:60px;border:4px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:var(--space-4)"></div>
        <h3 style="margin-bottom:var(--space-2)">Analyzing Site Conditions...</h3>
        <p style="color:var(--text-muted)">Identifying hazards and permit requirements from your photo.</p>
      </div>
    `;
  }

  const ai = data.aiAnalysis;

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <!-- AI Badge -->
      <div class="card" style="background:linear-gradient(135deg, var(--brand-primary) 0%, #1a5c61 100%);color:white;border:none">
        <div class="card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:24px">✨</span>
              <span style="font-weight:700">AI Analysis Complete</span>
            </div>
            <span class="badge" style="background:rgba(255,255,255,0.2);color:white">${ai.confidence}% Confidence</span>
          </div>
          <p style="opacity:0.9;font-size:var(--font-size-sm);margin-bottom:var(--space-4)">
            Based on the image and description, we have identified the necessary permit and risks.
          </p>
          
          <div style="background:rgba(255,255,255,0.1);padding:12px;border-radius:8px;margin-bottom:var(--space-3)">
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.8;margin-bottom:4px">SUGGESTED PERMIT TYPE</p>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:18px;font-weight:700">${ai.detectedType}</span>
              <button class="btn btn-sm btn-ghost" style="color:white;border:1px solid rgba(255,255,255,0.3)" onclick="openTypeOverride()">Change</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detected Risks -->
      <div class="card">
        <div class="card-header">
           <h4 style="font-size:var(--font-size-md)">Detected Risks</h4>
        </div>
        <div class="card-body" style="display:flex;flex-wrap:wrap;gap:8px">
          ${ai.detectedRisks.map(risk => `
            <span class="chip" style="background:#FEF2F2;color:#991B1B;border:1px solid #FECACA">
              ⚠ ${risk}
            </span>
          `).join('')}
          <button class="chip" style="background:var(--bg-light);border:1px dashed var(--text-muted)" onclick="addRisk()">+ Add Risk</button>
        </div>
      </div>

      <!-- Suggested Controls -->
      <div class="card">
        <div class="card-header">
           <h4 style="font-size:var(--font-size-md)">Suggested Controls</h4>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
          ${ai.suggestedControls.map(control => `
            <div style="display:flex;align-items:center;gap:8px">
               <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
               <span style="font-size:var(--font-size-sm)">${control}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function runAIAnalysis() {
  setTimeout(() => {
    // Determine mock result based on description (simple keyword check)
    const desc = APP_STATE.wizard.data.description.toLowerCase();
    let result = MOCK_AI_DATA.default;

    if (desc.includes('weld') || desc.includes('fire') || desc.includes('cut')) result = MOCK_AI_DATA.welding;
    else if (desc.includes('height') || desc.includes('scaffold') || desc.includes('roof')) result = MOCK_AI_DATA.height;
    else if (desc.includes('confined') || desc.includes('tank')) result = MOCK_AI_DATA.confined;

    APP_STATE.wizard.data.aiAnalysis = {
      detectedType: result.type,
      confidence: result.confidence,
      detectedRisks: result.risks,
      suggestedControls: result.controls
    };
    APP_STATE.wizard.data.permitType = 'HOT_WORK'; // Simplified for prototype: usually map string to ID

    renderPage('create-permit');
  }, 2000);
}

// ============================================
// STEP 4: RAMS & RISK CONTROL CHECKLIST
// ============================================
function renderStep4(data) {
  // Get the permit type checklist from PTW_DATA
  const detectedTypeKey = data.aiAnalysis.detectedType;
  let checklistItems = [];
  if (detectedTypeKey) {
    // Map AI detected type name to PTW_DATA permitType ID
    const typeNameMap = {
      'Hot Work': 'HOT_WORK',
      'Work at Height': 'WORKING_AT_HEIGHT',
      'Confined Space': 'CONFINED_SPACE',
      'Electrical Work': 'ELECTRICAL',
      'Excavation': 'EXCAVATION',
      'Chemical Handling': 'CHEMICAL',
      'General Work': 'HOT_WORK' // fallback
    };
    const typeId = typeNameMap[detectedTypeKey] || 'HOT_WORK';
    const permitType = PTW_DATA.permitTypes.find(t => t.id === typeId);
    if (permitType) checklistItems = permitType.checklist;
  }

  // Initialise checklist state if not already done
  if (!data.checklist || data.checklist.length !== checklistItems.length) {
    APP_STATE.wizard.data.checklist = new Array(checklistItems.length).fill(false);
  }
  const checklist = data.checklist || [];

  // Mock existing RAMS documents
  const existingRams = [
    { id: 'RAMS_001', name: 'RAMS_HotWork_General_v3.pdf', date: '2026-02-10' },
    { id: 'RAMS_002', name: 'RAMS_ConfinedSpace_Standard.pdf', date: '2026-02-01' },
    { id: 'RAMS_003', name: 'RAMS_WorkAtHeight_Scaffold.pdf', date: '2026-01-28' },
    { id: 'RAMS_004', name: 'RAMS_Electrical_LV_v2.pdf', date: '2026-01-15' },
  ];

  const completedCount = checklist.filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">

      <!-- ── RAMS SECTION ─────────────────────────── -->
      <div class="card" style="border:2px solid var(--brand-primary);background:linear-gradient(135deg,rgba(30,90,95,0.07) 0%,transparent 100%)">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:var(--space-3)">
            <div style="width:36px;height:36px;background:var(--brand-primary);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div>
              <p style="font-weight:700;font-size:var(--font-size-md)">RAMS Document</p>
              <p style="font-size:var(--font-size-xs);color:var(--text-muted)">Risk Assessment & Method Statement required</p>
            </div>
            ${data.rams ? `<span class="badge badge-success" style="margin-left:auto">✓ Attached</span>` : `<span class="badge" style="margin-left:auto;background:var(--warning-bg);color:var(--warning)">Required</span>`}
          </div>

          <!-- Upload CTA -->
          <label style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;background:var(--brand-primary);color:white;border-radius:10px;cursor:pointer;font-weight:600;font-size:var(--font-size-sm);margin-bottom:var(--space-3);box-shadow:0 4px 14px rgba(30,90,95,0.35)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            Upload RAMS Document
            <input type="file" accept=".pdf,.doc,.docx" onchange="handleRamsUpload(this)" style="display:none">
          </label>

          <!-- Divider -->
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">
            <div style="flex:1;height:1px;background:var(--border)"></div>
            <span style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:1px">or select existing</span>
            <div style="flex:1;height:1px;background:var(--border)"></div>
          </div>

          <!-- Existing RAMS Dropdown -->
          <select class="form-select" onchange="selectExistingRams(this.value)" style="margin-bottom:0">
            <option value="">— Choose from existing RAMS library —</option>
            ${existingRams.map(r => `<option value="${r.id}" ${data.rams && data.rams.id === r.id ? 'selected' : ''}>${r.name} (${r.date})</option>`).join('')}
          </select>

          <!-- Attached file preview -->
          ${data.rams ? `
            <div style="display:flex;align-items:center;gap:10px;margin-top:var(--space-3);padding:10px 14px;background:var(--success-bg);border-radius:8px;border:1px solid var(--success)">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span style="font-size:var(--font-size-sm);font-weight:600;color:var(--success);flex:1">${data.rams.name}</span>
              <button onclick="clearRams()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:2px">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- ── RISK CONTROL CHECKLIST ─────────────────── -->
      ${checklistItems.length > 0 ? `
      <div class="card">
        <div class="card-header" style="padding-bottom:var(--space-2)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h4 style="font-size:var(--font-size-md);margin-bottom:2px">Risk Control Checklist</h4>
              <p style="font-size:var(--font-size-xs);color:var(--text-muted)">${completedCount} of ${totalCount} controls verified</p>
            </div>
            <div style="width:44px;height:44px;position:relative">
              <svg viewBox="0 0 36 36" width="44" height="44">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" stroke-width="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="${progress === 100 ? 'var(--success)' : 'var(--brand-primary)'}" stroke-width="3"
                  stroke-dasharray="${progress} ${100 - progress}" stroke-dashoffset="25" stroke-linecap="round"/>
              </svg>
              <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:9px;font-weight:700;color:${progress === 100 ? 'var(--success)' : 'var(--brand-primary)'}">${progress}%</span>
            </div>
          </div>
          <!-- Progress Bar -->
          <div style="margin-top:var(--space-2);height:4px;background:var(--border);border-radius:4px;overflow:hidden">
            <div style="width:${progress}%;height:100%;background:${progress === 100 ? 'var(--success)' : 'var(--brand-primary)'};border-radius:4px;transition:width 0.3s ease"></div>
          </div>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:2px;padding-top:var(--space-2)">
          ${checklistItems.map((item, idx) => `
            <label style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;${idx === checklistItems.length - 1 ? 'border-bottom:none' : ''}">
              <div style="position:relative;flex-shrink:0;margin-top:1px">
                <input type="checkbox" ${checklist[idx] ? 'checked' : ''} onchange="toggleChecklistItem(${idx}, this.checked)"
                  style="position:absolute;opacity:0;width:22px;height:22px;cursor:pointer;z-index:1">
                <div style="width:22px;height:22px;border-radius:6px;border:2px solid ${checklist[idx] ? 'var(--success)' : 'var(--border)'};background:${checklist[idx] ? 'var(--success)' : 'transparent'};display:flex;align-items:center;justify-content:center;transition:all 0.15s ease">
                  ${checklist[idx] ? `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                </div>
              </div>
              <span style="font-size:var(--font-size-sm);color:${checklist[idx] ? 'var(--text-muted)' : 'var(--text-primary)'};line-height:1.4;${checklist[idx] ? 'text-decoration:line-through' : ''}">${item}</span>
            </label>
          `).join('')}
        </div>
        ${progress < 100 ? `
        <div style="padding:var(--space-3);padding-top:0">
          <button onclick="markAllChecklistItems()" style="width:100%;padding:8px;border:1px dashed var(--border);background:none;border-radius:8px;font-size:var(--font-size-xs);color:var(--text-muted);cursor:pointer;font-weight:600">
            ✓ Mark All as Verified
          </button>
        </div>
        ` : ''}
      </div>
      ` : `
      <div class="alert alert-info">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div class="alert-content">
          <p class="alert-title">Checklist Loading</p>
          <p class="alert-body">Complete Step 3 AI Analysis to load the risk control checklist for this permit type.</p>
        </div>
      </div>
      `}

    </div>
  `;
}

function handleRamsUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    APP_STATE.wizard.data.rams = {
      id: 'upload_' + Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      type: 'upload',
      date: new Date().toISOString().split('T')[0],
      validated: false
    };
    showToast('RAMS document attached', 'success');
    renderPage('create-permit');
  }
}

function selectExistingRams(id) {
  if (!id) return;
  const existingRams = [
    { id: 'RAMS_001', name: 'RAMS_HotWork_General_v3.pdf', date: '2026-02-10', validated: true },
    { id: 'RAMS_002', name: 'RAMS_ConfinedSpace_Standard.pdf', date: '2026-02-01', validated: true },
    { id: 'RAMS_003', name: 'RAMS_WorkAtHeight_Scaffold.pdf', date: '2026-01-28', validated: true },
    { id: 'RAMS_004', name: 'RAMS_Electrical_LV_v2.pdf', date: '2026-01-15', validated: true },
  ];
  const selected = existingRams.find(r => r.id === id);
  if (selected) {
    APP_STATE.wizard.data.rams = selected;
    showToast('RAMS document selected', 'success');
    renderPage('create-permit');
  }
}

function clearRams() {
  APP_STATE.wizard.data.rams = null;
  renderPage('create-permit');
}

function toggleChecklistItem(index, checked) {
  if (!APP_STATE.wizard.data.checklist) return;
  APP_STATE.wizard.data.checklist[index] = checked;
  // Re-render only the checklist section to avoid losing focus
  renderPage('create-permit');
}

function markAllChecklistItems() {
  if (!APP_STATE.wizard.data.checklist) return;
  APP_STATE.wizard.data.checklist = APP_STATE.wizard.data.checklist.map(() => true);
  renderPage('create-permit');
}

// ============================================
// STEP 5: ASSIGN WATCHER
// ============================================
function renderStep5(data) {
  // Correctly mapping data to 'competentPerson' field
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <h3 style="font-size:var(--font-size-lg)">Nominate Competent Person</h3>
      <p style="color:var(--text-secondary)">Assign a designated Watcher/Standby person for this high-risk activity.</p>
      
      <div class="card">
        <div class="form-group">
          <label class="form-label">Select Watcher</label>
          <select class="form-select" onchange="saveWizardField('competentPerson', this.value)">
             <option value="">Select person...</option>
             ${USERS.filter(u => u.role === 'WATCHER').map(u => `
               <option value="${u.id}" ${data.competentPerson === u.id ? 'selected' : ''}>${u.name} (Watcher)</option>
             `).join('')}
          </select>
        </div>
      </div>
    
      ${data.competentPerson ? `
        <div class="card" style="display:flex;align-items:center;gap:12px;padding:var(--space-3)">
           <div class="user-avatar" style="width:40px;height:40px;font-size:16px">SC</div>
           <div>
              <p style="font-weight:700">Sarah Connor</p>
              <p style="font-size:12px;color:var(--text-muted)">Certified Fire Watch</p>
           </div>
           <span class="badge badge-success" style="margin-left:auto">Available</span>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================
// STEP 6: SIMOPS
// ============================================
function renderStep6(data) {
  // Reusing existing SIMOPS logic
  return renderStep6Original(data); // We'll wrap the old logic
}

function renderStep6Original(data) {
  const conflicts = data.zone ? detectSimopsConflicts(
    data.zone,
    data.startDate || new Date().toISOString().split('T')[0],
    data.startTime || '08:00',
    data.endDate || new Date().toISOString().split('T')[0],
    data.endTime || '17:00'
  ) : [];

  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <div>
        <p style="font-size:var(--font-size-sm);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-3)">
          SIMOPS Conflict Check
        </p>
        ${conflicts.length > 0 ? `
          <div class="alert alert-danger">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div class="alert-content">
              <p class="alert-title">⚠ ${conflicts.length} SIMOPS Conflict${conflicts.length > 1 ? 's' : ''} Detected</p>
              <p class="alert-body">Simultaneous operations detected in ${data.zone}.</p>
            </div>
          </div>
          <!-- Visualization Strip (Gantt-lite) -->
          <div style="margin-top:var(--space-3);height:60px;background:var(--bg-light);border-radius:8px;position:relative;overflow:hidden">
             <!-- Current Permit Bar -->
             <div style="position:absolute;top:10px;left:20%;width:60%;height:16px;background:var(--brand-primary);border-radius:4px"></div>
             <!-- Conflict Bar -->
             <div style="position:absolute;top:30px;left:30%;width:40%;height:16px;background:var(--danger);opacity:0.7;border-radius:4px"></div>
          </div>
        ` : `
          <div class="alert alert-success">
             <div class="alert-content">
               <p class="alert-title">No Conflicts</p>
               <p class="alert-body">Safe to proceed in ${data.zone || 'selected zone'}.</p>
             </div>
          </div>
        `}
      </div>
    </div>
  `;
}

// ============================================
// STEP 7: SUBMIT
// ============================================
function renderStep7(data) {
  return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
       <div class="card">
          <h3 style="font-size:var(--font-size-md);margin-bottom:var(--space-3)">Final Review</h3>
          <div class="detail-row"><span class="detail-key">Type</span> <span>${data.aiAnalysis.detectedType || 'General'}</span></div>
          <div class="detail-row"><span class="detail-key">Zone</span> <span>${data.zone}</span></div>
          <div class="detail-row"><span class="detail-key">Watcher</span> <span>${data.competentPerson ? 'Assigned' : 'None'}</span></div>
          <div class="detail-row"><span class="detail-key">RAMS</span> <span style="color:var(--success)">Attached</span></div>
       </div>
    </div>
  `;
}

// ============================================
// NAVIGATION & LOGIC
// ============================================

function wizardNext() {
  const step = APP_STATE.wizard.currentStep;

  // Basic Validation
  if (step === 2 && !APP_STATE.wizard.data.description) { showToast('Description required', 'error'); return; }

  APP_STATE.wizard.currentStep = Math.min(step + 1, 7);
  renderPage('create-permit');
}

function wizardPrev() {
  APP_STATE.wizard.currentStep = Math.max(APP_STATE.wizard.currentStep - 1, 1);
  renderPage('create-permit');
}

function saveWizardField(field, value) {
  APP_STATE.wizard.data[field] = value;
}

function submitPermit() {
  // Use existing submit logic but mapped to new data
  const data = APP_STATE.wizard.data;
  const newPermit = {
    id: generatePermitId(),
    type: 'HOT_WORK', // Simplified
    typeName: data.aiAnalysis.detectedType || 'Hot Work',
    title: `${data.aiAnalysis.detectedType} - ${data.location}`,
    status: 'SUBMITTED',
    riskLevel: 'HIGH',
    location: data.location,
    zone: data.zone,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    description: data.description,
    competentPerson: data.competentPerson,
    createdAt: new Date().toISOString(),
    auditLog: []
  };

  PTW_DATA.permits.unshift(newPermit);

  // Reset Wizard State
  APP_STATE.wizard.currentStep = 1;
  APP_STATE.wizard.data = {
    capturedImage: null,
    imageTimestamp: null,
    aiAnalysis: {
      detectedType: null,
      confidence: 0,
      detectedRisks: [],
      suggestedControls: []
    },
    description: '',
    location: '',
    zone: '',
    permitType: null,
    startTime: '',
    endTime: '',
    rams: null,
    competentPerson: null,
    simopsConflicts: []
  };

  showToast('Permit Submitted Successfully', 'success');
  navigateTo('dashboard');
}

// Ensure detectSimopsConflicts is available or mock it if needed
if (typeof detectSimopsConflicts === 'undefined') {
  window.detectSimopsConflicts = function (zone) { return []; };
}
