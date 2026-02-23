# HSW Digital | Contractor Management Portal

The Contractor Management Portal is a comprehensive, enterprise-grade system designed to manage the full lifecycle of contractor engagement, from pre-qualification and onboarding to performance monitoring and permit issuance.

It provides a unified platform for HSE (Health, Safety, and Environment) management, ensuring compliance, reducing risk, and streamlining operations across multiple business units and projects.

## Key Features

### 🏢 Executive Dashboards & Analytics
- **Enterprise Overview**: Real-time KPI tracking (LTIFR, LTIR, TRIR) and compliance metrics.
- **Project Drill-down**: Detailed views for Business Units and individual projects.
- **Trend Analysis**: Visual indicators for safety performance trends (Improving/Deteriorating).

### 👷 Contractor & Workforce Management
- **Company Profiles**: Centralized database of contractor details, certifications, and compliance status.
- **Workforce Onboarding**: Digital induction tracking, competency verification, and ID card generation.
- **Compliance Monitoring**: Automated alerts for expiring certifications and non-compliant workers.

### 📝 Permit to Work (PTW) System
- **Digital Permitting**: Streamlined wizards for Hot Work, Cold Work, Confined Space, and other high-risk activities.
- **RAMS Integration**: Risk Assessment and Method Statement validation workflow.
- **SIMOPS Detection**: Automated conflict checking for simultaneous operations in the same zone.
- **QR Code Verification**: Instant field validation of permit status and worker authorization.

### 🛡️ Safety & Incident Reporting
- **Incident Management**: Structured reporting workflow for accidents, near-misses, and observations.
- **Root Cause Analysis**: Tools for investigation and corrective action tracking (CAPA).
- **Escalation Engine**: Automated notifications for overdue actions or critical incidents.

### 🔐 Security & Access Control
- **Role-Based Access (RBAC)**: Granular permissions for Enterprise Admins, BU Managers, Project Leads, and Contractor Admins.
- **Secure Authentication**: Simulated login flows with role switching for demonstration.

## Project Structure

This is a modern, static web application built with **Vanilla JS** (ES6+), **HTML5**, and modular **CSS**.

```
/
├── assets/             # Static assets (fonts, icons)
├── css/                # Stylesheets
│   ├── main.css        # Core design system & variables
│   ├── components.css  # Reusable UI components
│   └── modules.css     # Domain-specific styles (Dashboards, PTW, etc.)
├── img/                # Images and logos
├── js/                 # Javascript Application Logic
│   ├── app.js          # App initialization & global state
│   ├── router.js       # Client-side routing engine
│   ├── data.js         # Mock data store & state management
│   ├── utils.js        # Helper functions & shared logic
│   └── pages/          # Feature Modules
│       ├── dashboard.js          # Main KPI Dashboard
│       ├── contractors.js        # Contractor List & Management
│       ├── contractor-profile.js # Contractor Detail View
│       ├── onboarding.js         # Worker Onboarding Flow
│       ├── create-permit.js      # PTW Creation Wizard
│       ├── permit-detail.js      # Permit View & Action
│       ├── reports.js            # Analytics & Reporting
│       └── ... (other modules)
└── index.html          # Single Page Application (SPA) entry point
```

## Setup & Development

No build process is required. You can run the application directly in any modern browser.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/venktastic/Contractor.git
    cd Contractor
    ```

2.  **Run locally**:
    Serve the project root using a static file server.
    -   **VS Code**: Use the "Live Server" extension.
    -   **Python**: `python3 -m http.server 8000`
    -   **Node**: `npx serve .`

3.  **Deploy**:
    Deploy easily to static hosting platforms like GitHub Pages, Netlify, or Vercel by pointing them to the root directory.

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Browsers (iOS Safari, Android Chrome)

## License

Private / Proprietary - HSW Digital Solutions.
