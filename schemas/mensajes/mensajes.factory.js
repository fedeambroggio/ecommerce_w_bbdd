import { DATABASE_TYPE } from "../../config/index.js";
import { MensajesMongoDAO } from "./mensajes.mongo.dao.js";

export class MensajesFactory {
    constructor() {
        this.mensajesDAO = null;
    }

    static getInstance() {
        if (!MensajesFactory.instance) {
          MensajesFactory.instance = new MensajesFactory();
        }
        return MensajesFactory.instance;
    }

    getDAO() {
        if (!this.mensajesDAO) {
          switch(DATABASE_TYPE) {
            case "MONGO":
              this.mensajesDAO = new MensajesMongoDAO();
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
        return this.mensajesDAO;
    }
}

export default MensajesFactory.getInstance();