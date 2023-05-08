import { Schema, model } from "mongoose";

export const ProductosSchema = new Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    codigo: {type: String, required: true},
    foto: {type: String, required: true, default: ""},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true, default: 0},
    timestamp: {type: Date, required: true, default: Date.now()},
  });

export const ProductosModel = model("productos", ProductosSchema);
