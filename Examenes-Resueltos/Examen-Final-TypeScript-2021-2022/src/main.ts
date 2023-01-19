
import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { listMatches } from "./resolvers/get.ts";
import { getMatch } from "./resolvers/get.ts";
import { startMatch } from "./resolvers/post.ts";
import { setMatchData } from "./resolvers/put.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();

router.get("/test", (context) => (context.response.body = "HOLA"))
    //.put("/funcionPut", nombreFuncion)
    .get("/getMatch/:id", getMatch)
    .get("/listMatches", listMatches)
    .post("/startMatch", startMatch)
    .put("/setMatchData", setMatchData)



const app = new Application();



app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });