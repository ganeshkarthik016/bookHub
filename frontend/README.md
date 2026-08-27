# BookHub - Frontend 💻

This is the React frontend for BookHub, built using Vite for blazing-fast development. It handles the user interface, global state management, form validations, rich-text note creation, and real-time updates via WebSockets.

---

## 🛠️ Technologies Used

- **Core:** React 18, Vite
- **Routing:** React Router DOM
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS
- **Forms & Validation:** React Hook Form
- **API Communication:** Axios
- **Real-time:** Socket.IO Client

---

## ✨ Implemented Features

- **Authentication & account:** registration/login, JWT access-token refresh, logout, OTP email verification, OTP password reset, password change, Gmail change, profile updates, profile-picture updates, and account deletion.
- **Notes & discovery:** PDF and cover-image upload, note detail/file editing, public/private visibility, search, download, deletion, likes, comments, user search, and profiles.
- **Connections:** follow/unfollow controls, follower/following lists, mutual friends, and follow suggestions.
- **Playlists:** create, edit, delete, public/private playlists, item ordering, member management, and Owner/Editor/Viewer sharing permissions. Editors can add notes to shared playlists; viewers are shown as read-only.
- **Notifications:** unread count, notification inbox, read/delete actions, and live Socket.IO notifications.
- **Written notes:** owner-only content editing, background-generated PDFs, PDF status states, and generated-PDF viewing/downloading without exposing the editable content to other users.

---

## 📂 Folder Structure

Here is an overview of the frontend directory structure and what each part does:

```text
frontend/
├── public/                 # Static assets (global images)
├── src/
│   ├── components/         # Reusable UI components (Buttons, Cards, Modals)
│   ├── conf/               # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API calls, Axios interceptors, and Socket listeners
│   ├── store/              # Redux store setup and slices (auth, notes, etc.)
│   ├── utils/              # Helper functions and constants
│   ├── App.jsx             # Main application layout and route configuration
│   ├── index.css           # Global styles and Tailwind directives
│   └── main.jsx            # React root entry point
├── .env                    # Environment variables (do not commit this!)
├── .gitignore              # Files to ignore in Git
├── eslint.config.js        # ESLint configuration for code quality
├── index.html              # Main HTML template
├── package-lock.json       # Exact dependency versions
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v16 or higher is recommended).

### 1. Installation

Navigate to the frontend directory and install the required dependencies:

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `frontend` directory. Vite requires environment variables exposed to the client to be prefixed with `VITE_`.

```env
# Example .env file
VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_TINYMCE_API_KEY=your_tinymce_api_key_here
```

### 3. Running the Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will typically run on `http://localhost:5173/` by default.

### 4. Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled HTML, CSS, and JS files, which can be served by any static file hosting service.

---

**BookHub** — _Frontend Repository_
