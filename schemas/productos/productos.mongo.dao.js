import { ProductosModel } from "./productos.schema.js";
import { ProductosDTO, ProductosEntryDTO } from "./productos.dto.js";

export class ProductosMongoDAO {
    async create(data) {
        const productDTO = new ProductosEntryDTO(data.nombre, data.descripcion, data.codigo, data.foto, data.precio, data.stock)
        const entity = new ProductosModel(productDTO);
        return entity.save();
    }

    async findById(id) {
        const prod = await ProductosModel.find({ _id: id });
        console.log("prod", prod)
        if (prod.length === 0) {
            return null;
        }

        return new ProductosDTO(prod[0]._id, prod[0].nombre, prod[0].descripcion, prod[0].codigo, prod[0].foto, prod[0].precio, prod[0].stock)
    }

    async find(query) {
        const productos = await ProductosModel.find(query);
        const productosDTO = productos.map(prod => {
            return new ProductosDTO(prod._id, prod.nombre, prod.descripcion, prod.codigo, prod.foto, prod.precio, prod.stock)
        })
        return productosDTO
    }

    async update(id, data) {
        const productDTO = new ProductosDTO(id, data.nombre, data.descripcion, data.codigo, data.foto, data.precio, data.stock)
        return ProductosModel.findByIdAndUpdate(id, productDTO, { new: true });
    }

    async delete(id) {
        return ProductosModel.findByIdAndDelete(id);
    }
}
