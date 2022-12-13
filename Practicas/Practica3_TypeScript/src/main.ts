import { Application, Router } from "oak";
import { deleteUser } from "./resolvers/delete.ts";
import { getBooks, getUser } from "./resolvers/get.ts";
import { addUser, addBook, addAuthor } from "./resolvers/post.ts";
import { updateCart } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addUser", addUser)
  .post("/addBook", addBook)
  .post("/addAuthor", addAuthor)
  .delete("/deleteUser", deleteUser)
  .put("/updateCart", updateCart)
  .get("/getUser/:id", getUser)
  .get("/getBooks", getBooks)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 6000 });