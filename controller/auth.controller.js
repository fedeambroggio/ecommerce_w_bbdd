
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
    passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/fallo-login',
    })
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
    passport.authenticate('signup', {
        successRedirect: '/login',
        failureRedirect: '/signup'
    })
};