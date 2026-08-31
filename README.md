# 📚 BookHub

**BookHub** is a full-stack study and knowledge-sharing platform where students can create, upload, organize, discover, and interact with study material — combining note sharing, social features, playlists, search, and real-time notifications into a single platform.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://book-hub-ashy-six.vercel.app)
[![CI](https://github.com/ganeshkarthik016/bookHub/actions/workflows/ci.yml/badge.svg)](https://github.com/ganeshkarthik016/bookHub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://book-hub-ashy-six.vercel.app) · [Report a Bug](https://github.com/ganeshkarthik016/bookHub/issues) · [Request a Feature](https://github.com/ganeshkarthik016/bookHub/issues)

---

## Table of Contents

- [Live Deployment](#-live-deployment)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start-docker)
- [CI/CD](#-cicd)
- [Goal](#-goal)
- [License](#-license)

---

## 🌐 Live Deployment

BookHub is deployed using managed cloud services in production.

| Component     | Provider      | URL / Notes                                                          |
| ------------- | ------------- | -------------------------------------------------------------------- |
| Frontend      | Vercel        | [book-hub-ashy-six.vercel.app](https://book-hub-ashy-six.vercel.app) |
| Backend API   | Render        | [bookhub-ywkk.onrender.com](https://bookhub-ywkk.onrender.com)       |
| Database      | MongoDB Atlas | —                                                                    |
| Cache / Queue | Render Redis  | Used for caching and BullMQ jobs                                     |
| File Storage  | Cloudinary    | Notes, cover images, generated PDFs                                  |

### Deployment Architecture

```text
                    ┌────────────────────────┐
                    │   React Frontend       │
                    │        Vercel          │
                    └───────────┬────────────┘
                                │
                              HTTPS
                                │
                                ▼
                    ┌────────────────────────┐
                    │   Express Backend      │
                    │        Render          │
                    └───────┬────────┬───────┘
                            │        │
                  ┌─────────┘        └──────────┐
                  ▼                             ▼
        ┌──────────────────┐          ┌──────────────────┐
        │  MongoDB Atlas   │          │   Render Redis   │
        │    Database      │          │ Cache + BullMQ   │
        └──────────────────┘          └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │   BullMQ Worker  │
                                       │ Background Jobs  │
                                       └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │    Cloudinary    │
                                       │ Files + PDFs     │
                                       └──────────────────┘
```

---

## ✨ Features

**Authentication & Account**

- 🔐 Registration, login, logout, and JWT access/refresh-token sessions
- 📧 Email verification, password reset, and email changes via OTP (Brevo Email API)
- 👤 Profile, account details, profile picture, and account deletion management
- 🔄 Automatic access-token refresh
- 🛡️ Protected and public routes

**Study Material**

- 📝 Upload, edit, replace, search, download, and delete PDF study notes with cover images
- 📄 Public/private PDF-based study material support
- ✍️ Written notes with owner-only editing and background PDF generation

**Social**

- ❤️ Like and unlike notes
- 💬 Comment on notes
- 🤝 Follow users, browse followers/following, view friends, and receive follow suggestions

**Playlists**

- 📚 Create, edit, delete, reorder, and collaborate on public/private playlists
- 🔗 Share playlists with Owner, Editor, and Viewer permissions

**Discovery & Real-time**

- 🔎 Search notes and users
- 🔔 Real-time notifications with unread/read management and deletion
- ⚡ Real-time updates via Socket.IO

**Infrastructure**

- ☁️ Cloudinary storage for note assets and generated written-note PDFs

---

## 🛠️ Tech Stack

| Layer            | Technologies                                                                    |
| ---------------- | ------------------------------------------------------------------------------- |
| **Frontend**     | React, Vite, React Router, Redux Toolkit, Tailwind CSS, Axios, Socket.IO Client |
| **Backend**      | Node.js, Express.js, MongoDB, Mongoose, Redis, Socket.IO                        |
| **Auth & Mail**  | JWT, bcrypt, Nodemailer                                                         |
| **Files & Jobs** | Multer, Cloudinary, BullMQ, PDFKit                                              |
| **DevOps**       | Docker                                                                          |

---

## 🏗️ Architecture

```text
              ┌──────────────────┐
              │   React Frontend │
              │                  │
              │ Redux + Router   │
              │ React Hook Form  │
              └────────┬─────────┘
                       │
                    Axios
                       │
                       ▼
              ┌──────────────────┐
              │  Express Backend │
              │                  │
              │ REST API + JWT   │
              └───────┬──────────┘
                      │
              ┌───────┴────────┐
              ▼                ▼
          MongoDB            Redis

                       +
                  Socket.IO
                  Real-time
                  events
```

---

## 📂 Project Structure

This repository is a monorepo containing both the frontend and backend applications.

```text
BookHub/
├── backend/               # Express.js API, WebSocket server, and backend docs
├── frontend/              # React client application and frontend docs
├── docker-compose.yml     # Multi-container Docker orchestration
├── LICENSE                # MIT License
└── README.md              # Main project documentation
```

> Detailed setup instructions, folder structures, and API documentation are available in the [Frontend](https://github.com/ganeshkarthik016/bookHub/tree/main/frontend) and [Backend](https://github.com/ganeshkarthik016/bookHub/tree/main/backend) directories.

---

## 🚀 Quick Start (Docker)

Since this project includes a `docker-compose.yml` file, you can spin up the backend services, worker, and databases using Docker.

1. **Clone the repository**

   ```bash
   git clone https://github.com/ganeshkarthik016/bookHub.git
   cd bookHub
   ```

2. **Configure environment variables**
   Set up your `.env` files in both the `frontend` and `backend` directories. Refer to their respective READMEs for the required variables.

3. **Start the application**

   ```bash
   docker compose up -d --build
   ```

4. **Open the app**
   Once the containers are running, visit the frontend at `http://localhost:<port>` (see `frontend/README.md` for the configured port).

---

## 🔄 CI/CD

BookHub uses **GitHub Actions** for continuous integration and deployment. On every push and pull request to `main`, the pipeline:

- **Frontend job** — installs dependencies, runs ESLint, and builds the Vite app.
- **Backend job** — spins up the full stack via Docker Compose (API, worker, MongoDB, Redis), runs a health check, seeds a test account, and runs the backend test suite (`node --test`).
- **Deploy job** — runs only on successful pushes to `main`, triggering an automatic deploy to Render (backend) via a deploy hook.

The frontend on Vercel deploys automatically on push to `main` through Vercel's own Git integration, independent of this workflow.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for the full pipeline definition.

---

## 🎯 Goal

BookHub is being built as a practical full-stack application while exploring modern web development concepts such as scalable React architecture, centralized state management, authentication, real-time communication, caching, file handling, and modular backend design.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Ganesh Karthik

---

<p align="center">
  <strong>BookHub</strong> — <em>A study platform built for learning, sharing, and organizing knowledge.</em>
</p>
