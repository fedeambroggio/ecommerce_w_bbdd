import { UserModel } from '../schemas/User.schema.js';
import { logger } from '../utils/logger.js';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bCrypt from 'bcrypt';

export const login = (passport) => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email", // Cambia el campo "username" a "email"
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email: email });
          // Username does not exist, log error & reject
          if (!user) {
            logger.log({ level: "info", message: `User Not Found with email: ${email}` });
            return done(null, false);
          }
          // User exists but wrong password, log the error and reject
          if (!isValidPassword(user, password)) {
            logger.log({ level: "info", message: `Invalid Password for email: ${email}` });
            return done(null, false);
          }
          // User and password both match, resolve with user
          logger.log({ level: "info", message: `Login successful` });
          return done(null, user);
        } catch (err) {
          logger.log({ level: "info", message: `Login failed: ${err}` });
          return done(null, false);
        }
      }
    )
  );

  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  };
};
