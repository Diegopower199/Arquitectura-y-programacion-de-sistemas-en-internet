import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { PostEvent } from "./resolvers/post.ts"
import { getEvento, getEventos } from "./resolvers/get.ts"
import { DeleteEventos } from "./resolvers/delete.ts"
import { PutEvento } from "./resolvers/put.ts"

const router = new Router()
router
    .post("/addEvent", PostEvent)
    .get("/events", getEventos)
    .get("/event/:id", getEvento)
    .delete("/deleteEvent/:id", DeleteEventos)
    .put("/updateEvent", PutEvento)

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

const port = Number(Deno.env.get("PORT"))

await app.listen({port})