import { logger } from '../utils/logger.js';

export const getSessionInfo = async (ctx) => {
  logger.log({ level: "info", message: "Request [GET] to /session-info" });
  // Info using session
  // ctx.body = { data: ctx.session.userName };
  // Info using passport
  ctx.body = { data: ctx.state.user.email };
};

export const saveSession = async (ctx) => {
  logger.log({ level: "info", message: "Request [POST] to /session-save" });
  ctx.session.userName = ctx.request.body.email;
  ctx.body = {
    status: 200,
    data: `Bienvenido ${ctx.request.body.email}`,
  };
};

export const deleteSession = async (ctx) => {
  logger.log({ level: "info", message: "Request [POST] to /session-delete" });
  const userName = ctx.state.user.email;
  await ctx.session.destroy();
  if (!ctx.session) {
    ctx.body = {
      status: 200,
      data: `Hasta luego ${userName}`,
    };
  } else {
    ctx.body = {
      status: 200,
      data: `Logout error`,
    };
  }
};