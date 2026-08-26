import express from 'express'
import cookieParser from "cookie-parser"
import { CORS_ORIGIN } from './constants.js';
import cors from "cors"
import http from "http";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { Server } from "socket.io";

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
});

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", (userId) => {
        if (!userId) {
            console.log(`Socket ${socket.id} attempted to register without a userId`);
            return; 
        }
        socket.join(userId.toString());
        console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

import userRouter from './routes/user.routes.js'

app.use("/api/v1/users", userRouter)

import noteRouter from './routes/note.route.js'

app.use("/api/v1/notes", noteRouter)

import likeRouter from './routes/like.route.js'

app.use("/api/v1/likes", likeRouter)

import commentRouter from './routes/comment.route.js'

app.use("/api/v1/comments", commentRouter)

import followRouter from './routes/follow.route.js'

app.use("/api/v1/follows", followRouter)

import playlistRouter from './routes/playlist.route.js'

app.use("/api/v1/playlists", playlistRouter)

import playlistShareRouter from './routes/playlistShare.route.js'

app.use("/api/v1/playlistShares", playlistShareRouter)


import notificationRouter from './routes/notifications.route.js';

app.use("/api/v1/notifications", notificationRouter);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
        errors: err.errors || [],
    });
});



export { app, server, io };
