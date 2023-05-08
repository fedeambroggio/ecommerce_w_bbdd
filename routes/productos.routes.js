import { Router } from "express";
import {
    getAllProducts,
    addProduct,
    deleteProductById,
    getProductById,
    modifyProductById,
} from "../controller/productos.controller.js";
import { graphqlHTTP } from "express-graphql";
import { ProductosGraphQLSchema } from "../schemas/productos/productos.graphql.schema.js";
const productosRouter = Router();

// productosRouter.get("/", getAllProducts);
// productosRouter.get("/:id", getProductById);
// productosRouter.post("/", addProduct);
// productosRouter.put("/:id", modifyProductById);
// productosRouter.delete("/:id", deleteProductById);

productosRouter.use("/", graphqlHTTP({
    schema: ProductosGraphQLSchema,
    rootValue: {
        getAllProducts,
        addProduct,
        deleteProductById,
        getProductById,
        modifyProductById,
    },
    graphiql: true
}))

export default productosRouter;
