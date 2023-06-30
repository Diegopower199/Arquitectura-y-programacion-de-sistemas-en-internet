import { ObjectId } from "mongo"
import { RouterContext } from "router"
import { eventosCollection } from "../db/dbconnection.ts"
import { AgendaSchema } from "../db/schemas.ts"

type PutEventosContext = RouterContext<
    "/updateEvent",
    Record<string | number, string | undefined>,
    Record<string, any>>

export const PutEvento = async(context: PutEventosContext) => {
    try {
        const value = await context.request.body().value
        if(!value.id || !value.titulo || !value.descripcion || !value.fecha || !value.horaInicio || !value.horaFinal || !value.invitados) {
            context.response.status = 406
            return
        }

        const {id, titulo, descripcion, fecha, horaInicio, horaFinal, invitados} = value
        const evento = await eventosCollection.findOne({
            _id: new ObjectId(id)
        })

        if(!evento) {
            context.response.status = 404
            return
        }

        const eventoId = new ObjectId(value._id)
        const updatedEvent: Partial<AgendaSchema> = {
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: value.fecha,
            horaInicio: value.horaInicio,
            horaFinal: value.horaFinal,
            invitados: value.invitados
        }

        await eventosCollection.updateOne({id: eventoId}, {$set: updatedEvent})
        context.response.status = 200
        const {_id, ...res} = evento
        context.response.body = {...res}
    } catch(e) {
        console.log(e)
        context.response.status = 500
    }
}