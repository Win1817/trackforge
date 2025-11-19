# TrackForge

**TrackForge** — Master your time, streamline your workflow.  
A powerful, third-party time-tracking and productivity manager integrated with **Clockify API**.  
**Note:** TrackForge is a third-party application and is **not affiliated with Clockify**.  
Developed by **Surely Win Dilag**.

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)  
- [UI & Design](#ui--design)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Overview

TrackForge is a one-page **SPA web application** designed to simplify time entry management for users leveraging the Clockify API.  

Key objectives:  
- Batch multi-ticket entry  
- Project, task, and time selection per ticket  
- Time entry templates for repetitive tasks  
- Modern dashboard with tabbed navigation: **Dashboard, Settings, Template, Profile**  
- Secure API key and workspace management  
- Responsive, premium dark UI  

---

## Features

- **Clockify Integration:** Create, update, delete time entries via API  
- **Multi-Ticket Entry:** Add multiple tickets at once with individual project, task, and time  
- **Templates:** Save recurring ticket sets for quick time entry  
- **One-Page Dashboard:** Tabbed navigation replacing sidebar (Dashboard, Settings, Template, Profile)  
- **Profile Management:** Modern profile button with dropdown and settings  
- **UI/UX Enhancements:** Dark theme, responsive layout, notifications, validation, loading states  
- **Automation Tools:** Quick duplicate ticket, auto-fill last used project/task, recurring entries (optional)  
- **Secure API Key Handling:** Encrypted storage (if backend used), proxy API calls to Clockify  

---

## Installation

### Prerequisites

- Node.js >= 18.x  
- npm or yarn  
- Optional: Docker for backend deployment  

### Steps

1. Clone the repository:  
```bash
git clone https://github.com/yourusername/trackforge.git
cd trackforge
````

2. Install dependencies:

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. Configure environment variables (see [Configuration](#configuration)).

4. Start development server:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## Configuration

Create a `.env` file in the backend directory:

```env
CLOCKIFY_API_KEY=your_clockify_api_key
CLOCKIFY_WORKSPACE_ID=your_workspace_id
PORT=4000
```

* **CLOCKIFY_API_KEY**: Your personal API key from Clockify
* **CLOCKIFY_WORKSPACE_ID**: Workspace ID where time entries will be created
* **PORT**: Backend server port

---

## Usage

1. Navigate to `http://localhost:3000` (frontend)
2. Enter API Key and Workspace ID in **Settings tab**
3. Go to **Dashboard tab** to:

   * Add single or multiple tickets
   * Assign projects, tasks, start/end times
   * Submit to Clockify API
4. Use **Template tab** to save frequently used ticket sets
5. Access **Profile tab** to manage user preferences and logout

---

## Folder Structure

```
trackforge/
├─ frontend/          # React SPA
│  ├─ public/         # Static files, favicon
│  ├─ src/
│  │  ├─ components/  # React components (Dashboard, Tabs, Forms, Profile)
│  │  ├─ pages/       # Page components
│  │  ├─ styles/      # TailwindCSS or global styles
│  │  └─ utils/       # Helper functions
├─ backend/           # Node.js + Express API
│  ├─ controllers/    # Clockify API handlers
│  ├─ routes/         # API endpoints
│  ├─ services/       # Business logic
│  ├─ middlewares/    # Authentication & validation
│  └─ utils/          # Helpers
├─ .env.example       # Example env variables
└─ README.md
```

---

## UI & Design

* **Theme:** Dark, premium, futuristic (TrackForge brand)
* **Typography:** Inter/SF Pro for UI, JetBrains Mono for numeric/time fields
* **Colors:**

  * Background: #0D0E11
  * Panels: #13151A
  * Primary Accent: #4B8BFF / #A06BFF
  * Secondary Accent: #C7CAD0
* **Iconography:** TrackForge logo and app icon
* **Layout:** One-page SPA with tabs replacing sidebar, modern card components, and responsive forms

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is **MIT Licensed** — see the [LICENSE](LICENSE) file.
**Credits:** Developed by **Surely Win Dilag**

---

## Footer / Subtitle

```
TrackForge — Master your time, streamline your workflow.  
Third-party application, not affiliated with Clockify.  
© 2025 Surely Win Dilag. All rights reserved.

If you want, I can **also generate a README with screenshots / diagrams and a mini “Getting Started” tutorial”** ready to paste into GitHub.  

Do you want me to do that next?
```
