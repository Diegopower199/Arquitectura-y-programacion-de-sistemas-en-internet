import { gql } from "graphql_tag";

export const typeDefs = gql`

type PressHouse {
    _id: ID!
    name: String!
    web: String!
    country: String!
    books: [Book!]!
}

type Author {
    _id: ID!
    name: String!
    lang: String!
    books: [Book!]!
}

type Book {
    _id: ID!
    title: String!
    author: Author!
    pressHouse: PressHouse!
    year: Int!
} 

enum TipoUsuario {
    REGISTRADO
    MODO_INVITADO
}

type User {
    _id: ID!
    name: String!
    surname: String!
    dni: String!
    birthDate: String!
    dateCreate: String!
    tipoUsuario: TipoUsuario!
    username: String!
    password: String
    token: String
    autoresQueSigue: [Author!]!
    librosQueTiene: [Book!]!
    librosQueLeGustariaTener: [Book!]!
}

type Query {
    books: [Book!]!
    authors: [Author!]!
    presshouses: [PressHouse!]!
    book (id: ID!): Book!
    author (id: ID!): Author!
    presshouse (id: ID!): PressHouse!
    booksWithId (ids: [ID!]!): [Book!]!
    authorsWithId (ids: [ID!]!): [Author!]!
    pressHousesWithId (ids: [ID!]!): [PressHouse!]!
    
}

type Mutation {
    addPressHouse (name: String!, web: String!, country: String!, books: [ID!]!): PressHouse!
    addAuthor (name: String!, lang: String!, books: [ID!]!): Author!
    addBook (title: String!, author: ID!, pressHouse: ID!, year: Int!): Book!
    deletePressHouse(id: ID!): PressHouse!
    deleteAuthor(id: ID!): Author!
    deleteBook(id: ID!): Book!

    updatePressHouse (idPressHouse: ID!, name: String, web: String!, country: String!): PressHouse!
    updateBooksMore2000: Int!
    updateTitleBook (title: String!, titleNew: String!): Book!
    updateAuthorOfTheBook (authorDelete: ID!, authorAdd: ID!, title: String!): Book!
}
`;
