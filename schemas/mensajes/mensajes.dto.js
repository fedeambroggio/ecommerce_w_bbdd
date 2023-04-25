export class AutorDTO {
    constructor(_id, _nombre, _apellido, _edad, _alias, _avatar) {
        this.id = _id;
        this.nombre = _nombre;
        this.apellido = _apellido;
        this.edad = _edad;
        this.alias = _alias;
        this.avatar = _avatar;
    }
}

export class MensajesDTO {
    constructor(_autor, _texto, _hora) {
        this.autor = _autor;
        this.texto = _texto;
        this.hora = _hora;
    }
}