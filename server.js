import Koa from 'koa';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'koa-session';
import passport from 'koa-passport';
import yargs from 'yargs';
import cluster from 'cluster';
import * as dotenv from 'dotenv';
import compress from 'koa-compress';
import {logger} from './utils/logger.js';
import bodyParser from 'koa-bodyparser';
import staticFiles from 'koa-static';
import authRouter from "./routes/auth.routes.js";
import appRouter from "./routes/app.routes.js";
import apiRouter from "./routes/api.routes.js";
import sessionRouter from "./routes/session.routes.js";
import productosRouter from "./routes/productos.routes.js";
import mensajesRouter from "./routes/mensajes.routes.js";
import mount from "koa-mount";

import connectDatabase from "./database/index.js";
import {initPassport} from "./middleware/passport.js";
dotenv.config();

const DEFAULT_PORT = 8080;
const DEFAULT_MODE = "FORK";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = yargs(process.argv.slice(2))
  .default("p", DEFAULT_PORT)
  .default("m", DEFAULT_MODE)
    .argv;

const startServer = () => {
    const app = new Koa();
    logger.log({ level: "info", message: `Worker ${process.pid} started` });

    // Initialize mongodb
    connectDatabase();

    // Initialize Passport
    initPassport(passport);

    // Server config
    app.use(session(app));
    app.keys = ['secret-session'];
    app.use(passport.initialize());
    app.use(bodyParser());
    app.use(passport.session());
    app.use(compress()); // Use this if you want to compress all responses
    app.use(staticFiles('public')); // Ruta al directorio con archivos estáticos

    // app.use((ctx, next) => {
    //     logger.log({ level: "info", message: `Received ${ctx.method} request to ${ctx.path}` });
    //     await next();
    // });

    // Routes
    app.use(authRouter.routes());
    app.use(appRouter.routes());
    app.use(sessionRouter.routes());    
    app.use(mount('/api', apiRouter.routes()));
    app.use(mount('/api/productos', productosRouter.routes()));
    app.use(mount('/api/mensajes', mensajesRouter.routes()));

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
