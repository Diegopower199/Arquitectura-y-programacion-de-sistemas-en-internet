import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";
import { Vendedor } from "./resolvers/Vendedor.ts";
import { Concesionario } from "./resolvers/Concesionario.ts";

const resolvers = {
  Query,
  Mutation,
  Vendedor,
  Concesionario,
};

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
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);

//deno run --import-map=./import_map.json --allow-all src/main.ts