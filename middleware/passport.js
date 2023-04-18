import { UserModel } from '../schemas/User.schema.js';
import { logger } from '../utils/logger.js';
import {login} from '../middleware/login.js';
import {signup} from '../middleware/signup.js';

export const initPassport = async (passport) => {
    passport.serializeUser(function (user, done) {
        logger.log({level: "info", message: `Serializing user: ${user}`})
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        UserModel.findById(id).lean() //Why .lean() --> https://stackoverflow.com/questions/59690923/handlebars-access-has-been-denied-to-resolve-the-property-from-because-it-is
            .then(user => {
                logger.log({level: "info", message: `Deserializing user: ${user}`})
                done(null, user);
            })
            .catch(err => {
                logger.log({ level: "warn", message: `Deserializing user error: ${err}` })
                done(err, null);
            });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
}