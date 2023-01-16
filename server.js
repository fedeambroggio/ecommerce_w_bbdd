import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ClientSQL from './lib/sql.js';
import { optionsMariaDB } from "./options/MariaDB.js";
import { optionsSQLite3 } from "./options/SQLite3.js";
import * as http from 'http';
import { Server } from "socket.io";

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

// ENDPOINTS
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
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
    try {
        data = await sqlite.getAllMessages();
        status = 200
    } catch (err) {
        data = err;
        status = 500
    } 
    
    console.log({ operation: "getAllMessages", status, data })
    socket.emit('mensajes', data)

    socket.on('nuevoMensaje', async msg => {
        // Guardar el mensaje recibido
        let data, status;
        try {
            data = await sqlite.addMessage(msg)
            status = 200
        } catch (err) {
            data = err;
            status = 500
        }
        
        console.log({ operation: "addMessage", status, data })

        // Se envían los mensajes actualizados a los usuarios
        try {
            data = await sqlite.getAllMessages();
            status = 200
        } catch (err) {
            data = err;
            status = 500
        } 
        
        console.log({ operation: "getAllMessages", status, data })
        io.sockets.emit('mensajes', data)
    })
});

// SERVER INIT
server.listen(8080, () => {
    console.log(`Servidor iniciado en puerto 8080`);
})
// MANEJO DE ERRORES SERVIDOR
server.on("error", (e) => console.log(e))