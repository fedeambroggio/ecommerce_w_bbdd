import mongoose from "mongoose";
import {MONGO_URI} from "../config/index.js";

async function init() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URI);
}


export default () => init().catch(err => console.log(err));