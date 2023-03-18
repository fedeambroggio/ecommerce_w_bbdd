import yargs from "yargs";
import cluster from 'cluster';
import routes from './src/routes/index.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import passport from 'passport';
import * as dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 8080;
const DEFAULT_MODE = "FORK";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = yargs(process.argv.slice(2))
  .default("p", DEFAULT_PORT)
  .default("m", DEFAULT_MODE)
    .argv;
 
// MongoDB setup
mongoose.set('strictQuery', false);
export const mongoConfig = {
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize:10,
        wtimeoutMS:2500
    },
    mongoUrl: "mongodb://localhost:27017/ecommerce"
}


const startServer = () => {
    const app = express();
    console.log(`Worker ${process.pid} started`);

    app.use('/', routes.authRouter);
    app.use('/', routes.userRouter);
    app.use('/api', routes.apiRouter);

    // Server config
    app.use(express.json());  // to support JSON-encoded bodies
    app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
    app.use(express.static(path.join(__dirname + "/public")))
    app.use(session({
        store: MongoStore.create(mongoConfig),
        secret: process.env.MONGO_STORE_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 10000 //10 minutos
        }
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    app.listen(args.p, () => {
        console.log(`App listening on port ${args.p}`);
    });
}

if (args.m === "CLUSTER") {
    if (cluster.isMaster) {
        console.log(`Number of CPUs is ${require("os").cpus().length}`);
        console.log(`Master is running on ${process.pid}`);

        for (let i = 0; i < totalCPUs - 1; i++) {
            cluster.fork();
        }

        cluster.on("online", (worker) => {
            console.log("Worker " + worker.process.pid + " is online");
        });
        cluster.on("exit", (worker) => {
            console.log(`worker ${worker.process.pid} died. Restarting...`);
            cluster.fork();
        });
    } else {
        startServer()
    }
} else {
    startServer()
}
