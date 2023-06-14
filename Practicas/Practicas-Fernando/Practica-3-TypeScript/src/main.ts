import { Application, Router } from "oak";

import { postUsers } from "./resolvers/postUser.ts";
import { postAuthors } from "./resolvers/postAuthor.ts";
import { postBooks } from "./resolvers/postBook.ts";
import { deleteUser } from "./resolvers/deleteUser.ts";
import { updateCart } from "./resolvers/putCart.ts";
import { getBooks } from "./resolvers/getBooks.ts";
import { getUser } from "./resolvers/getUser.ts";


const router = new Router();

router
  .post("/addUser", postUsers)
  .post("/addAuthor", postAuthors)
  .post("/addBook/:id", postBooks)
  .delete("/deleteUser", deleteUser)
  .put("/updateCart/:id_user/:id_book", updateCart)
  .get("/getBooks", getBooks)
  .get("/getUser/:id", getUser)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
