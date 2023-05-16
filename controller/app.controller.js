import { logger } from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDashboardPage = async (ctx) => {
  logger.log({ level: "info", message: "Request [GET] to /dashboard" });
  console.log('ctx.session:', ctx.session);

  if (ctx.session) {
    const filePath = path.join(__dirname, '../public/dashboard.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  } else {
    const filePath = path.join(__dirname, '../public/login.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  }
};
