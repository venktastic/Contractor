/* ============================================
   SAFEWORK PTW - DATA & STATE MANAGEMENT
   Mock Data & LocalStorage Simulation
   ============================================ */

const APP_STATE = {
  user: {
    id: 'user_001',
    name: 'Prakash Senghani',
    role: 'REQUESTER', // Options: REQUESTER, APPROVER, WATCHER, ADMIN
    avatar: 'PS'
  },
  currentPermit: null,
  wizard: {
    currentStep: 1,
    totalSteps: 7, // Updated to 7 steps
    data: {
      // Camera First Data
      capturedImage: null,
      imageTimestamp: null,

      // AI Analysis Data
      aiAnalysis: {
        detectedType: null,
        confidence: 0,
        detectedRisks: [],
        suggestedControls: []
      },

      // Standard Data
      description: '',
      location: '',
      zone: '',
      permitType: null, // Confirmed type
      startTime: '',
      endTime: '',
      rams: null,
      competentPerson: null, // Watcher
      simopsConflicts: []
    }
  },
  notifications: [
    { id: 1, text: "Permit PTW-2026-0142 approved", time: "2 mins ago", read: false },
    { id: 2, text: "SIMOPS Alert in Zone C", time: "1 hour ago", read: false },
    { id: 3, text: "Watcher check-in overdue", time: "3 hours ago", read: true }
  ],
  pageHistory: [] // Track navigation history
};

// Mock AI Analysis Data
const MOCK_AI_DATA = {
  default: {
    type: 'General Work',
    confidence: 85,
    risks: ['Slips/Trips', 'Manual Handling'],
    controls: ['Housekeeping', 'Gloves']
  },
  welding: {
    type: 'Hot Work',
    confidence: 94,
    risks: ['Fire Hazard', 'Fumes', 'UV Radiation'],
    controls: ['Fire Extinguisher', 'Welding Screen', 'Ventilation']
  },
  height: {
    type: 'Work at Height',
    confidence: 91,
    risks: ['Fall from Height', 'Falling Objects'],
    controls: ['Harness', 'Barriers', 'Tool Tethers']
  },
  confined: {
    type: 'Confined Space',
    confidence: 88,
    risks: ['Gas Accumulation', 'Low Oxygen', 'Entrapment'],
    controls: ['Gas Monitor', 'Tripod/Winch', 'Standby Man']
  }
};

// Updated Users with Roles
const USERS = [
  { id: 'user_001', name: 'Prakash Senghani', role: 'REQUESTER', avatar: 'PS' },
  { id: 'user_002', name: 'Mike Thompson', role: 'APPROVER', avatar: 'MT' },
  { id: 'user_003', name: 'Sarah Connor', role: 'WATCHER', avatar: 'SC' }
];

const PTW_DATA = {
  // Current user
  currentUser: {
    id: 'USR001',
    name: 'Prakash Senghani',
    initials: 'PS',
    role: 'HSE Manager',
    permissions: ['create', 'approve', 'reject', 'override', 'admin']
  },

  // Permit Types
  permitTypes: [
    {
      id: 'HOT_WORK',
      name: 'Hot Work',
      icon: '🔥',
      color: '#E63946',
      riskLevel: 'HIGH',
      description: 'Welding, cutting, grinding operations',
      checklist: [
        'Fire extinguisher present and accessible',
        'Hot work area cleared of flammable materials (10m radius)',
        'Fire watch assigned and briefed',
        'Spark containment measures in place',
        'Adjacent areas notified',
        'Emergency stop procedures confirmed',
        'PPE: Face shield, heat-resistant gloves, fire-retardant clothing',
        'Gas detection equipment calibrated and operational'
      ]
    },
    {
      id: 'CONFINED_SPACE',
      name: 'Confined Space',
      icon: '🚧',
      color: '#FF6B35',
      riskLevel: 'CRITICAL',
      description: 'Entry into confined or enclosed spaces',
      checklist: [
        'Atmospheric testing completed (O2, LEL, H2S, CO)',
        'Ventilation system operational',
        'Rescue team on standby',
        'Entry/exit log established',
        'Communication system tested',
        'Lockout/Tagout (LOTO) applied',
        'PPE: SCBA, harness, lifeline',
        'Buddy system confirmed',
        'Emergency extraction plan reviewed'
      ]
    },
    {
      id: 'ELECTRICAL',
      name: 'Electrical Work',
      icon: '⚡',
      color: '#F4A261',
      riskLevel: 'HIGH',
      description: 'Live electrical work and isolation',
      checklist: [
        'Isolation and LOTO procedure completed',
        'Voltage testing confirmed dead',
        'Insulated tools and PPE verified',
        'Arc flash assessment completed',
        'Qualified electrician assigned',
        'Emergency shutdown procedure posted',
        'PPE: Insulated gloves (rated), arc flash suit',
        'No unauthorized personnel in exclusion zone'
      ]
    },
    {
      id: 'WORKING_AT_HEIGHT',
      name: 'Work at Height',
      icon: '🏗️',
      color: '#7B2FBE',
      riskLevel: 'HIGH',
      description: 'Work above 1.8m from ground level',
      checklist: [
        'Fall arrest system inspected and certified',
        'Scaffold inspection completed (tag visible)',
        'Exclusion zone established below work area',
        'Weather conditions assessed (wind speed < 15m/s)',
        'Rescue plan for fallen worker in place',
        'PPE: Full body harness, hard hat, safety boots',
        'Tool tethering system in use',
        'Ladder secured and at correct angle'
      ]
    },
    {
      id: 'EXCAVATION',
      name: 'Excavation',
      icon: '⛏️',
      color: '#2DC653',
      riskLevel: 'MEDIUM',
      description: 'Ground breaking and excavation works',
      checklist: [
        'Underground services survey completed',
        'Shoring/battering plan approved',
        'Spoil heap positioned safely (min 1m from edge)',
        'Access/egress ladders in place',
        'Dewatering plan if required',
        'Adjacent structures assessed',
        'PPE: Hard hat, high-vis vest, safety boots',
        'Daily inspection log started'
      ]
    },
    {
      id: 'CHEMICAL',
      name: 'Chemical Handling',
      icon: '☣️',
      color: '#0077B6',
      riskLevel: 'CRITICAL',
      description: 'Hazardous chemical operations',
      checklist: [
        'COSHH assessment reviewed and signed',
        'SDS sheets available at work location',
        'Spill containment measures in place',
        'Emergency shower/eyewash accessible',
        'Waste disposal plan confirmed',
        'Chemical storage segregation verified',
        'PPE: Chemical-resistant suit, gloves, goggles, respirator',
        'Decontamination procedure established'
      ]
    }
  ],

  // Zones
  zones: [
    'Zone A - North Block', 'Zone B - South Block', 'Zone C - East Wing',
    'Zone D - West Wing', 'Zone E - Basement', 'Zone F - Roof Level',
    'Zone G - Plant Room', 'Zone H - Loading Bay', 'Zone I - Substation',
    'Zone J - Perimeter', 'Zone K - Central Core', 'Zone L - Parking'
  ],

  // Contractors
  contractors: [
    'Apex Construction Ltd', 'BuildSafe Engineering', 'ProTech Contractors',
    'SafeGuard Works', 'Meridian Industrial', 'Vertex Engineering',
    'CoreBuild Solutions', 'TechSafe Services'
  ],

  // Supervisors
  supervisors: [
    { id: 'SUP001', name: 'Mike Thompson', cert: 'CSCS Gold' },
    { id: 'SUP002', name: 'Sarah Chen', cert: 'CSCS Black' },
    { id: 'SUP003', name: 'David Okafor', cert: 'CSCS Gold' },
    { id: 'SUP004', name: 'Emma Walsh', cert: 'CSCS Platinum' },
    { id: 'SUP005', name: 'James Patel', cert: 'CSCS Gold' }
  ],

  // Sample Permits
  permits: [
    {
      id: 'PTW-2026-0142',
      type: 'HOT_WORK',
      typeName: 'Hot Work',
      typeIcon: '🔥',
      title: 'Welding - Structural Steel Frame',
      status: 'ACTIVE',
      riskLevel: 'HIGH',
      location: 'Block C - Level 4',
      zone: 'Zone C - East Wing',
      contractor: 'Apex Construction Ltd',
      supervisor: 'Mike Thompson',
      competentPerson: 'user_003', // Sarah Connor (Watcher)
      team: 'Welding Team Alpha (4 persons)',
      startDate: '2026-02-18',
      startTime: '08:00',
      endDate: '2026-02-18',
      endTime: '17:00',
      description: 'Structural welding of steel frame connections at Level 4, Block C. Hot work permit required for MIG welding operations.',
      rams: {
        status: 'VALIDATED',
        files: [
          { name: 'RAMS_HotWork_BlockC_v2.pdf', size: '2.4 MB', type: 'pdf', version: 2, date: '2026-02-17', validated: true, validatedBy: 'Prakash Senghani' }
        ]
      },
      checklist: [true, true, true, true, true, false, true, true],
      simopsConflicts: [],
      approvedBy: 'Prakash Senghani',
      approvedAt: '2026-02-18T07:45:00',
      createdAt: '2026-02-17T14:30:00',
      createdBy: 'Mike Thompson',
      auditLog: [
        { action: 'Permit Created', user: 'Mike Thompson', time: '2026-02-17T14:30:00', type: 'create' },
        { action: 'RAMS Uploaded', user: 'Mike Thompson', time: '2026-02-17T15:00:00', type: 'upload', detail: 'RAMS_HotWork_BlockC_v2.pdf' },
        { action: 'Submitted for Review', user: 'Mike Thompson', time: '2026-02-17T15:15:00', type: 'submit' },
        { action: 'RAMS Validated', user: 'Prakash Senghani', time: '2026-02-17T16:00:00', type: 'validate' },
        { action: 'Permit Approved', user: 'Prakash Senghani', time: '2026-02-18T07:45:00', type: 'approve' },
        { action: 'Permit Activated', user: 'System', time: '2026-02-18T08:00:00', type: 'activate' }
      ]
    },
    {
      id: 'PTW-2026-0141',
      type: 'CONFINED_SPACE',
      typeName: 'Confined Space',
      typeIcon: '🚧',
      title: 'Inspection - Underground Drainage',
      status: 'UNDER_REVIEW',
      riskLevel: 'CRITICAL',
      location: 'Zone E - Basement',
      zone: 'Zone E - Basement',
      contractor: 'SafeGuard Works',
      supervisor: 'Sarah Chen',
      team: 'Inspection Team B (3 persons)',
      startDate: '2026-02-19',
      startTime: '09:00',
      endDate: '2026-02-19',
      endTime: '14:00',
      description: 'CCTV inspection of underground drainage system in basement level. Confined space entry required.',
      rams: {
        status: 'PENDING',
        files: [
          { name: 'RAMS_ConfinedSpace_v1.pdf', size: '1.8 MB', type: 'pdf', version: 1, date: '2026-02-18', validated: false }
        ]
      },
      checklist: [true, true, true, false, true, true, true, false, false],
      simopsConflicts: ['PTW-2026-0143'],
      approvedBy: null,
      createdAt: '2026-02-18T09:00:00',
      createdBy: 'Sarah Chen',
      auditLog: [
        { action: 'Permit Created', user: 'Sarah Chen', time: '2026-02-18T09:00:00', type: 'create' },
        { action: 'RAMS Uploaded', user: 'Sarah Chen', time: '2026-02-18T09:30:00', type: 'upload', detail: 'RAMS_ConfinedSpace_v1.pdf' },
        { action: 'Submitted for Review', user: 'Sarah Chen', time: '2026-02-18T09:45:00', type: 'submit' },
        { action: 'SIMOPS Conflict Detected', user: 'System', time: '2026-02-18T09:46:00', type: 'conflict', detail: 'Conflict with PTW-2026-0143 in Zone E' }
      ]
    },
    {
      id: 'PTW-2026-0143',
      type: 'ELECTRICAL',
      typeName: 'Electrical Work',
      typeIcon: '⚡',
      title: 'Substation Maintenance - Panel B',
      status: 'APPROVED',
      riskLevel: 'HIGH',
      location: 'Zone E - Basement Substation',
      zone: 'Zone E - Basement',
      contractor: 'ProTech Contractors',
      supervisor: 'David Okafor',
      team: 'Electrical Team (2 persons)',
      startDate: '2026-02-19',
      startTime: '08:00',
      endDate: '2026-02-19',
      endTime: '16:00',
      description: 'Planned maintenance of Panel B in basement substation. Isolation and LOTO required.',
      rams: {
        status: 'VALIDATED',
        files: [
          { name: 'RAMS_Electrical_SubB_v3.pdf', size: '3.1 MB', type: 'pdf', version: 3, date: '2026-02-17', validated: true, validatedBy: 'Prakash Senghani' }
        ]
      },
      checklist: [true, true, true, true, true, true, true, true],
      simopsConflicts: ['PTW-2026-0141'],
      approvedBy: 'Prakash Senghani',
      approvedAt: '2026-02-18T08:30:00',
      createdAt: '2026-02-17T10:00:00',
      createdBy: 'David Okafor',
      auditLog: [
        { action: 'Permit Created', user: 'David Okafor', time: '2026-02-17T10:00:00', type: 'create' },
        { action: 'RAMS Uploaded (v3)', user: 'David Okafor', time: '2026-02-17T10:30:00', type: 'upload' },
        { action: 'Submitted for Review', user: 'David Okafor', time: '2026-02-17T11:00:00', type: 'submit' },
        { action: 'RAMS Validated', user: 'Prakash Senghani', time: '2026-02-17T14:00:00', type: 'validate' },
        { action: 'Permit Approved', user: 'Prakash Senghani', time: '2026-02-18T08:30:00', type: 'approve' }
      ]
    },
    {
      id: 'PTW-2026-0140',
      type: 'WORKING_AT_HEIGHT',
      typeName: 'Work at Height',
      typeIcon: '🏗️',
      title: 'Facade Inspection - North Elevation',
      status: 'EXPIRED',
      riskLevel: 'HIGH',
      location: 'Zone A - North Block',
      zone: 'Zone A - North Block',
      contractor: 'BuildSafe Engineering',
      supervisor: 'Emma Walsh',
      team: 'Inspection Team A (2 persons)',
      startDate: '2026-02-17',
      startTime: '07:00',
      endDate: '2026-02-17',
      endTime: '15:00',
      description: 'Visual inspection of north elevation facade using rope access techniques.',
      rams: {
        status: 'VALIDATED',
        files: [
          { name: 'RAMS_HeightWork_NorthFacade.pdf', size: '1.5 MB', type: 'pdf', version: 1, date: '2026-02-16', validated: true, validatedBy: 'Prakash Senghani' }
        ]
      },
      checklist: [true, true, true, true, true, true, true, true],
      simopsConflicts: [],
      approvedBy: 'Prakash Senghani',
      approvedAt: '2026-02-17T06:45:00',
      createdAt: '2026-02-16T14:00:00',
      createdBy: 'Emma Walsh',
      auditLog: [
        { action: 'Permit Created', user: 'Emma Walsh', time: '2026-02-16T14:00:00', type: 'create' },
        { action: 'Permit Approved', user: 'Prakash Senghani', time: '2026-02-17T06:45:00', type: 'approve' },
        { action: 'Permit Activated', user: 'System', time: '2026-02-17T07:00:00', type: 'activate' },
        { action: 'Permit Expired', user: 'System', time: '2026-02-17T15:00:00', type: 'expire' }
      ]
    },
    {
      id: 'PTW-2026-0139',
      type: 'EXCAVATION',
      typeName: 'Excavation',
      typeIcon: '⛏️',
      title: 'Foundation Trench - Block D',
      status: 'CLOSED',
      riskLevel: 'MEDIUM',
      location: 'Zone D - West Wing',
      zone: 'Zone D - West Wing',
      contractor: 'Meridian Industrial',
      supervisor: 'James Patel',
      team: 'Ground Works Team (5 persons)',
      startDate: '2026-02-15',
      startTime: '07:00',
      endDate: '2026-02-16',
      endTime: '17:00',
      description: 'Excavation of foundation trenches for Block D extension. Depth 2.5m.',
      rams: {
        status: 'VALIDATED',
        files: [
          { name: 'RAMS_Excavation_BlockD.pdf', size: '2.2 MB', type: 'pdf', version: 2, date: '2026-02-14', validated: true, validatedBy: 'Prakash Senghani' }
        ]
      },
      checklist: [true, true, true, true, true, true, true, true],
      simopsConflicts: [],
      approvedBy: 'Prakash Senghani',
      approvedAt: '2026-02-14T17:00:00',
      createdAt: '2026-02-14T10:00:00',
      createdBy: 'James Patel',
      auditLog: [
        { action: 'Permit Created', user: 'James Patel', time: '2026-02-14T10:00:00', type: 'create' },
        { action: 'Permit Approved', user: 'Prakash Senghani', time: '2026-02-14T17:00:00', type: 'approve' },
        { action: 'Permit Closed', user: 'James Patel', time: '2026-02-16T17:30:00', type: 'close' }
      ]
    },
    {
      id: 'PTW-2026-0138',
      type: 'HOT_WORK',
      typeName: 'Hot Work',
      typeIcon: '🔥',
      title: 'Pipe Welding - Mechanical Room',
      status: 'SUSPENDED',
      riskLevel: 'HIGH',
      location: 'Zone G - Plant Room',
      zone: 'Zone G - Plant Room',
      contractor: 'Apex Construction Ltd',
      supervisor: 'Mike Thompson',
      team: 'Welding Team Beta (3 persons)',
      startDate: '2026-02-18',
      startTime: '10:00',
      endDate: '2026-02-18',
      endTime: '16:00',
      description: 'Welding of HVAC pipe connections in mechanical plant room.',
      rams: {
        status: 'VALIDATED',
        files: [
          { name: 'RAMS_HotWork_PlantRoom.pdf', size: '1.9 MB', type: 'pdf', version: 1, date: '2026-02-17', validated: true, validatedBy: 'Prakash Senghani' }
        ]
      },
      checklist: [true, true, true, true, true, true, true, true],
      simopsConflicts: [],
      approvedBy: 'Prakash Senghani',
      approvedAt: '2026-02-18T09:30:00',
      suspendedAt: '2026-02-18T11:15:00',
      suspendedReason: 'Gas leak detected in adjacent area. Permit suspended pending investigation.',
      createdAt: '2026-02-17T16:00:00',
      createdBy: 'Mike Thompson',
      auditLog: [
        { action: 'Permit Created', user: 'Mike Thompson', time: '2026-02-17T16:00:00', type: 'create' },
        { action: 'Permit Approved', user: 'Prakash Senghani', time: '2026-02-18T09:30:00', type: 'approve' },
        { action: 'Permit Activated', user: 'System', time: '2026-02-18T10:00:00', type: 'activate' },
        { action: 'Permit SUSPENDED', user: 'Prakash Senghani', time: '2026-02-18T11:15:00', type: 'suspend', detail: 'Gas leak detected in adjacent area' }
      ]
    }
  ],

  // Notifications
  notifications: [
    {
      id: 'N001',
      type: 'conflict',
      title: 'SIMOPS Conflict Detected',
      body: 'PTW-2026-0141 conflicts with PTW-2026-0143 in Zone E on 19 Feb 2026.',
      time: '2026-02-18T09:46:00',
      read: false,
      permitId: 'PTW-2026-0141'
    },
    {
      id: 'N002',
      type: 'approval',
      title: 'Permit Requires Approval',
      body: 'PTW-2026-0141 (Confined Space - Zone E) is awaiting your approval.',
      time: '2026-02-18T09:45:00',
      read: false,
      permitId: 'PTW-2026-0141'
    },
    {
      id: 'N003',
      type: 'suspend',
      title: 'Permit Suspended',
      body: 'PTW-2026-0138 has been suspended due to gas leak in adjacent area.',
      time: '2026-02-18T11:15:00',
      read: false,
      permitId: 'PTW-2026-0138'
    },
    {
      id: 'N004',
      type: 'expiry',
      title: 'Permit Expiring Soon',
      body: 'PTW-2026-0142 (Hot Work - Block C) expires today at 17:00.',
      time: '2026-02-18T14:00:00',
      read: true,
      permitId: 'PTW-2026-0142'
    },
    {
      id: 'N005',
      type: 'rams',
      title: 'RAMS Validation Required',
      body: 'RAMS document for PTW-2026-0141 requires HSE validation before approval.',
      time: '2026-02-18T09:47:00',
      read: true,
      permitId: 'PTW-2026-0141'
    }
  ],

  // Global Audit Log
  auditLog: [
    { id: 'A001', action: 'SIMOPS Conflict Detected', permitId: 'PTW-2026-0141', user: 'System', time: '2026-02-18T09:46:00', type: 'conflict', detail: 'Zone E conflict with PTW-2026-0143, overlap 08:00-14:00' },
    { id: 'A002', action: 'Permit Suspended', permitId: 'PTW-2026-0138', user: 'Prakash Senghani', time: '2026-02-18T11:15:00', type: 'suspend', detail: 'Gas leak detected in adjacent area' },
    { id: 'A003', action: 'Permit Approved', permitId: 'PTW-2026-0143', user: 'Prakash Senghani', time: '2026-02-18T08:30:00', type: 'approve', detail: 'All conditions met. RAMS validated.' },
    { id: 'A004', action: 'Permit Activated', permitId: 'PTW-2026-0142', user: 'System', time: '2026-02-18T08:00:00', type: 'activate', detail: 'Permit start time reached' },
    { id: 'A005', action: 'RAMS Validated', permitId: 'PTW-2026-0142', user: 'Prakash Senghani', time: '2026-02-17T16:00:00', type: 'validate', detail: 'RAMS_HotWork_BlockC_v2.pdf validated' },
    { id: 'A006', action: 'Permit Submitted', permitId: 'PTW-2026-0141', user: 'Sarah Chen', time: '2026-02-18T09:45:00', type: 'submit', detail: 'Submitted for HSE review' },
    { id: 'A007', action: 'Permit Expired', permitId: 'PTW-2026-0140', user: 'System', time: '2026-02-17T15:00:00', type: 'expire', detail: 'Permit validity window ended' },
    { id: 'A008', action: 'Override Requested', permitId: 'PTW-2026-0141', user: 'Sarah Chen', time: '2026-02-18T10:00:00', type: 'override', detail: 'Justification: Different work areas within zone, no direct interaction' },
    { id: 'A009', action: 'Permit Closed', permitId: 'PTW-2026-0139', user: 'James Patel', time: '2026-02-16T17:30:00', type: 'close', detail: 'Work completed. Site cleared and inspected.' },
    { id: 'A010', action: 'Permit Created', permitId: 'PTW-2026-0141', user: 'Sarah Chen', time: '2026-02-18T09:00:00', type: 'create', detail: 'Draft created' }
  ]
};

// App State

