// CRUD MONGO
export default class CRUD_MongoDB {
    constructor(_schemaDAO) {
        this.schemaDAO = _schemaDAO;
    }

    async create(_content) {
        console.log("CREATE");
        const createdContent = new this.schemaDAO(_content);
        let responseSaved = await createdContent.save();
        console.log(responseSaved);
        return responseSaved._id;
    }

    async readMessages(_filters = {}) {
        console.log("READ");
        let contentFind = await this.schemaDAO.find(_filters, { _id: 1, author: 1, text: 1, hora: 1 });
        console.log(contentFind);
        return contentFind;
    }

    async update(_filters, _update) {
        console.log("UPDATE");
        let responseContentUpdated = await this.schemaDAO.updateOne(
            _filters,
            _update
        );
        console.log(responseContentUpdated);
        return responseContentUpdated;
    }

    async delete(_filters) {
        console.log("DELETE");
        let responseContentDeleted = await this.schemaDAO.deleteOne(_filters);
        console.log(responseContentDeleted);
        return responseContentDeleted;
    }
}
