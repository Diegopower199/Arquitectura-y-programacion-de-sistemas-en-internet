import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getUser } from "./resolvers/get.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { addUser, addTransaction } from "./resolvers/post.ts";

const router = new Router();

router
    .get("/getUser/:id", getUser)
    .post("/addUser", addUser)
    .delete("/deleteUser/:id", deleteUser)
    .post("/addTransaction", addTransaction);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const a = 3;

await app.listen({ port: 8000 });