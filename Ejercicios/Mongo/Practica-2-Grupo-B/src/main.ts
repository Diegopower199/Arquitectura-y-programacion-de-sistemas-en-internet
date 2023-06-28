import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { deleteUserConEmail } from "./resolvers/delete.ts";
import { postTransaction, postUser } from "./resolvers/post.ts";
import { getUser } from "./resolvers/get.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();

router.get("/test", (context) => (context.response.body = "HOLA"))
      .get("/getUser/:parametro", getUser)
      .post("/addUser", postUser)   
      .delete("/deleteUser/:email", deleteUserConEmail)
      .post("/addTransaction", postTransaction)

// Asi se debe hacer -> router.delete("/deleteUser", deleteAlgoConID)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });