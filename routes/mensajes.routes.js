import Router from 'koa-router';
import {
    getAllMessages,
    addMessage
} from "../controller/mensajes.controller.js";

const mensajesRouter = new Router();

mensajesRouter.get("/", getAllMessages);
mensajesRouter.post("/", addMessage);

export default mensajesRouter;