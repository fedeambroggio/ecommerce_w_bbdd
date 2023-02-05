import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ClientSQL from './lib/sql.js';
import { optionsMariaDB } from "./options/MariaDB.js";
import { optionsSQLite3 } from "./options/SQLite3.js";
import * as http from 'http';
import { Server } from "socket.io";
import { generateRandomProducts } from './lib/generateRandomProducts.js';
import mongoose from "mongoose";
import CRUD_MongoDB from "./lib/MongoDBManager.js";
import { MensajesDAO } from './lib/MensajesDAOMongoDB.js';
import { normalize, schema } from 'normalizr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const sql = new ClientSQL(optionsMariaDB, 'productos');
const sqlite = new ClientSQL(optionsSQLite3, 'mensajes');

// Server config
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname + "/public")))

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
  
// ENDPOINTS
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
});

app.get('/api/productos-test', (req, res) => {
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