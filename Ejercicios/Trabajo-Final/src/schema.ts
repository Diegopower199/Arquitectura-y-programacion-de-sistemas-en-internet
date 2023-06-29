import { gql } from "graphql_tag";

export const typeDefs = gql`

scalar Date

enum tipoUsuario {
  REGISTRADO_NORMAL
  REGISTRADO_AUTOR
}
type Usuario {
  _id: ID!
  username: String!
  password: String!
  fechaCreacion: Date!
  tipoUsuario: tipoUsuario!
  postCreados: [Post!]!
}

type Post {
  _id: ID!
  title: String
  contenido: String!
  postUsuario: ID!
  comentarios: [Comentario!]!
  fechaPost: Date!

}

type Comentario {
  _id: ID!
  idUsuario: ID!
  contenido: String!
  fechaCreacion: Date!
}

type Query {
  leerPost (idPost: ID!, title: String!): Post!
  leerComentario (idComentario: ID!, title: String!): Comentario!
  leerPosts: [Post!]!
  leerComentarios: [Comentario!]!
  verToken(token: String!): Usuario!
}

type Mutation {
  escribirComentarios(idPost: ID!, token: String! contenido: String!): Comentario!
  escribirPost(token: String!, title: String!, contenido: String!): Post!

  updateComentario(idPost: ID!, token: String!, contenido: String!): Comentario!
  updatePost(idPost: ID!, token: String!, titleNew: String, contenidoNew: String): Post!

  deleteComentario(idComentario: ID!, token: String!): Comentario!
  deletePost(idPost: ID!, token: String!): Post!

  createUser(username: String!, password: String!, tipoUsuario: tipoUsuario!): Usuario!
  login(username: String!, password: String!): String!
}
`;