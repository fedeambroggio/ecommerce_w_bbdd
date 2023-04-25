import { ProductosDTO } from '../schemas/productos/productos.dto.js';
import productosFactory from "../schemas/productos/productos.factory.js"

const productosDAO = productosFactory.getDAO();

export const getAllProducts = async (req, res) => {
  const productos = await productosDAO.find();
  res.status(200).json({ data: productos })
};

export const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, foto, codigo, stock } = req.body;
  const nuevoProducto = new ProductosDTO(nombre, descripcion, codigo, foto, precio, stock)
  // TODO: Verificar que no exista
  const productos = await productosDAO.create(nuevoProducto);
  return res.status(201).json({ data: productos, message: "El producto ha sido creado" });
};