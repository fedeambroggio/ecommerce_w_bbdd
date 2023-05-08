
import { buildSchema } from "graphql";
import { GraphQLDateTime } from 'graphql-scalars';

const ProductosGraphQLSchema = buildSchema(`
  scalar DateTime

  type Producto {
    id: ID!
    nombre: String
    descripcion: String
    codigo: String
    foto: String
    precio: Int
    stock: Int
    timestamp: DateTime
  }

  input ProductoInput {
    nombre: String
    descripcion: String
    codigo: String
    foto: String
    precio: Int
    stock: Int
    timestamp: DateTime
  }
  type Query {
    getProductById(id: ID!): Producto
    getAllProducts(campo: String, valor: String): [Producto]
  }
  type Mutation {
    addProduct(data: ProductoInput): Producto
    modifyProductById(id: ID!, data: ProductoInput): Producto
    deleteProductById(id: ID!): Producto
  }
`);

export { ProductosGraphQLSchema };