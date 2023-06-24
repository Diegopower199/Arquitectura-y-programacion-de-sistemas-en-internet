import { Application, Context, Router } from "oak";
import { getCharacter, getCharacterByIds } from "./resolvers/get.ts";
import { config } from "std/dotenv/mod.ts"


await config({ export: true, allowEmptyValues: true });


const router = new Router();


router.get("/character/:id", getCharacter)
      .get("/charactersByIds/:ids", getCharacterByIds)
      .get("/characterByName/:name", getCharacterByName)
      .get("/charactersByName/:name", getCharactersByName)

      

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: 3000 });