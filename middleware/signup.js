import { UserModel } from '../schemas/User.schema.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

export const signup = (passport) => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email", // Cambia el campo "username" a "email"
      },
      async (email, password, done) => {
        try {
          const existingUser = await UserModel.findOne({ email });

          if (existingUser) {
            logger.log({ level: "info", message: `User already exists: ${existingUser}` });
            return done(null, false);
          }

          const newUser = new UserModel({
            email: email,
            password: createHash(password),
          });

          const savedUser = await newUser.save();

          logger.log({ level: "info", message: `User saved successfully: ${savedUser}` });
          return done(null, savedUser);
        } catch (err) {
          logger.log({ level: "error", message: `Error in SignUp: ${err}` });
          return done(err);
        }
      }
    )
  );

  // Generates hash using bCrypt
  var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };
};
