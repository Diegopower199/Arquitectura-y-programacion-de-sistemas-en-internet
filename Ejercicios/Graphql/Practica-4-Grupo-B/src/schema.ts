import { gql } from "graphql_tag";

export const typeDefs = gql`

type Concesionario {
    _id: ID!
    localidad: String!
    vendedores: [Vendedor!]!
}

type Vendedor {
    _id: ID!
    nombre: String!
    dni: String!
    coches: [Coche!]!
}

type Coche {
    _id: ID!,
    matricula: String!
    marca: String!
    asientos: Int!
    precio: Float!
}

type Query {
    getCochesPorId(ids: [ID!]!): [Coche!]!
    getCochesPorRangoDePrecios(precioMinimo: Float!, precioMaximo: Float!): [Coche!]! 
    getVendedorPorId(ids: [ID!]!): [Vendedor!]!
    getVendedorPorNombre(nombre: String!): [Vendedor!]!
    getConcesionarioPorId(ids: [ID!]!): [Concesionario!]!
    getConcesionarioPorLocalidad (localidad: String!): [Concesionario!]!
}

type Mutation {
    addVendedor(nombre: String!, dni: String!): Vendedor!
    addCoche(matricula: String!, marca: String!, asientos: Int!, precio: Float!): Coche!
    addConcesionario (localidad: String!): Concesionario!

    addCocheAVendedor(idCoche: ID!, idVendedor: ID!): Vendedor!
    addVendedorAConcesionario(idVendedor: ID!, idConcesionario: ID!): Concesionario!
}
`;
