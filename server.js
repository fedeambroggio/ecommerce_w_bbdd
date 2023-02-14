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
import { normalize, schema } from 'normalizr';
import session from 'express-session';
import MongoStore from 'connect-mongo'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const sql = new ClientSQL(optionsMariaDB, 'productos');

const mongoStoreOptions = {
    mongoUrl: 'mongodb+srv://gt:5318@learningcluster.henetdi.mongodb.net/Auth?retryWrites=true&w=majority',
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
  }

// Server config
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname + "/public")))
app.use(session({
    store: MongoStore.create(mongoStoreOptions),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 10000 //10 minutos
    }
}))

// For Socket.io config
const server = http.createServer(app);
const io = new Server(server);

// MongoDB setup
mongoose.set('strictQuery', false);
export const mongoConfig = {
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize:10,
        wtimeoutMS:2500
    },
    mongoUrl: "mongodb://localhost:27017/ecommerce"
}

let mongoDBMensajesCRUD;

function connectToMongoDB() {
    return mongoose.connect(mongoConfig["mongoUrl"], mongoConfig["options"])
      .then(() => {
          console.log("MongoDB database connection established successfully!");
          mongoDBMensajesCRUD = new CRUD_MongoDB(MensajesDAO)
      })
      .catch((error) => console.error("Error connecting to MongoDB: ", error));
}

function auth(req, res, next) {
    if (req.session?.userName) {
        return next()
    } else {
        res.sendFile('login.html', {root: path.join(__dirname, 'public')})
    }
}

// ENDPOINTS
app.get('/login', (req, res) => {
    res.sendFile('login.html', {root: path.join(__dirname, 'public')})
});

app.post('/session-save', (req, res) => {
    req.session.userName = req.body.userName;
    res.json({
        status: 200,
        data: `Bienvenido ${req.body.userName}`
    })
})
app.post('/session-delete', (req, res) => {
    const userName = req.session.userName
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
    res.json({ data: req.session.userName })
})


app.get('/api/productos-test', (req, res) => {
    //Extender la sesión un minuto
    req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
    const products = generateRandomProducts(5)
    res.json({products})
});

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
    
    console.log({ operation: "getAllProducts", status, data })
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
        
        console.log({ operation: "addProducts", status, data })

        // Se envían los productos actualizados a los usuarios
        try {
            data = await sql.getAllProducts();
            status = 200
        } catch (err) {
            data = err;
            status = 500
        }
        
        console.log({ operation: "getAllProducts", status, data })

        io.sockets.emit('productos', data)
    })
    
    // Se envían todos los mensajes al usuario
    connectToMongoDB()
        .then(async () => {
            data = await mongoDBMensajesCRUD.readMessages()
            status = 200
        })
        .catch((err) => {
            status = 500
            data = err
        })
        .finally(() => {
            console.log({ operation: "getAllMessages", status, data })

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

        await connectToMongoDB()
            .then(() => {
                data = mongoDBMensajesCRUD.create(msg)
                status = 200
            })
            .catch((err) => {
                status = 500
                data = err
            })
            .finally(() => {
                console.log({ operation: "addMessage", status, data })
            })
        
        // Se envían los mensajes actualizados a los usuarios
        // Se envían todos los mensajes al usuario
        await connectToMongoDB()
            .then(() => {
                data = mongoDBMensajesCRUD.readMessages()
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
                console.log({ operation: "addMessage", status, data })
            })
    })
});

// SERVER INIT
server.listen(8080, () => {
    console.log(`Servidor iniciado en puerto 8080`);
})
// MANEJO DE ERRORES SERVIDOR
server.on("error", (e) => console.log(e))