import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts"
import { AgendaSchema } from "../db/schemas.ts"
import { Evento } from "../types.ts"
import { eventosCollection } from "../db/dbconnection.ts"

type PostEventContext = RouterContext<
    "/addEvent", 
    Record<string | number, string | undefined>,
    Record<string, any>>

export const PostEvent = async(context: PostEventContext) => {
    try {
        const result = context.request.body({type: "json"})
        const value = await result.value
        if(!value?.titulo || !value?.fecha || !value?.horaInicio || !value?.horaFinal || !value?.invitados) {
            context.response.status = 400
            context.response.body = {message: "Faltan valores"}
            return
        }

        const evento: Partial<Evento> = {
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: new Date(value.fecha),
            horaInicio: value.horaInicio,
            horaFinal: value.horaFinal,
            invitados: value.invitados
        }

        const solapeTemporal = await eventosCollection.findOne({fecha: value.fecha})
        if(solapeTemporal) {
            context.response.status = 400
            context.response.body = {message: "Solape temporal entre eventos"}
        }

        if(value.horaInicio >= value.horaFinal) {
            context.response.status = 400
            context.response.body = {message: "Hora inicio mayor que hora final"}
            return
        }

        const id = await eventosCollection.insertOne(evento as AgendaSchema)
        evento.id = id.toString()
        context.response.body = {
            id: evento.id,
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            fecha: evento.fecha,
            horaInicio: evento.horaInicio,
            horaFinal: evento.horaFinal,
            invitados: evento.invitados
        }

        context.response.status = 200

    } catch(e) {
        console.log(e)
        context.response.status = 500
    }
}
