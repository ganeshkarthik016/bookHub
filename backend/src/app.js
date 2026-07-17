import express from 'express'
import cookieParser from "cookie-parser"
import { CORS_ORIGIN } from './constants.js';
import cors from "cors"
import router from "./routes/user.routes.js";
const app = express();

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'

app.use("/api/v1/users", userRouter)

import noteRouter from './routes/note.route.js'

app.use("/api/v1/notes", noteRouter)


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
        errors: err.errors || [],
    });
});



export { app }
