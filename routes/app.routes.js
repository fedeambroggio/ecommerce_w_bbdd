import Router from 'koa-router';
import {
    getDashboardPage,
} from "../controller/app.controller.js";

import { authMiddleware } from "../middleware/auth.js";
const appRouter = new Router();

appRouter.get("/", authMiddleware, getDashboardPage);

export default appRouter;
