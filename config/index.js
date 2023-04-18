import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 8080;
export const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
export const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce";