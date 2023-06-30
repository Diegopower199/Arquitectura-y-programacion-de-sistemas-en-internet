import { ObjectId } from "mongo"
import { getQuery } from "query_helpers"
import { RouterContext } from "router"
import { eventosCollection } from "../db/dbconnection.ts"
import { AgendaSchema } from "../db/schemas.ts"

type GetEventosContext = RouterContext<
    "/events",
    Record<string | number, string | undefined>,
    Record<string, any>>

export const getEventos = async(context: GetEventosContext) => {
    try {
        const params = getQuery(context, {mergeParams: true})
        if(params?.sort === "desc") {
            const eventos = await eventosCollection.find({}).sort({fecha: -1}).toArray()
            context.response.body = eventos.map((evento) => ({
                id: evento._id.toString(),
                titulo: evento.titulo,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
                horaInicio: evento.horaInicio,
                horaFinal: evento.horaFinal,
                invitados: evento.invitados
            }))
            return
        } else if(params?.sort === "asc") {
            const eventos = await eventosCollection.find({}).sort({fecha: 1}).toArray()
            context.response.body = eventos.map((evento) => ({
                id: evento._id.toString(),
                titulo: evento.titulo,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
                horaInicio: evento.horaInicio,
                horaFinal: evento.horaFinal,
                invitados: evento.invitados
            }))
        }

        const eventos = await eventosCollection.find({}).toArray()
        context.response.body = eventos.map((evento) => ({
            id: evento._id.toString(),
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            fecha: evento.fecha,
            horaInicio: evento.horaInicio,
            horaFinal: evento.horaFinal,
            invitados: evento.invitados
        }))
    } catch (e) {
        console.log(e)
        context.response.status = 500
    }
}

type GetEventoContext = RouterContext<
    "/event/:id",
    {
        id: string
    } &
    Record<string | number, string | undefined>,
    Record<string, any>>

export const getEvento = async(context: GetEventoContext) => {
    try {
        if(context.params?.id) {
            const evento: AgendaSchema | undefined = await eventosCollection.findOne({_id: new ObjectId(context.params.id)})
            if(evento) {
                context.response.body = evento
                return
            } else {
                context.response.status = 404
                context.response.body = {message: "No hay eventos"}
            }
        }
    } catch(e) {
        console.log(e)
        context.response.status = 500
    }
}