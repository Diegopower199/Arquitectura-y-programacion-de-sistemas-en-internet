import { RouterContext } from "router"
import {ObjectId} from "mongo"
import { eventosCollection } from "../db/dbconnection.ts"
import { getQuery } from "query_helpers"
import { AgendaSchema } from "../db/schemas.ts"

type DeleteEventosContext = RouterContext<
    "/deleteEvent/:id",
    {
        id: string
    } &
    Record<string | number, string | undefined>,
    Record<string, any>>

export const DeleteEventos = async(context: DeleteEventosContext) => {
    try {
        if(context.params?.id) {
            const count = await eventosCollection.deleteOne({_id: new ObjectId(context.params?.id)})
            if(count) {
                context.response.body = {message: "Borrado correctamente"}
            } else {
                context.response.status = 404
            }
        }

    } catch(e) {
        console.log(e)
        context.response.status = 500
    }
}