import { logger } from '../utils/logger.js'
import path from 'path';

export const getDashboardPage = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /dashboard"});
    console.log('req.session:', req.session);
    
    if (req.session) {
      res.sendFile('dashboard.html', {root: "./public"});
    } else {
      res.sendFile('login.html', {root: "./public"});
    }
  };