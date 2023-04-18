import {logger} from '../utils/logger.js'

export const getSessionInfo = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /session-info"})
    // Info ussing session
    // res.json({ data: req.session.userName })
    // Info ussing passport
    res.json({ data: req.user.email })
};
export const saveSession = async (req, res) => {
    logger.log({level: "info", message: "Request [POST] to /session-save"})
    req.session.userName = req.body.email;
    res.json({
        status: 200,
        data: `Bienvenido ${req.body.email}`
    })
};
export const deleteSession = async (req, res) => {
    logger.log({level: "info", message: "Request [POST] to /session-delete"})
    const userName = req.user.email
    req.session.destroy(err => {
        if (!err) {
            res.json({
                status: 200,
                data: `Hasta luego ${userName}`
            })
        } else {
            res.json({
                status: 200,
                data: `Logout error ${err}`
            })
        }
    })
};