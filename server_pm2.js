import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ClientSQL from './lib/sql.js';
import { optionsMariaDB } from "./options/MariaDB.js";
import * as http from 'http';
import { Server } from "socket.io";
import { generateRandomProducts } from './lib/generateRandomProducts.js';
import mongoose from "mongoose";
import CRUD_MongoDB from "./lib/MongoDBManager.js";
import { MensajesDAO } from './lib/MensajesDAOMongoDB.js';
import { UsersDAO } from './lib/UsersDAOMongoDB.js';
import { normalize, schema } from 'normalizr';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import yargs from 'yargs'
import { fork } from 'child_process';
import os from 'os';
import cluster from 'cluster';
import * as dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 8080;
const numCPUs = os.cpus().length;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = yargs(process.argv.slice(2))
  .default("p", DEFAULT_PORT).argv;

const saltRounds = 10;
const app = express();
const router = express.Router();

const sql = new ClientSQL(optionsMariaDB, 'productos');

const mongoStoreOptions = {
    mongoUrl: `mongodb+srv://gt:${process.env.MONGO_URL_KEY}@learningcluster.henetdi.mongodb.net/Auth?retryWrites=true&w=majority`,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}
  
// MongoDB setup
mongoose.set('strictQuery', false);
export const mongoConfig = {
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize:10,
        wtimeoutMS:2500
    },
    mongoUrl: "mongodb://localhost:27017/Ecommerce"
}


const socketInit = () => {
    // For Socket.io config
    const server = http.createServer(app);
    const io = new Server(server);

    //Socket events
    io.on('connection', async (socket) => {
        console.log('Se ha conectado un usuario');

        let data, status;
        // Se envían todos los productos al usuario
        try {
            data = await sql.getAllProducts();
            status = 200
        } catch (err) {
            data = err;
            status = 500
        }
        
        // console.log({ operation: "getAllProducts", status, data })
        socket.emit('productos', data)

        socket.on('nuevoProducto', async prod => {
            // Guardar el producto recibido
            let data, status;
            try {
                data = await sql.addProducts(prod)
                status = 200
            } catch (err) {
                data = err;
                status = 500
            }
            
            // console.log({ operation: "addProducts", status, data })

            // Se envían los productos actualizados a los usuarios
            try {
                data = await sql.getAllProducts();
                status = 200
            } catch (err) {
                data = err;
                status = 500
            }
            
            // console.log({ operation: "getAllProducts", status, data })

            io.sockets.emit('productos', data)
        })
        
        // Se envían todos los mensajes al usuario
        connectToMongoDB(MensajesDAO)
            .then(async () => {
                data = await mongoDBCollectionCRUD.readMessages()
                status = 200
            })
            .catch((err) => {
                status = 500
                data = err
            })
            .finally(() => {
                // console.log({ operation: "getAllMessages", status, data })

                const author = new schema.Entity('authors')
                const messages = new schema.Entity('messages', {
                    author: author,
                });
                const normalizedData = normalize(data, [messages])

                socket.emit('mensajes', normalizedData)
            })

        socket.on('nuevoMensaje', async msg => {
            // Guardar el mensaje recibido
            let data, status;

            await connectToMongoDB(MensajesDAO)
                .then(() => {
                    data = mongoDBCollectionCRUD.create(msg)
                    status = 200
                })
                .catch((err) => {
                    status = 500
                    data = err
                })
                .finally(() => {
                    // console.log({ operation: "addMessage", status, data })
                })
            
            // Se envían los mensajes actualizados a los usuarios
            // Se envían todos los mensajes al usuario
            await connectToMongoDB(MensajesDAO)
                .then(() => {
                    data = mongoDBCollectionCRUD.readMessages()
                    status = 200
                    return data
                })
                .then((newData) => {
                    const author = new schema.Entity('authors')
                    const messages = new schema.Entity('messages', {
                        author: author,
                    });
                    const normalizedData = normalize(newData, [messages])
                    socket.emit('mensajes', normalizedData)
                })
                .catch((err) => {
                    status = 500
                    data = err
                })
                .finally(() => {
                    // console.log({ operation: "addMessage", status, data })
                })
        })
    });

    // SERVER INIT
    server.listen(args.p + 100, () => {
        console.log(`Servidor iniciado en puerto ${server.address().port + 100}`);
    })
    // MANEJO DE ERRORES SERVIDOR
    server.on("error", (e) => console.log(e))
}


let mongoDBCollectionCRUD;

function connectToMongoDB(DAO) {
    return mongoose.connect(mongoConfig["mongoUrl"], mongoConfig["mongoOptions"])
      .then(() => {
        //   console.log("MongoDB database connection established successfully!");
          mongoDBCollectionCRUD = new CRUD_MongoDB(DAO)
      })
      .catch((error) => console.error("Error connecting to MongoDB: ", error));
}

function auth(req, res, next) {
    // Auth with session
    // if (req.session?.userName) {
    //     return next()
    // } else {
    //     res.sendFile('login.html', {root: path.join(__dirname, 'public')})
    // }
    // Auth with passport
    if (req.isAuthenticated())
		return next();
	res.redirect('/login');
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

const startServer = () => {
    const app = express();
    console.log(`Worker ${process.pid} started`);

    // Server config
    app.use(express.json());  // to support JSON-encoded bodies
    app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
    //app.use(express.static(path.join(__dirname + "/public")))
    app.use(session({
        store: MongoStore.create(mongoConfig),
        secret: process.env.MONGO_STORE_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 10000 //10 minutos
        }
    }))
    app.use(passport.initialize());
    app.use(passport.session());


    
    // ENDPOINTS
    app.get('/info', (req, res) => {
        res.json({
            argumentosEntrada: args,
            SO: process.platform,
            nodeVersion: process.version,
            reservedMemory: process.memoryUsage()['rss'],
            excPath: __filename,
            PID: process.pid,
            projectDir: process.cwd(),
            numCPUs: numCPUs    
        })
    });
    app.get('/registro', (req, res) => {
        res.sendFile('signup.html', {root: path.join(__dirname, 'public')})
    });
    app.get('/fallo-registro', (req, res) => {
        res.sendFile('fail_signup.html', {root: path.join(__dirname, 'public')})
    });
    app.post('/registro', (req, res) => {
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


    app.get('/login', (req, res) => {
        res.sendFile('login.html', {root: path.join(__dirname, 'public')})
    });
    app.get('/fallo-login', (req, res) => {
        res.sendFile('fail_login.html', {root: path.join(__dirname, 'public')})
    });
    app.post('/login', passport.authenticate('loginStrategy', {
        successRedirect: '/dashboard',
        failureRedirect: '/fallo-login',
    }))

    app.post('/session-save', (req, res) => {
        req.session.userName = req.body.email;
        res.json({
            status: 200,
            data: `Bienvenido ${req.body.email}`
        })
    })
    app.post('/session-delete', (req, res) => {
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
    app.get('/dashboard', auth, (req, res) => {
        //Extender la sesión un minuto
        req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
        if (req.session) {
            res.sendFile('index.html', {root: path.join(__dirname, 'public')})
        } else { 
            res.sendFile('login.html', {root: path.join(__dirname, 'public')})
        }
    });
    app.get('/session-info', (req, res) => {
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

    //API ENDPOINTS
    router.route('/productos-test')
        .get((req, res) => {
            //Extender la sesión un minuto
            req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
            const products = generateRandomProducts(5)
            res.json({products})
        });

    router.route('/randoms')
        .get((req, res) => {
            const cant = parseInt(req.query.cant) || 100000000;
            const forkedRandomNumberGenerator = fork('./lib/generateRandomNumbers.js')

            forkedRandomNumberGenerator.on("message", (result) => {
                //handle async ES6 import
                if (result === "Iniciado") {
                    forkedRandomNumberGenerator.send(cant)
                } else {
                    res.json({fromNginx: true, port: args.p, ...result})
                }
            })
        });
    app.use('/api', router)


    let server = app.listen(args.p, () => {
        console.log(`App listening on port ${server.address().port}`);
    });

    // socketInit()
}


startServer();





