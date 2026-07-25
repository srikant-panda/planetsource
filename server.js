import express from "express";
import { config } from "./config.js"
import { connectDb } from "./src/utils/database.utils.js"
import cookieParser from "cookie-parser";
import { authRouter } from "./src/routes/auth.routes.js"

const app = express();
app.use(express.json());
app.use(cookieParser())

const db = await connectDb();

console.log(`MongoDB Connected: ${db.connection.host}, MongoDB Database: ${db.connection.name}`);



app.get("/", (req, res) => res.json({ message: "PlanetSource has started....." }))
app.use("/api/auth/",authRouter);

app.listen(config.PORT, () => console.log(`Server started at ${config.PORT}`))