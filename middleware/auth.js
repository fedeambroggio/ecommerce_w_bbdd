import { logger } from '../utils/logger.js';

export const authMiddleware = async (ctx, next) => {
    logger.log({ level: "info", message: "Checking if user isAuthenticated" });

    if (ctx.isAuthenticated()) {
        await next();
    } else {
        ctx.redirect("/login");
    }
};
