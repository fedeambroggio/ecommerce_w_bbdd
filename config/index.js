import dotenv from "dotenv"
import yargs from 'yargs'
dotenv.config()

const args = yargs(process.argv.slice(2)).argv;

export const PORT = process.env.PORT || 8080;
export const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
export const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/Ecommerce";
// export const DATABASE_TYPE = process.env.DATABASE_TYPE || "MONGO"; //Determine DAO from env
export const DATABASE_TYPE = args['db'] || "MONGO"; //Determine DAO from CLI args