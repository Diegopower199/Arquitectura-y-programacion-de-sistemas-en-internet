import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { getAuthorWithId, getAuthors, getBooks, getBooksWithId, getPressHouseWithId, getPressHouses } from "./resolvers/get.ts";
import { postAuthor, postBook, postPressHouse } from "./resolvers/post.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();


router.get("/books", getBooks)
      .get("/authors", getAuthors)
      .get("/presshouses", getPressHouses)
      .get("/book/:id", getBooksWithId)
      .get("/author/:id", getAuthorWithId)
      .get("/presshouse/:id", getPressHouseWithId)


router.post("/addPressHouse", postPressHouse)
      .post("/addAuthor", postAuthor)
      .post("/addBook", postBook)


/*router.delete("/deletePressHouse/:id")
      .delete("/deleteAuthor/:id", )
      .delete("/deleteBook/:id", )*/



const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });