/* ============================================================
   onboarding.js — Contractor Registration & Prequalification
   ============================================================ */

let _onboardingStep = 1;
let _onboardingData = { companyName: '', regNum: '', buId: 'bu-1', projects: [], scopeOfWork: [], contact: '', email: '', phone: '', documents: {} };

const REQUIRED_DOCS = [
  { id: 'hsw-policy', name: 'HSW Policy', required: true, hasExpiry: true },
  { id: 'risk-assessment', name: 'Risk Assessment Plan', required: true, hasExpiry: true },
  { id: 'public-liability', name: 'Public Liability Insurance', required: true, hasExpiry: true },
  { id: 'workers-comp', name: "Workers' Compensation Insurance", required: true, hasExpiry: true },
  { id: 'licenses', name: 'Trade Licenses / Certifications', required: false, hasExpiry: true },
  { id: 'emergency-plan', name: 'Emergency Response Plan', required: false, hasExpiry: false },
  { id: 'env-plan', name: 'Environmental Management Plan', required: false, hasExpiry: false }
];

function renderOnboarding(params = {}) {
  const container = document.getElementById('page-container');
  if (params.edit) _onboardingStep = 1;

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Contractor Registration</div>
          <div class="page-subtitle">Register a new contractor for prequalification</div>
        </div>
        <button class="btn btn-secondary" onclick="navigateTo('contractors')">Cancel</button>
      </div>

      <div class="onboarding-layout">
        <!-- Step Sidebar -->
        <div class="card" style="padding:16px;height:fit-content">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:12px">Registration Steps</div>
          <div class="onboarding-sidebar">
            ${[
      { n: 1, label: 'Company Information', sub: 'Basic details & contact' },
      { n: 2, label: 'HSW Documentation', sub: 'Upload required documents' },
      { n: 3, label: 'Risk Profile', sub: 'Scope & risk assessment' },
      { n: 4, label: 'Review & Submit', sub: 'Final review' }
    ].map(s => `
              <div class="onboarding-step-item ${_onboardingStep === s.n ? 'active' : _onboardingStep > s.n ? 'done' : ''}" onclick="goToOnboardingStep(${s.n})">
                <div class="onboarding-step-num">${_onboardingStep > s.n ? '✓' : s.n}</div>
                <div><div class="onboarding-step-label">${s.label}</div><div class="onboarding-step-sub">${s.sub}</div></div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Step Content -->
        <div id="onboarding-step-content">
          ${renderOnboardingStep(_onboardingStep)}
        </div>
      </div>
    </div>`;
}

function renderOnboardingStep(step) {
  switch (step) {
    case 1: return renderStep1();
    case 2: return renderStep2();
    case 3: return renderStep3();
    case 4: return renderStep4();
    default: return '';
  }
}

function renderStep1() {
  return `<div class="card">
    <div class="card-header"><div class="card-title">Company Information</div></div>
    <div class="card-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company Name <span class="required">*</span></label>
          <input type="text" class="form-control" id="ob-company" placeholder="e.g. Apex Civil Engineering" value="${_onboardingData.companyName}" oninput="_onboardingData.companyName=this.value">
        </div>
        <div class="form-group">
          <label class="form-label">ABN / Registration Number <span class="required">*</span></label>
          <input type="text" class="form-control" id="ob-reg" placeholder="e.g. ABN 45 123 456 789" value="${_onboardingData.regNum}" oninput="_onboardingData.regNum=this.value">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project <span class="required">*</span></label>
          <select class="form-select" id="ob-bu" onchange="_onboardingData.buId=this.value">
            ${DB.businessUnits.map(b => `<option value="${b.id}" ${_onboardingData.buId === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Primary Contact Name <span class="required">*</span></label>
          <input type="text" class="form-control" id="ob-contact" placeholder="Full name" value="${_onboardingData.contact}" oninput="_onboardingData.contact=this.value">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email Address <span class="required">*</span></label>
          <input type="email" class="form-control" id="ob-email" placeholder="contact@company.com.au" value="${_onboardingData.email}" oninput="_onboardingData.email=this.value">
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number <span class="required">*</span></label>
          <input type="tel" class="form-control" id="ob-phone" placeholder="+61 2 XXXX XXXX" value="${_onboardingData.phone}" oninput="_onboardingData.phone=this.value">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Assigned Projects (multi-select)</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
          ${DB.projects.map(p => `<label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--border-color);border-radius:6px;cursor:pointer;font-size:12px;font-weight:500">
            <input type="checkbox" style="accent-color:var(--brand-primary-light)" ${_onboardingData.projects.includes(p.id) ? 'checked' : ''} onchange="toggleProject('${p.id}', this.checked)"> ${p.name}
          </label>`).join('')}
        </div>
      </div>
    </div>
    <div class="card-footer" style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="nextOnboardingStep()">Next: Documentation →</button>
    </div>
  </div>`;
}

function renderStep2() {
  return `<div class="card">
    <div class="card-header"><div class="card-title">HSW Documentation Upload</div><div class="card-subtitle">Upload all required documents. Expiry dates are mandatory where applicable.</div></div>
    <div class="card-body">
      <div class="doc-upload-list">
        ${REQUIRED_DOCS.map(doc => `
          <div class="doc-upload-item ${_onboardingData.documents[doc.id] ? 'uploaded' : doc.required ? 'required' : ''}">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="doc-upload-name">${doc.name}</span>
                ${doc.required ? '<span class="doc-upload-req">Required</span>' : '<span style="font-size:10px;color:var(--text-muted)">Optional</span>'}
              </div>
              ${doc.hasExpiry ? `<div style="margin-top:6px;display:flex;align-items:center;gap:8px">
                <label style="font-size:11px;color:var(--text-muted)">Expiry Date:</label>
                <input type="date" class="doc-expiry-input" onchange="setDocExpiry('${doc.id}', this.value)">
              </div>` : ''}
            </div>
            <div class="doc-upload-status">
              ${_onboardingData.documents[doc.id] ? `<span class="badge badge-compliant">✓ Uploaded</span>` : ''}
              <button class="btn btn-secondary btn-sm" onclick="simulateUpload('${doc.id}', '${doc.name}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
              </button>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="card-footer" style="display:flex;justify-content:space-between">
      <button class="btn btn-secondary" onclick="prevOnboardingStep()">← Back</button>
      <button class="btn btn-primary" onclick="nextOnboardingStep()">Next: Risk Profile →</button>
    </div>
  </div>`;
}

function renderStep3() {
  const scopes = ['Earthworks', 'Concrete Structures', 'Road Construction', 'Electrical Installation', 'HV Systems', 'Scaffolding', 'Demolition', 'Hazardous Materials', 'Crane Operations', 'Plumbing', 'HVAC', 'Landscaping', 'Civil Works', 'Asbestos Removal'];
  return `<div class="card">
    <div class="card-header"><div class="card-title">Risk Profile & Scope of Work</div></div>
    <div class="card-body">
      <div class="form-group">
        <label class="form-label">Scope of Work <span class="required">*</span></label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
          ${scopes.map(s => `<label style="display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--border-color);border-radius:6px;cursor:pointer;font-size:12px;font-weight:500">
            <input type="checkbox" style="accent-color:var(--brand-primary-light)" ${_onboardingData.scopeOfWork.includes(s) ? 'checked' : ''} onchange="toggleScope('${s}', this.checked)"> ${s}
          </label>`).join('')}
        </div>
      </div>
      <div class="form-group" style="margin-top:16px">
        <label class="form-label">Critical Risk Exposures</label>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">
          ${['Working at Heights', 'Confined Space Entry', 'Electrical HV Work', 'Asbestos / Hazardous Materials', 'Explosive Use', 'Crane / Heavy Lift Operations'].map(r => `
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
              <input type="checkbox" style="accent-color:var(--color-noncompliant)"> ${r}
            </label>`).join('')}
        </div>
      </div>
      <div class="alert-banner alert-warning" style="margin-top:16px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div class="alert-banner-content">
          <div class="alert-banner-title">Risk Score Preview</div>
          <div class="alert-banner-text">Based on scope selection, estimated risk level: <strong>Medium</strong>. High or Critical risk contractors require enhanced approval workflow.</div>
        </div>
      </div>
    </div>
    <div class="card-footer" style="display:flex;justify-content:space-between">
      <button class="btn btn-secondary" onclick="prevOnboardingStep()">← Back</button>
      <button class="btn btn-primary" onclick="nextOnboardingStep()">Next: Review →</button>
    </div>
  </div>`;
}

function renderStep4() {
  return `<div class="card">
    <div class="card-header"><div class="card-title">Review & Submit</div></div>
    <div class="card-body">
      <div class="alert-banner alert-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="alert-banner-content">
          <div class="alert-banner-title">Ready to Submit</div>
          <div class="alert-banner-text">Once submitted, your application will be reviewed within 5 business days. You will be notified of the outcome via email.</div>
        </div>
      </div>
      <div class="info-grid" style="margin-top:16px">
        <div class="info-item"><div class="info-label">Company Name</div><div class="info-value">${_onboardingData.companyName || '(not entered)'}</div></div>
        <div class="info-item"><div class="info-label">Registration Number</div><div class="info-value">${_onboardingData.regNum || '(not entered)'}</div></div>
        <div class="info-item"><div class="info-label">Primary Contact</div><div class="info-value">${_onboardingData.contact || '(not entered)'}</div></div>
        <div class="info-item"><div class="info-label">Email</div><div class="info-value">${_onboardingData.email || '(not entered)'}</div></div>
        <div class="info-item"><div class="info-label">Documents Uploaded</div><div class="info-value">${Object.keys(_onboardingData.documents).length} of ${REQUIRED_DOCS.filter(d => d.required).length} required</div></div>
        <div class="info-item"><div class="info-label">Status After Submit</div><div class="info-value">${statusBadge('Submitted')}</div></div>
      </div>
    </div>
    <div class="card-footer" style="display:flex;justify-content:space-between">
      <button class="btn btn-secondary" onclick="prevOnboardingStep()">← Back</button>
      <button class="btn btn-primary" onclick="submitOnboarding()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Submit Application
      </button>
    </div>
  </div>`;
}

function nextOnboardingStep() {
  if (_onboardingStep < 4) { _onboardingStep++; document.getElementById('onboarding-step-content').innerHTML = renderOnboardingStep(_onboardingStep); updateOnboardingSidebar(); }
}
function prevOnboardingStep() {
  if (_onboardingStep > 1) { _onboardingStep--; document.getElementById('onboarding-step-content').innerHTML = renderOnboardingStep(_onboardingStep); updateOnboardingSidebar(); }
}
function goToOnboardingStep(n) { _onboardingStep = n; document.getElementById('onboarding-step-content').innerHTML = renderOnboardingStep(n); updateOnboardingSidebar(); }
function updateOnboardingSidebar() {
  document.querySelectorAll('.onboarding-step-item').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === _onboardingStep) el.classList.add('active');
    else if (i + 1 < _onboardingStep) el.classList.add('done');
  });
}
function toggleProject(id, checked) { if (checked) _onboardingData.projects.push(id); else _onboardingData.projects = _onboardingData.projects.filter(p => p !== id); }
function toggleScope(s, checked) { if (checked) _onboardingData.scopeOfWork.push(s); else _onboardingData.scopeOfWork = _onboardingData.scopeOfWork.filter(x => x !== s); }
function simulateUpload(docId, docName) { _onboardingData.documents[docId] = { name: docName, uploaded: true }; showToast(`${docName} uploaded successfully`, 'success'); document.getElementById('onboarding-step-content').innerHTML = renderOnboardingStep(_onboardingStep); }
function setDocExpiry(docId, val) { if (_onboardingData.documents[docId]) _onboardingData.documents[docId].expiry = val; }
function submitOnboarding() {
  showToast('Application submitted successfully! Status: Under Review', 'success');
  _onboardingData = { companyName: '', regNum: '', buId: 'bu-1', projects: [], scopeOfWork: [], contact: '', email: '', phone: '', documents: {} };
  _onboardingStep = 1;
  setTimeout(() => navigateTo('contractors'), 1500);
}
