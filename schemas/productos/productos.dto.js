class ProductosDTO {
    constructor(_id, _nombre, _descripcion, _codigo, _foto, _precio, _stock) {
      this.id = _id;
      this.nombre = _nombre;
      this.descripcion = _descripcion;
      this.codigo = _codigo;
      this.foto = _foto;
      this.precio = _precio;
      this.stock = _stock;
    }
}
class ProductosEntryDTO {
    constructor(_nombre, _descripcion, _codigo, _foto, _precio, _stock) {
      this.nombre = _nombre;
      this.descripcion = _descripcion;
      this.codigo = _codigo;
      this.foto = _foto;
      this.precio = _precio;
      this.stock = _stock;
    }
}

export {ProductosDTO, ProductosEntryDTO}