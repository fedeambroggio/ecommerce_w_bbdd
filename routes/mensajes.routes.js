import { Router } from "express";
import {
    getAllMessages,
    addMessage
} from "../controller/mensajes.controller.js";
const mensajesRouter = Router();

mensajesRouter.get("/", getAllMessages);
mensajesRouter.post("/", addMessage);

export default mensajesRouter;