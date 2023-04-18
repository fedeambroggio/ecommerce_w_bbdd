import { logger } from '../utils/logger.js'

export const getDashboardPage = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /dashboard"})
    if (req.session) {
        res.sendFile('dashboard.html', {root: "./public"})
    } else { 
        res.sendFile('login.html', {root: "./public"})
    }
};