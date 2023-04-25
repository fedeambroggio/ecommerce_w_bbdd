import { MensajesModel } from "./mensajes.schema.js";
import { MensajesDTO } from "./mensajes.dto.js";

export class MensajesMongoDAO {
    async create(data) {
        const messageDTO = new MensajesDTO(data.autor, data.texto, data.hora)
        const entity = new MensajesModel(messageDTO);
        return entity.save();
    }

    async findById(id) {
        const msg = MensajesModel.findById(id);
        return new MensajesDTO(msg.autor, msg.texto, msg.hora)
    }

    async find(query) {
        const mensajes = MensajesModel.find(query);
        const mensajesDTO = mensajes.map(msg => {
            return new MensajesDTO(msg.autor, msg.texto, msg.hora)
        })
        return mensajesDTO
    }

    async update(id, data) {
        const messageDTO = new MensajesDTO(data.autor, data.texto, data.hora)
        return MensajesModel.findByIdAndUpdate(id, messageDTO, { new: true });
    }

    async delete(id) {
        return MensajesModel.findByIdAndDelete(id);
    }
}
