import { DATABASE_TYPE } from "../../config/index.js";
import { ProductosMongoDAO } from "./productos.mongo.dao.js";

class ProductosFactory {
    constructor() {
        this.productosDAO = null;
    }

    static getInstance() {
        if (!ProductosFactory.instance) {
          ProductosFactory.instance = new ProductosFactory();
        }
        return ProductosFactory.instance;
    }

    getDAO() {
        if (!this.productosDAO) {
          switch(DATABASE_TYPE) {
            case "MONGO":
              this.productosDAO = new ProductosMongoDAO();
              break;
            case "MYSQL":
              break;
            case "POSTGRES":
              break;
            case "FIREBASE":
              break;
            case "SQLITE":
              break;
            default:
              throw new Error("No se ha definido un tipo de base de datos incluida en el proyecto");
          }
        }
        return this.productosDAO;
    }
}

export default ProductosFactory.getInstance();