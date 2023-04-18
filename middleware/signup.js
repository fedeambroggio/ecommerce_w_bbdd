import { UserModel, UserSchema } from '../schemas/User.schema.js';
import { logger } from '../utils/logger.js';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bCrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

export const signup = (passport) => {
    passport.use(
        "signup",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email", // Cambia el campo "username" a "email"
            },
            function (req, email, password, done) {
                findOrCreateUser = function () {
                    // Find a user in Mongo with provided username
                    UserModel.findOne({ email: email })
                        .then(function (user) {
                            if (user) {
                                logger.log({level: "info", message: `User already exists: ${user}`})
                                return done(null, false);
                            } else {
                                var newUser = new UserSchema({
                                    email: email,
                                    password: createHash(password),
                                    name: req.body["name"],
                                    address: req.body["address"],
                                    age: req.body["age"],
                                    phoneNumber: req.body["phoneNumber"],
                                    avatarUrl: req.body["avatarUrl"],
                                });
                                
                                return newUser.save()
                                    .then((newUser) => {
                                        
                                        logger.log({level: "info", message: `User saved succesfully: ${newUser}`})
                                
                                     });
                            }
                        })
                        .catch(function (err) {
                            logger.log({level: "warn", message: `Error in SignUp: ${err}`})
                            return done(err);
                        });
                };

                // Delay the execution of findOrCreateUser and execute
                // the method in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            }
        )
    );

    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
