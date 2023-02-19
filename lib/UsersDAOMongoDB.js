// Clase para trabajar mensajes en MongoDB
import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const UsersDAO = mongoose.model("usuarios", UsersSchema);
