import {Schema, model} from "mongoose";

export const UserSchema = new Schema({
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

export const UserModel = model("usuarios", UserSchema);