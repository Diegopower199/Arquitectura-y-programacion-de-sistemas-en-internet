import { gql } from "graphql_tag";

export const typeDefs = gql`

type Slot {
    _id: ID!
    day: Int!,
    month: Int!,
    year: Int!,
    hour: Int!,
    available: Boolean!,
    dni: String!,
}

type Query {
    availableSlots (day: Int, month: Int!, year: Int!): [Slot!]!
}

type Mutation {
    addSlot (day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
    removeSlot (day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
    bookSlot (dni: String!, day: Int!, month: Int!, year: Int!, hour: Int!): Slot!
}
`;


/*

type Author {
    _id: ID!
    name: String!
    lang: String!
    books: [Book!]!
}

type Query {
    presshouses: [PressHouse!]!
    book (id: ID!): Book!
}

type Mutation {
    updateBooksMore2000: Int!
    updateTitleBook (title: String!, titleNew: String!): Book!
}
*/