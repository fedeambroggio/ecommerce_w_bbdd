import { ProductosDTO } from '../schemas/productos/productos.dto.js';
import productosFactory from "../schemas/productos/productos.factory.js";

const productosDAO = productosFactory.getDAO();

export const getAllProducts = async (ctx) => {
  const productos = await productosDAO.find();
  ctx.status = 200;
  ctx.body = { data: productos };
};

export const getProductById = async (ctx) => {
  const { id } = ctx.params;
  const producto = await productosDAO.findById(id);
  if (producto) {
    ctx.status = 200;
    ctx.body = { data: producto };
  } else {
    ctx.status = 200;
    ctx.body = { data: [], message: `El producto ${id} no ha sido encontrado` };
  }
};

export const addProduct = async (ctx) => {
  console.log(ctx)
  console.log(ctx.request.body)
  console.log(ctx.req.body)
  const { nombre, descripcion, precio, foto, codigo, stock } = ctx.request.body;
  const nuevoProducto = new ProductosDTO(nombre, descripcion, codigo, foto, precio, stock);
  // TODO: Verificar que no exista
  const productos = await productosDAO.create(nuevoProducto);
  ctx.status = 201;
  ctx.body = { data: productos, message: "El producto ha sido creado" };
};

export const deleteProductById = async (ctx) => {
  const { id } = ctx.params;
  const productoDeleted = await productosDAO.delete(id);
  if (productoDeleted) {
    ctx.status = 201;
    ctx.body = { data: productoDeleted, message: "El producto ha sido eliminado" };
  } else {
    ctx.status = 200;
    ctx.body = { data: [], message: `El producto ${id} no ha sido encontrado` };
  }
};

export const modifyProductById = async (ctx) => {
  const { id } = ctx.params;
  const { nombre, descripcion, precio, foto, codigo, stock } = ctx.request.body;

  const productoUpdated = await productosDAO.update(id, { nombre, descripcion, precio, foto, codigo, stock });

  if (productoUpdated) {
    ctx.status = 201;
    ctx.body = { data: productoUpdated, message: "El producto ha sido actualizado" };
  } else {
    ctx.status = 200;
    ctx.body = { data: [], message: `El producto ${id} no ha sido encontrado` };
  }
};