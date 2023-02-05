// Clase para trabajar mensajes en MongoDB
import mongoose from "mongoose";

const mensajesCollection = "mensajes";

const MensajesSchema = new mongoose.Schema(
    {
        author: {
            id: {type: String,required: true},
            nombre: { type: String, require: true, max: 50 },
            apellido: { type: String, require: true, max: 50 },
            edad: { type: Number, require: true },
            alias: { type: String, require: true, max: 25 },
            avatar: { type: String, require: true },
        },
        text: { type: String, require: true, max: 200 },
        hora: { type: Date, require: true, default: Date.now() },
    }
);

export const MensajesDAO = mongoose.model(mensajesCollection, MensajesSchema);