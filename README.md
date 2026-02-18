# SafeWork PTW - Mobile HSE Application

SafeWork PTW is a mobile-first Permit to Work (PTW) system designed to streamline HSE processes in construction and heavy industry. It helps manage safety permits, SIMOPS (Simultaneous Operations) conflicts, and compliance documentation directly from the field.

## Features

- **Mobile-First Design**: Optimized for tablets and smartphones.
- **Permit Authoring**: Step-by-step wizard for creating Hot Work, Cold Work, Confined Space, and other permits.
- **SIMOPS Detection**: Automated conflict detection for overlapping zones and schedules.
- **RAMS Integration**: Attach and validate Risk Assessments and Method Statements.
- **QR Code Verification**: Instant permit status checks via QR codes.
- **Real-time Dashboard**: Monitor active permits, pending approvals, and safety alerts.

## Project Structure

```
/
├── assets/          # Images and static assets
├── css/             # Stylesheets (Modular CSS)
│   ├── main.css     # Design system & core variables
│   ├── components.css # Reusable UI components
│   └── modules.css  # Page-specific styles
├── js/              # Application logic
│   ├── app.js       # Main entry point
│   ├── router.js    # Client-side routing
│   ├── data.js      # Mock data and state management
│   └── pages/       # Page-specific logic scripts
└── index.html       # Single Page Application entry point
```

## Setup & Development

This is a static web application built with Vanilla JS, HTML, and CSS. No build step is required.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/safework-ptw.git
    cd safework-ptw
    ```

2.  **Run locally**:
    You can serve the files using any static file server, for example:
    -   VS Code Live Server extension
    -   `python3 -m http.server`
    -   `npx serve .`

3.  **Deploy**:
    This project is ready for deployment on static hosting platforms like:
    -   **GitHub Pages**: Push to a `gh-pages` branch or configure Pages in repository settings.
    -   **Netlify / Vercel**: Connect your repository and deploy the root directory.

## License

Private / Proprietary - SafeWork Ltd.
