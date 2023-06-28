import { gql } from "graphql_tag";

export const typeDefs = gql`

type Query {
  
}

type Mutation {

}
`;

/*
enum enumDeAlgo {
  primera
  segunda
}

type algo {
  _id: ID!
  tipoAlgo: enumDeAlgo!
}

type Query {
  books: [Book!]!
  book (id: ID!): Book!  
  booksWithId (ids: [ID!]!): [Book!]!
}

type Mutation {
  deleteBook(id: ID!): Book!
  updateBooksMore2000: Int!
}
*/