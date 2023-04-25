import { mensajesRepository } from "../schemas/mensajes/mensajes.repository.js";
import { AutorDTO, MensajesDTO } from "../schemas/mensajes/mensajes.dto.js";

export async function getAllMessages(req, res) {
  const mensajes = await MensajesRepository.find();
  res.json({data: mensajes});
}

export const addMessage = async (req, res) => {
  const { email, nombre, apellido, edad, alias, avatar, mensaje } = req.body;

  const nuevoAutor = new AutorDTO( email, nombre, apellido, edad, alias, avatar)
  const nuevoMensaje = new MensajesDTO(nuevoAutor, mensaje)
  
  const mensajeAgregado = await mensajesRepository.create(nuevoMensaje);
  return res.status(201).json({ data: mensajeAgregado, message: "El mensaje ha sido agregado" });
};