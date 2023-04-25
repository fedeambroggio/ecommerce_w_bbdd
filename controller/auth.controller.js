
import passport from 'passport';
import { logger } from '../utils/logger.js'

export const getLoginPage = async (req, res) => {
    logger.log({ level: "info", message: "Request [GET] to /login" })
    res.sendFile('login.html', { root: `./public` })
};
export const getLoginFailPage = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /fallo-login"})
    res.sendFile('fail_login.html', {root: './public'})
};
export const postLogin = async (req, res) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            logger.log({level: "warn", message: `Error en el ingreso: ${err}`})
            return res.redirect('/login');
        }
        if (!user) {
            logger.log({level: "warn", message: `Error en el ingreso: ${info}`})
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.log({level: "warn", message: `Error en el ingreso: ${err}`})
                return res.redirect('/login');
            }
            return res.redirect('/');
        });
    })(req, res);
};
export const getSignUpPage = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /registro"})
    res.sendFile('signup.html', {root: './public'})
};
export const getSignUpFailPage = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /fallo-registro"})
    res.sendFile('fail_signup.html', {root: './public'})
};
export const postSignUp = async (req, res) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            logger.log({level: "warn", message: `Error en el registro: ${err}`})
            return res.redirect('/signup');
        }
        if (!user) {
            logger.log({level: "warn", message: `Error en el registro: ${info}`})
            return res.redirect('/signup');
        }
        req.logIn(user, (err) => {
            if (err) { 
                logger.log({level: "warn", message: `Error en el registro: ${err}`})
                return res.redirect('/signup');
            }
            return res.redirect('/login');
        });
    })(req, res);
};