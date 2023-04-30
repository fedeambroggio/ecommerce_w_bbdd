import { ProductosDTO } from '../schemas/productos/productos.dto.js';
import productosFactory from "../schemas/productos/productos.factory.js"

const productosDAO = productosFactory.getDAO();

export const getAllProducts = async (req, res) => {
  const productos = await productosDAO.find();
  res.status(200).json({ data: productos })
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const producto = await productosDAO.findById(id);
  if (producto) {
    res.status(200).json({ data: producto })
  } else {
    res.status(200).json({ data: [], message: `El producto ${id} no ha sido encontrado` })
  }
};

export const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, foto, codigo, stock } = req.body;
  const nuevoProducto = new ProductosDTO(nombre, descripcion, codigo, foto, precio, stock)
  // TODO: Verificar que no exista
  const productos = await productosDAO.create(nuevoProducto);
  return res.status(201).json({ data: productos, message: "El producto ha sido creado" });
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  const productoDeleted = await productosDAO.delete(id);
  if (productoDeleted) {
    return res.status(201).json({ data: productoDeleted, message: "El producto ha sido eliminado" });
  } else {
    return res.status(200).json({ data: [], message: `El producto ${id} no ha sido encontrado` })
  }
};

export const modifyProductById = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, foto, codigo, stock } = req.body;

  const productoUpdated = await productosDAO.update(id, { nombre, descripcion, precio, foto, codigo, stock });

  if (productoUpdated) {
    return res.status(201).json({ data: productoUpdated, message: "El producto ha sido actualizado" });
  } else {
    return res.status(200).json({ data: [], message: `El producto ${id} no ha sido encontrado` })
  }
};