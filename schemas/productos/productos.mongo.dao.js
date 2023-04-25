import { ProductosModel } from "./productos.schema.js";
import { ProductosDTO } from "./productos.dto.js";

export class ProductosMongoDAO {
    async create(data) {
        const productDTO = new ProductosDTO(data.nombre, data.descripcion, data.codigo, data.foto, data.precio, data.stock)
        const entity = new ProductosModel(productDTO);
        return entity.save();
    }

    async findById(id) {
        const prod = ProductosModel.findById(id);
        return new ProductosDTO(prod.nombre, prod.descripcion, prod.codigo, prod.foto, prod.precio, prod.stock)
    }

    async find(query) {
        const productos = ProductosModel.find(query);
        const productosDTO = productos.map(prod => {
            return new ProductosDTO(prod.nombre, prod.descripcion, prod.codigo, prod.foto, prod.precio, prod.stock)
        })
        return productosDTO
    }

    async update(id, data) {
        const productDTO = new ProductosDTO(data.nombre, data.descripcion, data.codigo, data.foto, data.precio, data.stock)
        return ProductosModel.findByIdAndUpdate(id, productDTO, { new: true });
    }

    async delete(id) {
        return ProductosModel.findByIdAndDelete(id);
    }
}
