import dotenv from "dotenv"
import { connectDB } from "./db/index.js";
import { server } from "./app.js";
import { PORT } from "./constants.js";
import { connectRedis } from "./utils/redis.js";

dotenv.config({
    path: './.env'
})
await connectRedis();

const port = PORT;

connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`⚙️ Server is running at port : ${port}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })
