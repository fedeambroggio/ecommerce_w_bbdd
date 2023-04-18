import { logger } from '../utils/logger.js'

export const authMiddleware = (req, res, next) => {
    logger.log({ level: "info", message: "Checking if user isAuthenticated" });
    // Auth with passport
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
};
