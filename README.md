# BookHub 📚

BookHub is a full-stack study and knowledge-sharing platform where students can create, upload, organize, discover, and interact with study material.

It combines note sharing, social features, playlists, search, and real-time notifications into a single platform.

---

## ✨ Features

- 🔐 User registration, login, logout, JWT access/refresh-token sessions, and password changes
- 📧 Gmail verification, password reset, and email changes via OTPs (Nodemailer)
- 👤 Profile, account-detail, profile-picture, and account-deletion management
- 📝 Upload, edit, replace, search, download, and delete PDF study notes with cover images
- 📄 Public/private PDF-based study material support
- ✍️ Written notes with owner-only editing and background PDF generation
- ❤️ Like and unlike notes
- 💬 Comment on notes
- 🤝 Follow users, browse followers/following, view friends, and receive follow suggestions
- 📚 Create, edit, delete, reorder, and collaborate on public/private playlists
- 🔗 Share playlists with Owner, Editor, and Viewer permissions
- 🔎 Search notes and users
- 🔔 Real-time notifications with unread/read management and deletion
- ⚡ Real-time updates using Socket.IO
- ☁️ Cloudinary storage for note assets and generated written-note PDFs
- 🔄 Automatic access-token refresh
- 🛡️ Protected and public routes

---

## 🛠️ Tech Stack

### Frontend

- React, Vite, React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- Redis
- Socket.IO
- JWT, bcrypt, Nodemailer
- Multer, Cloudinary, BullMQ, PDFKit
- Docker

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

> _Detailed setup instructions, folder structures, and API documentation are available in the [Frontend](https://github.com/ganeshkarthik016/bookHub/tree/main/frontend) and [Backend](https://github.com/ganeshkarthik016/bookHub/tree/main/backend) directories._

---

## 🚀 Quick Start (Docker)

Since this project includes a `docker-compose.yml` file, you can spin up the backend services, worker, and databases using Docker.

1. Clone the repository:
   ```bash
   git clone https://github.com/ganeshkarthik016/bookHub.git
   cd bookHub
   ```
2. Set up your `.env` files in both the `frontend` and `backend` directories (refer to their respective READMEs for required variables).
3. Start the application:
   ```bash
   docker-compose up -d --build
   ```

---

## 🎯 Goal

BookHub is being built as a practical full-stack application while exploring modern web development concepts such as scalable React architecture, centralized state management, authentication, real-time communication, caching, file handling, and modular backend design.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Copyright (c) 2026 Ganesh Karthik

---

**BookHub** — _A study platform built for learning, sharing, and organizing knowledge._
