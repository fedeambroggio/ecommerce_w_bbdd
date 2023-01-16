import ClientSQL from './sql.js';
import { optionsMariaDB } from "../options/MariaDB.js";
import { optionsSQLite3 } from "../options/SQLite3.js";
const sql = new ClientSQL(optionsMariaDB, 'productos');
const sqlite = new ClientSQL(optionsSQLite3, 'mensajes');

sql.createTableForProducts();
sqlite.createTableForMessages();