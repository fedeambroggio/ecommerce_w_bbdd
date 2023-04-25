/**
 * mensajes.repository toma los métodos definidos e el repostory general
 * y los implementa según sus necesidades particulares. 
 * En este caso, las funciones particulares son tomadas directamente de las
 * definidas en la DAO, pero estas podrían no existir y ser definidas directamente
 * aquí
 */

import { Repository } from "../repository.js"
import mensajesFactory from "./mensajes.factory.js";

export class MensajesRepository extends Repository { 

    constructor() {
        super()
        this.mensajesDAO = mensajesFactory.getDAO();
    }

    async find() {
        const mensajes = await this.mensajesDAO.find();  
        return mensajes;
    };
    async findById(id) {
        const mensaje = await this.mensajesDAO.findById(id);
        return mensaje;
    };
    async create(data) {
        const mensaje = await this.mensajesDAO.create(data);
        return mensaje; 
    };
    async update(id, data) {
        const _mensaje = await this.mensajesDAO.update(id, data);
        return _mensaje;
    };
    async delete(id) {
        await this.mensajesDAO.delete(id);
        return true;
    };
}

export const mensajesRepository = new MensajesRepository();