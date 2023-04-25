import { Schema, model } from "mongoose";

export const MensajesSchema = new Schema({
    autor: {
        id: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        edad: { type: Number, required: true, default: 18 },
        alias: { type: String, required: true },
        avatar: { type: String, required: true },
      },
      texto: { type: String, required: true },
      hora: { type: Date, required: true, default: Date.now() },
  });

export const MensajesModel = model("mensajes", MensajesSchema);