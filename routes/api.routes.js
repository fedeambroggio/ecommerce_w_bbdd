import { Router } from "express";
import {
    getInfo,
    getInfoLog,
    getRandoms,
    getProductsTest
} from "../controller/api.controller.js";
const apiRouter = Router();

apiRouter.get("/info", getInfo);
apiRouter.get("/info-log", getInfoLog);
apiRouter.get("/randoms", getRandoms);
apiRouter.get('/productos-test', getProductsTest);

export default apiRouter;