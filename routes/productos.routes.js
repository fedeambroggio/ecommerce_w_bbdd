import { Router } from "express";
import {
    getAllProducts,
    addProduct,
    deleteProductById,
    getProductById,
    modifyProductById,
} from "../controller/productos.controller.js";
const productosRouter = Router();

productosRouter.get("/", getAllProducts);
productosRouter.get("/:id", getProductById);
productosRouter.post("/", addProduct);
productosRouter.put("/:id", modifyProductById);
productosRouter.delete("/:id", deleteProductById);

export default productosRouter;