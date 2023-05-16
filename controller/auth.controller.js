import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';
import passport from 'koa-passport';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLoginPage = async (ctx) => {
  logger.log({ level: 'info', message: 'Request [GET] to /login' });
  try {
    const filePath = path.join(__dirname, '../public/login.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
};

export const getLoginFailPage = async (ctx) => {
  logger.log({ level: 'info', message: 'Request [GET] to /fallo-login' });
  try {
    const filePath = path.join(__dirname, '../public/fail_login.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
};

export const postLogin = async (ctx, next) => {
  await passport.authenticate('login', async (err, user, info) => {
    if (err) {
      logger.log({ level: 'warn', message: `Error en el ingreso: ${err}` });
      ctx.redirect('/login');
    }
    if (!user) {
      logger.log({ level: 'warn', message: `Error en el ingreso: ${info}` });
      ctx.redirect('/login');
    }
    await ctx.login(user);
    ctx.redirect('/');
  })(ctx, next);
};

export const getSignUpPage = async (ctx) => {
  logger.log({ level: 'info', message: 'Request [GET] to /registro' });
  try {
    const filePath = path.join(__dirname, '../public/signup.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
};

export const getSignUpFailPage = async (ctx) => {
  logger.log({ level: 'info', message: 'Request [GET] to /fallo-registro' });
  try {
    const filePath = path.join(__dirname, '../public/fail_signup.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ctx.type = 'html';
    ctx.body = fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
};

export const postSignUp = async (ctx, next) => {
  console.log(ctx)
  await passport.authenticate('signup', async (err, user, info) => {
    if (err) {
      logger.log({ level: 'warn', message: `Error en el registro: ${err}` });
      ctx.redirect('/signup');
    }
    if (!user) {
      logger.log({ level: 'warn', message: `Error en el registro: ${info}` });
      ctx.redirect('/signup');
    }
    await ctx.login(user);
    ctx.redirect('/login');
  })(ctx, next);
};
