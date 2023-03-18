import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ClientSQL from './lib/sql.js';
import { optionsMariaDB } from "./options/MariaDB.js";
import * as http from 'http';
import { Server } from "socket.io";
import mongoose from "mongoose";
import CRUD_MongoDB from "./lib/MongoDBManager.js";
import { MensajesDAO } from './lib/MensajesDAOMongoDB.js';
import { normalize, schema } from 'normalizr';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import * as dotenv from 'dotenv'
dotenv.config()

const saltRounds = 10;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    mongoUrl: "mongodb://localhost:27017/ecommerce"
}

// Server config
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname + "/public")))
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

// For Socket.io config
const server = http.createServer(app);
const io = new Server(server);

let mongoDBCollectionCRUD;

function connectToMongoDB(DAO) {
    return mongoose.connect(mongoConfig["mongoUrl"], mongoConfig["mongoOptions"])
      .then(() => {
        //   console.log("MongoDB database connection established successfully!");
          mongoDBCollectionCRUD = new CRUD_MongoDB(DAO)
      })
      .catch((error) => console.error("Error connecting to MongoDB: ", error));
}


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
server.listen(args.p, () => {
    console.log(`Servidor iniciado en puerto ${server.address().port}`);
})
// MANEJO DE ERRORES SERVIDOR
server.on("error", (e) => console.log(e))