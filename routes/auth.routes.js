import Router from 'koa-router';
import {
    getLoginPage,
    getLoginFailPage,
    getSignUpPage,
    getSignUpFailPage,
    postLogin,
    postSignUp
} from "../controller/auth.controller.js";

const authRouter = new Router();

authRouter.get("/login", getLoginPage);
authRouter.get("/fallo-login", getLoginFailPage);
authRouter.post("/login", postLogin);

authRouter.get("/registro", getSignUpPage);
authRouter.get("/fallo-registro", getSignUpFailPage);
authRouter.post("/registro", postSignUp);

export default authRouter;