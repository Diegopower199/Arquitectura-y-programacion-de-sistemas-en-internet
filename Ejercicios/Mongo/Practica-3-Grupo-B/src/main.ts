import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { postUser } from "./resolvers/post.ts";
import { postAuthor } from "./resolvers/post.ts";
import { postBook } from "./resolvers/post.ts";
import { deleteUserConID } from "./resolvers/delete.ts";
import { putUpdateCart } from "./resolvers/put.ts";
import { getBooks } from "./resolvers/get.ts";
import { getUser } from "./resolvers/get.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();

router.get("/test", (context) => (context.response.body = "HOLA"))
      .post("/addUser", postUser)
      .post("/addAuthor", postAuthor)
      .post("/addBook", postBook)
      .delete("/deleteUser/:id", deleteUserConID)
      .put("/updateCart", putUpdateCart)
      .get("/getBooks", getBooks)
      .get("/getUser/:id", getUser)

// Asi se debe hacer -> router.delete("/deleteUser", deleteAlgoConID)



const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });