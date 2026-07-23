import dotenv from "dotenv";

dotenv.config()


const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
};


if (!process.env.PORT)
    console.log("Port not defined in the env picking up the defalult port 3000.");
if (!process.env.MONGO_URI)
    throw new Error("database URI is not defined in env.")



// console.log("JWT_SECRET:", process.env.JWT_SECRET);
// console.log("Config:", config.JWT_SECRET);
export { config };