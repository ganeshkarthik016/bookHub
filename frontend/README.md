# 💻 BookHub — Frontend

The React client for **BookHub**, built with Vite for a fast dev experience. It handles the user interface, global state management, form validation, rich-text note creation, and real-time updates over WebSockets.

> Looking for the backend? See the [Backend README](../backend/README.md).
> Looking for the project overview? See the [Root README](../README.md).

---

## Table of Contents

- [Tech Stack](#️-tech-stack)
- [Features](#-implemented-features)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)

---

## 🛠️ Tech Stack

| Category           | Technology          |
| ------------------ | ------------------- |
| Core               | React 18, Vite      |
| Routing            | React Router DOM    |
| State Management   | Redux Toolkit (RTK) |
| Styling            | Tailwind CSS        |
| Forms & Validation | React Hook Form     |
| API Communication  | Axios               |
| Real-time          | Socket.IO Client    |

---

## ✨ Implemented Features

**Authentication & Account**
Registration/login, JWT access-token refresh, logout, OTP email verification, OTP password reset, password change, Gmail change, profile updates, profile-picture updates, and account deletion.

**Notes & Discovery**
PDF and cover-image upload, note detail/file editing, public/private visibility, search, download, deletion, likes, comments, user search, and profiles.

**Connections**
Follow/unfollow controls, follower/following lists, mutual friends, and follow suggestions.

**Playlists**
Create, edit, delete, public/private playlists, item ordering, member management, and Owner/Editor/Viewer sharing permissions. Editors can add notes to shared playlists; viewers see a read-only view.

**Notifications**
Unread count, notification inbox, read/delete actions, and live Socket.IO notifications.

**Written Notes**
Owner-only content editing, background-generated PDFs, PDF status states, and generated-PDF viewing/downloading — without exposing the editable content to other users.

---

## 📂 Folder Structure

```text
frontend/
├── public/                 # Static assets (global images)
├── src/
│   ├── components/         # Reusable UI components (Buttons, Cards, Modals)
│   ├── conf/                # Configuration files
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API calls, Axios interceptors, and Socket listeners
│   ├── store/                # Redux store setup and slices (auth, notes, etc.)
│   ├── utils/                # Helper functions and constants
│   ├── App.jsx                # Main application layout and route configuration
│   ├── index.css               # Global styles and Tailwind directives
│   └── main.jsx                 # React root entry point
├── .env                     # Environment variables (do not commit this!)
├── .gitignore                # Files to ignore in Git
├── eslint.config.js            # ESLint configuration for code quality
├── index.html                   # Main HTML template
├── package-lock.json             # Exact dependency versions
├── package.json                   # Project dependencies and scripts
└── vite.config.js                  # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- The [BookHub backend](../backend/README.md) running locally or accessible remotely

### 1. Installation

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `frontend` directory. Vite requires client-exposed environment variables to be prefixed with `VITE_`.

```env
# .env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_TINYMCE_API_KEY=your_tinymce_api_key_here
```

| Variable               | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `VITE_API_URL`         | Base URL of the backend REST API                                  |
| `VITE_SOCKET_URL`      | Base URL of the Socket.IO server                                  |
| `VITE_TINYMCE_API_KEY` | API key for the TinyMCE rich-text editor (used for written notes) |

### 3. Run the Development Server

Starts Vite with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app runs by default at [http://localhost:5173](http://localhost:5173).

### 4. Build for Production

```bash
npm run build
```

Generates an optimized `dist/` folder containing the compiled HTML, CSS, and JS, ready to be served by any static file host.

### 5. Preview the Production Build (optional)

```bash
npm run preview
```

Serves the `dist/` folder locally so you can sanity-check the production build before deploying.

---

## 📜 Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR   |
| `npm run build`   | Build the app for production         |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

---

<p align="center">
  <strong>BookHub</strong> — <em>Frontend Repository</em>
</p>
