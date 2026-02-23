/* ============================================================
   HSW Digital — Contractor Management Portal
   data.js — Mock Data Store
   ============================================================ */

const DB = {

  roles: {
    'enterprise-hse': { name: 'Prakash Senghani', initials: 'PS', title: 'Enterprise HSE Director', color: '#3B82F6', scope: 'all' },
    'bu-hse': { name: 'Marcus Chen', initials: 'MC', title: 'BU HSE Manager', color: '#8B5CF6', scope: 'bu' },
    'project-hse': { name: 'Sarah Okafor', initials: 'SO', title: 'Project HSE Manager', color: '#10B981', scope: 'project' },
    'contractor-admin': { name: 'James Patel', initials: 'JP', title: 'Contractor Admin', color: '#F59E0B', scope: 'own' },
    'site-supervisor': { name: 'Tom Walsh', initials: 'TW', title: 'Site Supervisor', color: '#EF4444', scope: 'project' },
    'procurement': { name: 'Lisa Nguyen', initials: 'LN', title: 'Procurement Team', color: '#6B7280', scope: 'all' }
  },

  businessUnits: [
    { id: 'bu-1', name: 'Infrastructure Division', code: 'INFRA' },
    { id: 'bu-2', name: 'Energy & Resources', code: 'ENRG' },
    { id: 'bu-3', name: 'Civil Construction', code: 'CIVIL' }
  ],

  projects: [
    { id: 'proj-1', buId: 'bu-1', name: 'M7 Motorway Extension', code: 'M7-EXT' },
    { id: 'proj-2', buId: 'bu-1', name: 'Harbour Bridge Maintenance', code: 'HBM-24' },
    { id: 'proj-3', buId: 'bu-1', name: 'Western Rail Upgrade', code: 'WRU-25' },
    { id: 'proj-4', buId: 'bu-2', name: 'Offshore Platform Alpha', code: 'OPA-23' },
    { id: 'proj-5', buId: 'bu-2', name: 'Solar Farm Narrabri', code: 'SFN-24' },
    { id: 'proj-6', buId: 'bu-3', name: 'CBD Tower Development', code: 'CBD-T1' },
    { id: 'proj-7', buId: 'bu-3', name: 'Westfield Expansion', code: 'WFE-25' },
    { id: 'proj-8', buId: 'bu-3', name: 'Airport Terminal 3', code: 'APT-T3' }
  ],

  contractors: [
    {
      id: 'c-001', name: 'Apex Civil Engineering', regNum: 'ABN 45 123 456 789',
      buId: 'bu-1', projects: ['proj-1', 'proj-3'],
      scopeOfWork: ['Earthworks', 'Concrete Structures', 'Road Construction'],
      contact: 'David Morrison', email: 'd.morrison@apexcivil.com.au', phone: '+61 2 9876 5432',
      status: 'Approved', riskLevel: 'Medium', riskScore: 52,
      compliancePercent: 88, workerCount: 47, activeWorkers: 42,
      incidents: 3, openActions: 2, overdueActions: 0,
      incidents90d: 1, closureSpeed: 8, ifrTrend: 'down',
      ifr: 0.8, auditFindings: 4, predictiveRisk: 'Stable',
      aiSummary: 'Minor upward trend in near-miss events. Compliance improving over last 60 days. No escalation trigger.',
      trendData: { incidents: [3, 2, 4, 3, 2, 3, 1], compliance: [82, 84, 85, 87, 86, 88, 88], actions: [5, 4, 4, 3, 3, 2, 2] },
      approvedDate: '2025-08-15', reviewDue: '2026-08-15',
      documents: [
        { id: 'd-1', name: 'HSW Policy', status: 'Approved', expiry: '2026-06-30', version: 'v3.2', uploadDate: '2025-08-10' },
        { id: 'd-2', name: 'Risk Assessment Plan', status: 'Approved', expiry: '2026-03-31', version: 'v2.1', uploadDate: '2025-08-10' },
        { id: 'd-3', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-02-28', version: 'v1.0', uploadDate: '2025-08-10' },
        { id: 'd-4', name: 'Workers Compensation', status: 'Expiring', expiry: '2026-03-15', version: 'v1.0', uploadDate: '2025-08-10' },
        { id: 'd-5', name: 'Trade Licenses', status: 'Approved', expiry: '2027-01-01', version: 'v1.0', uploadDate: '2025-08-10' }
      ],
      approvalHistory: [
        { date: '2025-08-15', action: 'Approved', user: 'Marcus Chen', comment: 'All documents verified. Risk profile acceptable.' },
        { date: '2025-08-12', action: 'Under Review', user: 'Sarah Okafor', comment: 'Requested updated insurance certificate.' },
        { date: '2025-08-08', action: 'Submitted', user: 'David Morrison', comment: 'Initial submission for M7 project.' }
      ]
    },
    {
      id: 'c-002', name: 'SafeGuard Electrical', regNum: 'ABN 67 234 567 890',
      buId: 'bu-1', projects: ['proj-2'],
      scopeOfWork: ['Electrical Installation', 'HV Systems', 'Testing & Commissioning'],
      contact: 'Rachel Kim', email: 'r.kim@safeguard-elec.com.au', phone: '+61 2 8765 4321',
      status: 'Approved', riskLevel: 'High', riskScore: 71,
      compliancePercent: 72, workerCount: 23, activeWorkers: 20,
      incidents: 6, openActions: 5, overdueActions: 2,
      incidents90d: 3, closureSpeed: 18, ifrTrend: 'up',
      ifr: 1.4, auditFindings: 8, predictiveRisk: 'Deteriorating',
      aiSummary: 'Contractor showing 32% increase in minor incidents vs last quarter. Corrective action closure rate is below benchmark. Escalation monitoring recommended.',
      trendData: { incidents: [4, 5, 4, 6, 7, 6, 6], compliance: [80, 78, 75, 74, 72, 71, 72], actions: [3, 4, 5, 5, 6, 5, 5] },
      approvedDate: '2025-07-01', reviewDue: '2026-01-01',
      documents: [
        { id: 'd-6', name: 'HSW Policy', status: 'Approved', expiry: '2026-07-01', version: 'v2.0', uploadDate: '2025-06-28' },
        { id: 'd-7', name: 'Risk Assessment Plan', status: 'Expiring', expiry: '2026-03-01', version: 'v1.5', uploadDate: '2025-06-28' },
        { id: 'd-8', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-07-01', version: 'v1.0', uploadDate: '2025-06-28' },
        { id: 'd-9', name: 'Electrical Contractor License', status: 'Approved', expiry: '2027-06-30', version: 'v1.0', uploadDate: '2025-06-28' }
      ],
      approvalHistory: [
        { date: '2025-07-01', action: 'Approved', user: 'Marcus Chen', comment: 'Enhanced approval due to high risk profile. Additional monitoring required.' },
        { date: '2025-06-28', action: 'Under Review', user: 'Marcus Chen', comment: 'High risk contractor — escalated to BU HSE for review.' },
        { date: '2025-06-25', action: 'Submitted', user: 'Rachel Kim', comment: 'Submission for Harbour Bridge project.' }
      ]
    },
    {
      id: 'c-003', name: 'TerraForm Landscaping', regNum: 'ABN 89 345 678 901',
      buId: 'bu-3', projects: ['proj-6', 'proj-7'],
      scopeOfWork: ['Landscaping', 'Irrigation', 'Soft Landscaping'],
      contact: 'Ben Nguyen', email: 'b.nguyen@terraform.com.au', phone: '+61 3 9876 1234',
      status: 'Approved', riskLevel: 'Low', riskScore: 18,
      compliancePercent: 97, workerCount: 12, activeWorkers: 12,
      incidents: 0, openActions: 0, overdueActions: 0,
      incidents90d: 0, closureSpeed: 3, ifrTrend: 'stable',
      ifr: 0.0, auditFindings: 1, predictiveRisk: 'High Performing',
      aiSummary: 'Exemplary HSE performance. Zero incidents in 12 months. Compliance consistently above 95%. Recommended as benchmark reference.',
      trendData: { incidents: [0, 0, 0, 0, 0, 0, 0], compliance: [95, 96, 96, 97, 97, 97, 97], actions: [1, 1, 0, 1, 0, 0, 0] },
      approvedDate: '2025-09-01', reviewDue: '2026-09-01',
      documents: [
        { id: 'd-10', name: 'HSW Policy', status: 'Approved', expiry: '2026-09-01', version: 'v1.0', uploadDate: '2025-08-28' },
        { id: 'd-11', name: 'Risk Assessment Plan', status: 'Approved', expiry: '2026-09-01', version: 'v1.0', uploadDate: '2025-08-28' },
        { id: 'd-12', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-09-01', version: 'v1.0', uploadDate: '2025-08-28' }
      ],
      approvalHistory: [
        { date: '2025-09-01', action: 'Approved', user: 'Sarah Okafor', comment: 'Clean record. Low risk profile.' },
        { date: '2025-08-30', action: 'Submitted', user: 'Ben Nguyen', comment: 'Submission for CBD Tower project.' }
      ]
    },
    {
      id: 'c-004', name: 'Pinnacle Scaffolding', regNum: 'ABN 12 456 789 012',
      buId: 'bu-1', projects: ['proj-1', 'proj-2', 'proj-3'],
      scopeOfWork: ['Scaffolding', 'Formwork', 'Temporary Works'],
      contact: 'Craig Thompson', email: 'c.thompson@pinnacle-scaf.com.au', phone: '+61 2 9234 5678',
      status: 'Under Review', riskLevel: 'High', riskScore: 68,
      compliancePercent: 61, workerCount: 89, activeWorkers: 75,
      incidents: 8, openActions: 11, overdueActions: 4,
      incidents90d: 4, closureSpeed: 22, ifrTrend: 'up',
      ifr: 1.3, auditFindings: 12, predictiveRisk: 'Deteriorating',
      aiSummary: '4 overdue corrective actions and expired scaffolding licence detected. Workforce compliance dropped 8% in 60 days. Enterprise review recommended.',
      trendData: { incidents: [5, 6, 7, 8, 8, 8, 8], compliance: [70, 68, 65, 63, 62, 61, 61], actions: [7, 8, 9, 10, 11, 11, 11] },
      approvedDate: null, reviewDue: null,
      documents: [
        { id: 'd-13', name: 'HSW Policy', status: 'Under Review', expiry: '2026-05-01', version: 'v2.3', uploadDate: '2026-01-10' },
        { id: 'd-14', name: 'Risk Assessment Plan', status: 'Under Review', expiry: '2026-05-01', version: 'v1.8', uploadDate: '2026-01-10' },
        { id: 'd-15', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-06-30', version: 'v1.0', uploadDate: '2026-01-10' },
        { id: 'd-16', name: 'Scaffolding License', status: 'Non-Compliant', expiry: '2025-12-31', version: 'v1.0', uploadDate: '2025-06-01' }
      ],
      approvalHistory: [
        { date: '2026-01-10', action: 'Under Review', user: 'Marcus Chen', comment: 'Escalated due to high risk score and expired scaffolding license.' },
        { date: '2026-01-08', action: 'Submitted', user: 'Craig Thompson', comment: 'Annual renewal submission.' }
      ]
    },
    {
      id: 'c-005', name: 'BlueWave Plumbing', regNum: 'ABN 34 567 890 123',
      buId: 'bu-3', projects: ['proj-6'],
      scopeOfWork: ['Plumbing', 'Fire Suppression', 'HVAC'],
      contact: 'Anita Sharma', email: 'a.sharma@bluewave.com.au', phone: '+61 3 8765 9012',
      status: 'Draft', riskLevel: 'Low', riskScore: 22,
      compliancePercent: 0, workerCount: 0, activeWorkers: 0,
      incidents: 0, openActions: 0, overdueActions: 0,
      ifr: 0, auditFindings: 0,
      approvedDate: null, reviewDue: null,
      documents: [],
      approvalHistory: [{ date: '2026-02-10', action: 'Draft Created', user: 'Anita Sharma', comment: 'Registration initiated.' }]
    },
    {
      id: 'c-006', name: 'Ironclad Demolition', regNum: 'ABN 56 678 901 234',
      buId: 'bu-2', projects: ['proj-4'],
      scopeOfWork: ['Demolition', 'Hazardous Materials', 'Asbestos Removal'],
      contact: 'Gary Blackwood', email: 'g.blackwood@ironclad.com.au', phone: '+61 2 9345 6789',
      status: 'Approved', riskLevel: 'Critical', riskScore: 88,
      compliancePercent: 55, workerCount: 34, activeWorkers: 28,
      incidents: 12, openActions: 18, overdueActions: 7,
      incidents90d: 5, closureSpeed: 31, ifrTrend: 'up',
      ifr: 1.9, auditFindings: 22, predictiveRisk: 'High Risk / Poor Control',
      aiSummary: 'Critical risk profile. 38% of corrective actions overdue. Asbestos management plan expiring in 20 days. Immediate enterprise intervention required.',
      trendData: { incidents: [8, 9, 10, 11, 12, 12, 12], compliance: [62, 60, 58, 56, 55, 55, 55], actions: [12, 14, 15, 17, 18, 18, 18] },
      approvedDate: '2025-05-01', reviewDue: '2025-11-01',
      documents: [
        { id: 'd-17', name: 'HSW Policy', status: 'Approved', expiry: '2026-05-01', version: 'v4.1', uploadDate: '2025-04-28' },
        { id: 'd-18', name: 'Asbestos Management Plan', status: 'Expiring', expiry: '2026-03-10', version: 'v2.0', uploadDate: '2025-04-28' },
        { id: 'd-19', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-05-01', version: 'v1.0', uploadDate: '2025-04-28' },
        { id: 'd-20', name: 'Demolition License', status: 'Approved', expiry: '2027-05-01', version: 'v1.0', uploadDate: '2025-04-28' }
      ],
      approvalHistory: [
        { date: '2025-05-01', action: 'Approved', user: 'Marcus Chen', comment: 'Enhanced approval. Mandatory monthly audits required. Critical risk profile.' },
        { date: '2025-04-25', action: 'Under Review', user: 'Prakash Senghani', comment: 'Critical risk — Enterprise HSE review required.' },
        { date: '2025-04-20', action: 'Submitted', user: 'Gary Blackwood', comment: 'Submission for Offshore Platform project.' }
      ]
    },
    {
      id: 'c-007', name: 'GreenBuild Sustainability', regNum: 'ABN 78 789 012 345',
      buId: 'bu-2', projects: ['proj-5'],
      scopeOfWork: ['Solar Installation', 'Electrical', 'Civil Works'],
      contact: 'Priya Mehta', email: 'p.mehta@greenbuild.com.au', phone: '+61 8 9234 5678',
      status: 'Approved', riskLevel: 'Low', riskScore: 24,
      compliancePercent: 94, workerCount: 28, activeWorkers: 28,
      incidents: 1, openActions: 1, overdueActions: 0,
      incidents90d: 0, closureSpeed: 4, ifrTrend: 'stable',
      ifr: 0.2, auditFindings: 2, predictiveRisk: 'Improving',
      aiSummary: 'Strong compliance trajectory. Closure speed well above benchmark. Incident rate trending toward zero. Recommended for preferred supplier list.',
      trendData: { incidents: [2, 1, 1, 1, 1, 1, 1], compliance: [90, 91, 92, 93, 94, 94, 94], actions: [2, 2, 1, 1, 1, 1, 1] },
      approvedDate: '2025-10-01', reviewDue: '2026-10-01',
      documents: [
        { id: 'd-21', name: 'HSW Policy', status: 'Approved', expiry: '2026-10-01', version: 'v2.0', uploadDate: '2025-09-28' },
        { id: 'd-22', name: 'Risk Assessment Plan', status: 'Approved', expiry: '2026-10-01', version: 'v1.2', uploadDate: '2025-09-28' },
        { id: 'd-23', name: 'Public Liability Insurance', status: 'Approved', expiry: '2026-10-01', version: 'v1.0', uploadDate: '2025-09-28' }
      ],
      approvalHistory: [
        { date: '2025-10-01', action: 'Approved', user: 'Sarah Okafor', comment: 'Excellent HSW record. Approved.' },
        { date: '2025-09-29', action: 'Submitted', user: 'Priya Mehta', comment: 'Submission for Solar Farm project.' }
      ]
    },
    {
      id: 'c-008', name: 'Fortis Cranes & Rigging', regNum: 'ABN 90 890 123 456',
      buId: 'bu-1', projects: ['proj-1'],
      scopeOfWork: ['Crane Operations', 'Rigging', 'Heavy Lift'],
      contact: 'Steve Kowalski', email: 's.kowalski@fortiscranes.com.au', phone: '+61 2 9456 7890',
      status: 'Suspended', riskLevel: 'Critical', riskScore: 91,
      compliancePercent: 30, workerCount: 15, activeWorkers: 0,
      incidents: 15, openActions: 23, overdueActions: 14,
      incidents90d: 7, closureSpeed: 45, ifrTrend: 'up',
      ifr: 2.4, auditFindings: 31, predictiveRisk: 'High Risk / Poor Control',
      aiSummary: 'Suspended following fatal incident. 61% corrective actions overdue. All licences non-compliant. Enterprise intervention logged. No reinstatement pathway until investigation closes.',
      trendData: { incidents: [9, 11, 12, 14, 15, 15, 15], compliance: [55, 48, 42, 38, 32, 30, 30], actions: [15, 18, 20, 22, 23, 23, 23] },
      approvedDate: null, reviewDue: null,
      documents: [
        { id: 'd-24', name: 'HSW Policy', status: 'Non-Compliant', expiry: '2025-06-30', version: 'v1.0', uploadDate: '2024-07-01' },
        { id: 'd-25', name: 'Crane Operator License', status: 'Non-Compliant', expiry: '2025-09-30', version: 'v1.0', uploadDate: '2024-10-01' }
      ],
      approvalHistory: [
        { date: '2026-01-05', action: 'Suspended', user: 'Prakash Senghani', comment: 'Suspended following fatal incident investigation. All works halted.' },
        { date: '2025-12-20', action: 'Approved', user: 'Marcus Chen', comment: 'Previously approved.' }
      ]
    }
  ],

  workers: [
    { id: 'w-001', contractorId: 'c-001', name: 'Michael Torres', idNum: 'EMP-2341', role: 'Site Engineer', project: 'proj-1', certifications: ['First Aid', 'White Card', 'Confined Space'], expiryDate: '2026-12-31', complianceStatus: 'Compliant' },
    { id: 'w-002', contractorId: 'c-001', name: 'Fiona Campbell', idNum: 'EMP-2342', role: 'Safety Officer', project: 'proj-1', certifications: ['First Aid', 'White Card', 'HSE Officer'], expiryDate: '2026-09-30', complianceStatus: 'Compliant' },
    { id: 'w-003', contractorId: 'c-001', name: 'Ahmed Hassan', idNum: 'EMP-2343', role: 'Plant Operator', project: 'proj-3', certifications: ['White Card', 'Excavator License'], expiryDate: '2026-03-10', complianceStatus: 'Expiring' },
    { id: 'w-004', contractorId: 'c-001', name: 'Lucy Zhang', idNum: 'EMP-2344', role: 'Labourer', project: 'proj-1', certifications: ['White Card'], expiryDate: '2026-01-15', complianceStatus: 'Non-Compliant' },
    { id: 'w-005', contractorId: 'c-002', name: 'Paul Dempsey', idNum: 'EMP-3101', role: 'Electrician', project: 'proj-2', certifications: ['Electrical License', 'White Card', 'HV Switching'], expiryDate: '2026-08-31', complianceStatus: 'Compliant' },
    { id: 'w-006', contractorId: 'c-002', name: 'Nina Petrov', idNum: 'EMP-3102', role: 'Electrical Supervisor', project: 'proj-2', certifications: ['Electrical License', 'White Card', 'HV Switching', 'First Aid'], expiryDate: '2026-02-28', complianceStatus: 'Expiring' },
    { id: 'w-007', contractorId: 'c-004', name: 'Raj Patel', idNum: 'EMP-4201', role: 'Scaffolder', project: 'proj-1', certifications: ['Scaffolding License', 'White Card'], expiryDate: '2025-12-01', complianceStatus: 'Non-Compliant' },
    { id: 'w-008', contractorId: 'c-004', name: 'Donna Walsh', idNum: 'EMP-4202', role: 'Scaffolding Supervisor', project: 'proj-2', certifications: ['Scaffolding License', 'White Card', 'First Aid'], expiryDate: '2026-07-31', complianceStatus: 'Compliant' },
    { id: 'w-009', contractorId: 'c-006', name: 'Kevin Marsh', idNum: 'EMP-5301', role: 'Demolition Operator', project: 'proj-4', certifications: ['Demolition License', 'Asbestos Removal', 'White Card'], expiryDate: '2026-05-31', complianceStatus: 'Compliant' },
    { id: 'w-010', contractorId: 'c-006', name: 'Sandra Lee', idNum: 'EMP-5302', role: 'Asbestos Supervisor', project: 'proj-4', certifications: ['Asbestos Supervisor', 'White Card', 'First Aid'], expiryDate: '2026-02-20', complianceStatus: 'Expiring' },
    { id: 'w-011', contractorId: 'c-007', name: 'Chris Nguyen', idNum: 'EMP-6101', role: 'Solar Installer', project: 'proj-5', certifications: ['Electrical License', 'White Card', 'Working at Heights'], expiryDate: '2026-10-31', complianceStatus: 'Compliant' },
    { id: 'w-012', contractorId: 'c-003', name: 'Maria Santos', idNum: 'EMP-7201', role: 'Landscaper', project: 'proj-6', certifications: ['White Card', 'Chemical Handling'], expiryDate: '2026-11-30', complianceStatus: 'Compliant' }
  ],

  incidents: [
    { id: 'inc-001', contractorId: 'c-002', date: '2025-11-15', type: 'Near Miss', severity: 'High', description: 'Electrical arc flash near miss during HV switching', status: 'Closed', project: 'proj-2' },
    { id: 'inc-002', contractorId: 'c-004', date: '2025-12-03', type: 'LTI', severity: 'Serious', description: 'Worker fall from scaffolding — 2m drop', status: 'Open', project: 'proj-1' },
    { id: 'inc-003', contractorId: 'c-006', date: '2025-10-22', type: 'MTI', severity: 'Medium', description: 'Asbestos exposure during demolition works', status: 'Closed', project: 'proj-4' },
    { id: 'inc-004', contractorId: 'c-008', date: '2025-12-18', type: 'Fatality', severity: 'Critical', description: 'Crane load drop — fatal incident', status: 'Under Investigation', project: 'proj-1' },
    { id: 'inc-005', contractorId: 'c-001', date: '2025-09-10', type: 'First Aid', severity: 'Low', description: 'Minor laceration during formwork installation', status: 'Closed', project: 'proj-3' }
  ],

  correctiveActions: [
    { id: 'ca-001', contractorId: 'c-002', incidentId: 'inc-001', description: 'Update HV switching procedure', dueDate: '2026-01-31', status: 'Open', priority: 'High', assignee: 'Rachel Kim' },
    { id: 'ca-002', contractorId: 'c-004', incidentId: 'inc-002', description: 'Conduct scaffolding safety audit', dueDate: '2026-01-15', status: 'Overdue', priority: 'Critical', assignee: 'Craig Thompson' },
    { id: 'ca-003', contractorId: 'c-004', description: 'Implement fall arrest system on all platforms', dueDate: '2026-02-28', status: 'Open', priority: 'High', assignee: 'Craig Thompson' },
    { id: 'ca-004', contractorId: 'c-006', incidentId: 'inc-003', description: 'Review asbestos management plan', dueDate: '2025-12-31', status: 'Overdue', priority: 'Critical', assignee: 'Gary Blackwood' },
    { id: 'ca-005', contractorId: 'c-006', description: 'Mandatory toolbox talks — weekly', dueDate: '2026-03-01', status: 'Open', priority: 'Medium', assignee: 'Gary Blackwood' }
  ],

  performanceTrend: {
    monthly: {
      labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      incidents: [2, 3, 4, 6, 8, 5, 3],
      compliance: [82, 84, 79, 75, 71, 74, 77],
      actions: [5, 7, 9, 14, 18, 16, 12]
    },
    weekly: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      incidents: [1, 0, 2, 1, 3, 1, 0],
      compliance: [76, 77, 75, 78, 74, 77, 79],
      actions: [14, 13, 15, 14, 16, 13, 12]
    }
  },

  enterpriseKPIs: {
    totalContractors: 24, totalContractorsTrend: +3, totalContractorsPct: +14,
    activeContractors: 19, activeContractorsTrend: +2, activeContractorsPct: +12,
    ifr: 1.8, ifrTrend: 'up', ifrPct: +8,
    highRisk: 6, highRiskTrend: +2, highRiskPct: +50,
    overdueActionsPct: 34, overdueActionsTrend: 'up', overdueActionsPctChange: +11,
    workforceCompliance: 92, workforceComplianceTrend: 'up', workforceCompliancePct: '+3',
    openAudits: 14, openAuditsTrend: +3, openAuditsPct: +27,
    riskExposureScore: 68, riskExposureTrend: 'up', riskExposurePct: +9,
    fullyCompliant: 14, criticalRisk: 2,
    totalWorkers: 312, compliantWorkers: 241,
    openActions: 67, overdueActions: 23,
    totalIncidents: 45, avgCompliancePct: 77
  },

  projectBenchmarks: [
    { id: 'proj-1', name: 'M7 Motorway', ifr: 1.3, compliance: 74, contractors: 5, incidents: 9 },
    { id: 'proj-2', name: 'Harbour Bridge', ifr: 1.4, compliance: 69, contractors: 3, incidents: 7 },
    { id: 'proj-3', name: 'Western Rail', ifr: 0.6, compliance: 82, contractors: 4, incidents: 4 },
    { id: 'proj-4', name: 'Offshore Alpha', ifr: 1.9, compliance: 55, contractors: 2, incidents: 14 },
    { id: 'proj-5', name: 'Solar Narrabri', ifr: 0.2, compliance: 94, contractors: 2, incidents: 1 },
    { id: 'proj-6', name: 'CBD Tower', ifr: 0.7, compliance: 91, contractors: 4, incidents: 2 },
    { id: 'proj-7', name: 'Westfield', ifr: 0.3, compliance: 95, contractors: 3, incidents: 1 },
    { id: 'proj-8', name: 'Airport T3', ifr: 0.9, compliance: 80, contractors: 3, incidents: 5 }
  ],

  buBenchmarks: [
    { id: 'bu-1', name: 'Infrastructure', ifr: 1.2, compliance: 72, contractors: 8, incidents: 20 },
    { id: 'bu-2', name: 'Energy & Resources', ifr: 1.5, compliance: 66, contractors: 7, incidents: 16 },
    { id: 'bu-3', name: 'Civil Construction', ifr: 0.4, compliance: 92, contractors: 9, incidents: 4 }
  ],

  escalationLog: [
    { id: 'esc-001', contractorId: 'c-008', contractor: 'Fortis Cranes & Rigging', date: '2026-01-05', trigger: 'Fatal incident + 14 overdue actions', status: 'Reviewed', reviewedBy: 'Prakash Senghani', reviewDate: '2026-01-06', notes: 'Suspended pending investigation. Legal team engaged. No works to proceed.' },
    { id: 'esc-002', contractorId: 'c-006', contractor: 'Ironclad Demolition', date: '2026-02-10', trigger: '7 overdue actions, IFR 1.9, compliance < 60%', status: 'Open', reviewedBy: null, reviewDate: null, notes: null },
    { id: 'esc-003', contractorId: 'c-004', contractor: 'Pinnacle Scaffolding', date: '2026-02-12', trigger: '4 overdue actions, expired scaffolding licence, compliance 61%', status: 'Open', reviewedBy: null, reviewDate: null, notes: null }
  ],

  complianceAlerts: [
    { id: 'al-001', type: 'critical', category: 'Document Expiry', title: 'Insurance Certificate Expired', contractor: 'Fortis Cranes & Rigging', detail: 'Public Liability Insurance expired 2025-06-30', date: '2026-02-15', contractorId: 'c-008' },
    { id: 'al-002', type: 'critical', category: 'Worker Certification', title: 'Worker Non-Compliant', contractor: 'Apex Civil Engineering', detail: 'Lucy Zhang — White Card expired 2026-01-15', date: '2026-02-16', contractorId: 'c-001' },
    { id: 'al-003', type: 'warning', category: 'Document Expiry', title: 'Document Expiring in 20 days', contractor: 'Ironclad Demolition', detail: 'Asbestos Management Plan expires 2026-03-10', date: '2026-02-18', contractorId: 'c-006' },
    { id: 'al-004', type: 'warning', category: 'Worker Certification', title: 'Certification Expiring in 10 days', contractor: 'SafeGuard Electrical', detail: 'Nina Petrov — Electrical License expires 2026-02-28', date: '2026-02-18', contractorId: 'c-002' },
    { id: 'al-005', type: 'critical', category: 'Overdue Actions', title: 'Corrective Actions Overdue', contractor: 'Pinnacle Scaffolding', detail: '4 corrective actions overdue — escalation recommended', date: '2026-02-17', contractorId: 'c-004' }
  ]
};

// Helper: get contractor by id
function getContractor(id) { return DB.contractors.find(c => c.id === id); }
function getWorkersByContractor(cId) { return DB.workers.filter(w => w.contractorId === cId); }
function getIncidentsByContractor(cId) { return DB.incidents.filter(i => i.contractorId === cId); }
function getActionsByContractor(cId) { return DB.correctiveActions.filter(a => a.contractorId === cId); }
function getProject(id) { return DB.projects.find(p => p.id === id); }
function getBU(id) { return DB.businessUnits.find(b => b.id === id); }
