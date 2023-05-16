import Router from 'koa-router';
import {
    getInfo,
    getInfoLog,
    getRandoms,
    getProductsTest
} from "../controller/api.controller.js";

const apiRouter = new Router();

apiRouter.get("/info", getInfo);
apiRouter.get("/info-log", getInfoLog);
apiRouter.get("/randoms", getRandoms);
apiRouter.get('/productos-test', getProductsTest);

export default apiRouter;