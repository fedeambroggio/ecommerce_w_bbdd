import Router from 'koa-router';
import {
    getSessionInfo,
    saveSession,
    deleteSession
} from "../controller/session.controller.js";

const sessionRouter = new Router();

sessionRouter.get("/session-info", getSessionInfo);
sessionRouter.post("/session-save", saveSession);
sessionRouter.post("/session-delete", deleteSession);

export default sessionRouter;