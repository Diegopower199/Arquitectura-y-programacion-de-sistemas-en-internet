import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { postTransaction, postUser } from "./resolvers/post.ts";
import { getUserWithParameters } from "./resolvers/get.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();


router.get("/getUser/:parametro", getUserWithParameters)
      .post("/addUser", postUser )
      .post("/addTransaction", postTransaction)
      .delete("/deleteUser/email", )

// Asi se debe hacer -> router.delete("/deleteUser", deleteAlgoConID)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });