import express from "express";
const router = express.Router();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';
import { fileURLToPath } from 'url';
import { UsersDAO } from "../../lib/UsersDAOMongoDB.js";
import mongoose from "mongoose";
import CRUD_MongoDB from "../../lib/MongoDBManager.js";

// MongoDB setup
mongoose.set('strictQuery', false);
export const mongoConfig = {
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize:10,
        wtimeoutMS:2500
    },
    mongoUrl: "mongodb://localhost:27017/ecommerce"
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mongoDBCollectionCRUD;

function connectToMongoDB(DAO) {
    return mongoose.connect(mongoConfig["mongoUrl"], mongoConfig["mongoOptions"])
      .then(() => {
        //   console.log("MongoDB database connection established successfully!");
          mongoDBCollectionCRUD = new CRUD_MongoDB(DAO)
      })
      .catch((error) => console.error("Error connecting to MongoDB: ", error));
}
function encriptPassword(plainPass) {
    return bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(plainPass, salt)
        })
        .then(hash => {
            return hash 
        })
        .catch(err => console.error(err.message))
}

function isValidPassword(password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
}  

// Passport init
// Necesario para persistir sesiones de usuario
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    connectToMongoDB(UsersDAO)
        .then(async () => {
            // buscar al usuario
            const foundUser = await mongoDBCollectionCRUD.read({ _id: id })

            if (foundUser.length !== 0) { 
                done(null, foundUser[0])
            } else {
                done("error")
            }
        })
});

// Login strategy
passport.use('loginStrategy', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    (_email, _password, done) => { 
        connectToMongoDB(UsersDAO)
            .then(async () => {
                // buscar al usuario
                let foundUser = await mongoDBCollectionCRUD.read({ email: _email })

                if (foundUser.length !== 0) {
                    // Si el usuario existe, comprobar contraseña
                    if (!isValidPassword(_password, foundUser[0].password)){
                        return done(null, false);
                    } else {
                        // Si la contraseña es correcta, devolver al usuario
                        return done(null, foundUser[0]);
                    }
                } else {
                    // Si el usuario no existe, error
                    return done(null, false)
                }
            })
            .catch((err) => {
                return done(err);
            })
}));


router.get('/registro', (req, res) => {
    const filePath = path.join(__dirname, '../../public/signup.html');
    res.sendFile(filePath);
});
router.get('/fallo-registro', (req, res) => {
    const filePath = path.join(__dirname, '../../public/fail_signup.html');
    res.sendFile(filePath);
});
router.post('/registro', (req, res) => {
    connectToMongoDB(UsersDAO)
        .then(async () => {
            let userInfo = {
                email: req.body.email,
                password: await encriptPassword(req.body.password)
            }
            // buscar al usuario
            let foundUser = await mongoDBCollectionCRUD.read({ email: req.body.email })
            if (foundUser.length !== 0) {
                // Si el usuario existe, redirigir a error
                res.redirect('/fallo-registro')
            } else {
                // Si el usuario no existe, guardarlo y redirigir a login
                data = await mongoDBCollectionCRUD.create(userInfo)
                res.redirect('/login')
            }
        })
        .catch((err) => {
            data = err
        })
})


router.get('/login', (req, res) => {
    const filePath = path.join(__dirname, '../../public/login.html');
    res.sendFile(filePath);
});
router.get('/fallo-login', (req, res) => {
    const filePath = path.join(__dirname, '../../public/fail_login.html');
    res.sendFile(filePath);
});
router.post('/login', passport.authenticate('loginStrategy', {
    successRedirect: '/dashboard',
    failureRedirect: '/fallo-login',
}))

router.post('/session-save', (req, res) => {
    req.session.userName = req.body.email;
    res.json({
        status: 200,
        data: `Bienvenido ${req.body.email}`
    })
})
router.post('/session-delete', (req, res) => {
    // UserName session
    // const userName = req.session.userName
    // UserName passport
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
    
})
router.get('/session-info', (req, res) => {
    /* 
    Al no usar motores de plantillas no es posible enviar
    los datos del usuario al frontend sin realizar una
    llamada aislada    
    */
    // Info ussing session
    // res.json({ data: req.session.userName })
    // Info ussing passport
    res.json({ data: req.user.email })
})


export { router as authRouter };