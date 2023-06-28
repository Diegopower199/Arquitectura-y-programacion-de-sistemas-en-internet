import { Application, Context, Router } from "oak";

import { config } from "std/dotenv/mod.ts";
import { postCoche } from "./resolvers/post.ts";
import { getCar } from "./resolvers/get.ts";
import { deleteCocheConID } from "./resolvers/delete.ts";
import { putAskCar, putReleaseCar } from "./resolvers/put.ts";
await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));


const router = new Router();

router.get("/test", (context) => (context.response.body = "HOLA"))
      .post("/addCar", postCoche)
      .delete("/removeCar/:id", deleteCocheConID)
      .get("/car/:id", getCar)
      .put("/askCar", putAskCar)
      .put("/releaseCar/:id", putReleaseCar)
    

// Asi se debe hacer -> router.delete("/deleteUser", deleteAlgoConID)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: port });