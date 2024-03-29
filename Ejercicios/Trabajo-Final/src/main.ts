import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { config } from "std/dotenv/mod.ts";
await config({ export: true, allowEmptyValues: true });

import { Query } from "./resolvers/Query.ts";
import { Mutation } from "./resolvers/Mutation.ts";
import { typeDefs } from "./schema.ts";
import { UsuarioResolver } from "./resolvers/Usuario.ts";
import { Comentario } from "./resolvers/Comentario.ts";
import { Post } from "./resolvers/Post.ts";

const resolvers = {
  Query,
  Mutation,
  Usuario: UsuarioResolver,
  Comentario,
  Post
};

const port = Number(Deno.env.get("PORT"));

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: port,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:${port}/graphql`);