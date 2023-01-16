import knexlib from "knex";

class ClientSQL {
    constructor(_config, _tableName) {
        this.knex = knexlib(_config);
        this.tableName = _tableName;
    }

    // createTableForProducts() {
    //     this.knex.schema.dropTableIfExists(this.tableName)
    //         .finally(() => {
    //             this.knex.schema.createTable(this.tableName, table => {
    //                 table.increments('id').primary()
    //                 table.string('nombre')
    //                 table.string('descripcion')
    //                 table.string('codigo')
    //                 table.string('foto')
    //                 table.float('precio')
    //                 table.integer('stock')
    //                 table.timestamp('timestamp').defaultTo(this.knex.fn.now())
    //             })
    //             .then((res) => console.log(res))
    //         })
    // }

    createTableForMessages() {
        this.knex.schema.dropTableIfExists(this.tableName)
            .finally(() => {
                this.knex.schema.createTable(this.tableName, table => {
                    table.increments('id').primary()
                    table.string('email')
                    table.string('mensaje')
                    table.timestamp('hora').defaultTo(new Date().toLocaleString())
                })
                .then((res) => console.log(res))
            })
    }

    addProducts(productos) {
        return this.knex(this.tableName)
            .insert(productos)
            .then((res) => res);
    }

    getAllProducts() {
        return this.knex(this.tableName).select("*");
    }

    getProductById(id) {
        return this.knex(this.tableName).where("id", id).first();
    }

    deleteProductById(id) {
        return this.knex.from(this.tableName).where("id", id).del();
    }

    updateProductById(id, data) {
        return this.knex.from(this.tableName).where("id", id).update(data);
    }

    addMessage(message) {
        return this.knex(this.tableName)
            .insert(message)
            .then((res) => res);
    }

    getAllMessages() {
        return this.knex(this.tableName).select("*");
    }

    close() {
        this.knex.destroy();
    }
}

export default ClientSQL;
