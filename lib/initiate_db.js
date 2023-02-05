import ClientSQL from './sql.js';
import { optionsMariaDB } from "../options/MariaDB.js";
const sql = new ClientSQL(optionsMariaDB, 'productos');

sql.createTableForProducts();