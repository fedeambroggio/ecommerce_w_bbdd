import { Router } from "express";
import {
    getSessionInfo,
    saveSession,
    deleteSession
} from "../controller/session.controller.js";
const sessionRouter = Router();

sessionRouter.get("/session-info", getSessionInfo);
sessionRouter.post("/session-save", saveSession);
sessionRouter.post("/session-delete", deleteSession);

export default sessionRouter;