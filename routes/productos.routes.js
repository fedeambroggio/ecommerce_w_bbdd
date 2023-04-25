import { Router } from "express";
import {
    getAllProducts,
    addProduct
} from "../controller/productos.controller.js";
const productosRouter = Router();

productosRouter.get("/", getAllProducts);
productosRouter.post("/", addProduct);

export default productosRouter;