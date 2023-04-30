import axios from 'axios';
import { startServer } from '../server.js';

const SERVER_URL = 'http://localhost:8080'
const API_URL = '/api/productos'
const BASE_URL = SERVER_URL + API_URL;
const VIEW_DATA = false; //set this to true if you want data details

(async () => {
  try {
    let testProductId;
    //GET ALL PRODUCTS
    const getAllProducts = await axios.get(`${BASE_URL}/`);
    console.log("GET ALL PRODUCTS. OK!");
    if (VIEW_DATA) {
      console.log(getAllProducts.data.data);
    }

    //ADD PRODUCT
    const addProduct = await axios.post(`${BASE_URL}/`, {
      "nombre": "Camiseta test",
      "descripcion": "Descripcion test",
      "codigo": "ARG999",
      "foto": "https://cdn.shopify.com/s/files/1/0567/2907/5873/products/river2022.png?v=1660826121",
      "precio": 9999,
      "stock": 99,
      "timestamp": 1681065299435
    });
    console.log("ADD PRODUCT. OK!");
    testProductId = addProduct.data.data['_id'];
    if (VIEW_DATA) {
      console.log(addProduct.data.data);
    }

    //GET PRODUCT BY ID
    const getProductById = await axios.get(`${BASE_URL}/${testProductId}`);
    console.log("GET PRODUCT BY ID. OK!");
    if (VIEW_DATA) {
      console.log(getProductById.data.data);
    }

    //MODIFY PRODUCT BY ID
    const modifyProductById = await axios.put(`${BASE_URL}/${testProductId}`, {
      "nombre": "Camiseta test modified",
      "descripcion": "Descripcion test modified",
      "codigo": "ARG999",
      "foto": "https://cdn.shopify.com/s/files/1/0567/2907/5873/products/river2022.png?v=1660826121",
      "precio": 9999,
      "stock": 99,
      "timestamp": 1681065299435
    });
    console.log("MODIFY PRODUCT BY ID. OK!");
    if (VIEW_DATA) {
      console.log(modifyProductById.data.data);
    }

    //GET PRODUCT BY ID
    const getProductById2 = await axios.get(`${BASE_URL}/${testProductId}`);
    console.log("GET PRODUCT BY ID. OK!");
    if (VIEW_DATA) {
      console.log(getProductById2.data.data);
    }

    //DELETE PRODUCT BY ID
    const deleteProductById = await axios.delete(`${BASE_URL}/${testProductId}`);
    console.log("DELETE PRODUCT BY ID. OK!");
    if (VIEW_DATA) {
      console.log(deleteProductById.data.data);
    }

    //GET ALL PRODUCTS
    const getAllProducts2 = await axios.get(`${BASE_URL}/`);
    console.log("GET ALL PRODUCTS. OK!");
    if (VIEW_DATA) {
      console.log(getAllProducts2.data.data);
    }
  } catch (error) {
    console.log(error);
  }
})();
