import { mensajesRepository } from "../schemas/mensajes/mensajes.repository.js";
import { AutorDTO, MensajesDTO } from "../schemas/mensajes/mensajes.dto.js";

export async function getAllMessages(ctx) {
  const mensajes = await mensajesRepository.find();
  ctx.body = { data: mensajes };
}

export const addMessage = async (ctx) => {
  const { email, nombre, apellido, edad, alias, avatar, mensaje } = ctx.request.body;

  const nuevoAutor = new AutorDTO(email, nombre, apellido, edad, alias, avatar);
  const nuevoMensaje = new MensajesDTO(nuevoAutor, mensaje);

  const mensajeAgregado = await mensajesRepository.create(nuevoMensaje);
  ctx.status = 201;
  ctx.body = { data: mensajeAgregado, message: "El mensaje ha sido agregado" };
};