import { Router } from "express";
import {
    getDashboardPage,
} from "../controller/app.controller.js";

import { authMiddleware } from "../middleware/auth.js";
const appRouter = Router();

appRouter.get("/", authMiddleware, getDashboardPage);
//TEST
// appRouter.get("/", getDashboardPage);

export default appRouter;