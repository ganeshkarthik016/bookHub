import express from 'express'
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./routes/user.routes.js";

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'

app.use("/api/v1/users", userRouter)


const app = express();
