# BookHub 📚

BookHub is a full-stack study and knowledge-sharing platform where students can create, upload, organize, discover, and interact with study material.

It combines note sharing, social features, playlists, search, and real-time notifications into a single platform.

---

## ✨ Features

- 🔐 User registration, login, logout & session management
- 📧 Email verification & Password reset via OTPs (Nodemailer)
- 👤 User profiles with follow/unfollow functionality
- 📝 Create, upload, read and manage study notes
- 📄 PDF-based study material support
- ✍️ Rich-text note writing with TinyMCE
- ❤️ Like and unlike notes
- 💬 Comment on notes
- 📚 Create, manage, and collaborate on playlists
- 🔗 Share playlists (Viewer/Editor roles)
- 🔎 Search notes and users
- 🔔 Real-time notifications
- 📊 Unread notification tracking
- ⚡ Real-time updates using Socket.IO
- 🔄 Automatic access-token refresh
- 🛡️ Protected and public routes

---

## 🛠️ Tech Stack

### Frontend

- React, Vite, React Router
- Redux Toolkit
- React Hook Form
- Tailwind CSS
- Axios
- Socket.IO Client
- TinyMCE

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- Redis
- Socket.IO
- JWT, bcrypt, Nodemailer
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

Since this project includes a `docker-compose.yml` file, you can spin up the entire application environment (including databases) using Docker.

1. Clone the repository:
   ```bash
   git clone [https://github.com/ganeshkarthik016/bookHub.git](https://github.com/ganeshkarthik016/bookHub.git)
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
