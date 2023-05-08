// TODO: DAO y DTO en carpetas con ese nombre para respetar convención

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressSession from 'express-session';
import passport from 'passport';
import yargs from 'yargs'
import cluster from 'cluster';
import * as dotenv from 'dotenv'
import compression from 'compression';
import {logger} from './utils/logger.js';

import authRouter from "./routes/auth.routes.js";
import appRouter from "./routes/app.routes.js";
import apiRouter from "./routes/api.routes.js";
import sessionRouter from "./routes/session.routes.js";
import productosRouter from "./routes/productos.routes.js";
import mensajesRouter from "./routes/mensajes.routes.js";

import connectDatabase from "./database/index.js";
import {initPassport} from "./middleware/passport.js";
dotenv.config()

const DEFAULT_PORT = 8080;
const DEFAULT_MODE = "FORK";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = yargs(process.argv.slice(2))
  .default("p", DEFAULT_PORT)
  .default("m", DEFAULT_MODE)
    .argv;

const startServer = () => {
    const app = express();
    logger.log({ level: "info", message: `Worker ${process.pid} started` });
    
    // Initialize mongodb
    connectDatabase();

    // Initialize Passport
    initPassport(passport);

    // Server config
    app.use(express.json()); // to support JSON-encoded bodies
    app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
    app.use(express.static(path.join(__dirname + "/public")));
    app.use(expressSession({
        secret: "secret-session",
        resave: true,
        saveUninitialized: true
      }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(compression()); //Use this if you want to compress all responses

    // app.use((req, res, next) => {
    //     logger.log({level: "info", message: `Received ${req.method} request to ${req.path}`})
    //     next();
    // });

    //Routes
    app.use("/", authRouter);
    app.use("/", appRouter);
    app.use("/", sessionRouter);
    app.use("/api", apiRouter);
    // app.use("/api/productos", productosRouter);
    app.use("/graphql", productosRouter);
    app.use("/api/mensajes", mensajesRouter);

    const server = app.listen(args.p, () => {
        logger.log("info", `App listening on port ${args.p}`);
    });
    server.on("error", (err) => {
        logger.log("error", `Error al iniciar el servidor ${err}`);
    });
};

if (args.m === "CLUSTER") {
    if (cluster.isMaster) {
        logger.log({
            level: "info",
            message: `Master is running on ${process.pid}`,
        });

        for (let i = 0; i < numCPUs - 1; i++) {
            cluster.fork();
        }

        cluster.on("online", (worker) => {
            logger.log({
                level: "info",
                message: "Worker " + worker.process.pid + " is online",
            });
        });
        cluster.on("exit", (worker) => {
            logger.log({
                level: "info",
                message: `Worker ${worker.process.pid} died. Restarting...`,
            });
            cluster.fork();
        });
    } else {
        startServer();
    }
} else {
    startServer();
}

export { startServer };