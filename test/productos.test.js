import { strict as assert } from 'assert'
import supertest from 'supertest';
import * as chai from 'chai';

const expect = chai.expect
const request = supertest('http://localhost:8080/api/productos');

describe("Productos API", () => {
    let initialTestProductId;
    let testProductData;
    let testProductDataModified;
    let createdTestProductId;
    before( async () => {
        testProductData = {
            "nombre": "Camiseta test",
            "descripcion": "Descripcion test",
            "codigo": "ARG999",
            "foto": "https://cdn.shopify.com/s/files/1/0567/2907/5873/products/river2022.png?v=1660826121",
            "precio": 9999,
            "stock": 99,
            "timestamp": 1681065299435
        }
        testProductDataModified = {
            "nombre": "Camiseta test modified",
            "descripcion": "Descripcion test modified",
            "codigo": "ARG999",
            "foto": "https://cdn.shopify.com/s/files/1/0567/2907/5873/products/river2022.png?v=1660826121",
            "precio": 9999,
            "stock": 99,
            "timestamp": 1681065299435
        }

        const response = await request.post("/").send(testProductData);
        initialTestProductId = response.body.data._id;
    });
    after( async () => {
        //Delete product created during test
        await request.delete(`/${createdTestProductId}`)
    })
    

    it("Debe devolver todos los productos", async () => {
        let response = await request.get('/')
        expect(response.status).to.eql(200);
        expect(response.body.data.length).to.be.gt(0);
    })

    it("Debe crear un producto", async () => {
        let response = await request.post('/').send(testProductData)
        expect(response.status).to.eql(201);
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.include({
            nombre: testProductData.nombre,
            descripcion: testProductData.descripcion,
            precio: testProductData.precio,
            foto: testProductData.foto,
            codigo: testProductData.codigo,
            stock: testProductData.stock
        })
        createdTestProductId = response.body.data['_id']
    })
    
    it("Debe devolver el producto creado en la funcion before()", async () => {
        let response = await request.get(`/${initialTestProductId}`)
        expect(response.status).to.eql(200);
        expect(response.body.data).to.include({
            nombre: testProductData.nombre,
            descripcion: testProductData.descripcion,
            precio: testProductData.precio,
            foto: testProductData.foto,
            codigo: testProductData.codigo,
            stock: testProductData.stock
        })
    })

    it("Debe modificar el producto creado en la funcion before()", async () => {
        let response = await request.put(`/${initialTestProductId}`).send(testProductDataModified)
        expect(response.status).to.eql(201);
        expect(response.body.data).to.include({
            nombre: testProductDataModified.nombre,
            descripcion: testProductDataModified.descripcion,
            precio: testProductDataModified.precio,
            foto: testProductDataModified.foto,
            codigo: testProductDataModified.codigo,
            stock: testProductDataModified.stock
        })
    })

    it("Debe eiminar el producto creado en la funcion before()", async () => {
        let response = await request.delete(`/${initialTestProductId}`)
        expect(response.status).to.eql(201);
        expect(response.body.data['_id']).to.eql(initialTestProductId);
        expect(response.body.message).to.eql('El producto ha sido eliminado');
    })
});