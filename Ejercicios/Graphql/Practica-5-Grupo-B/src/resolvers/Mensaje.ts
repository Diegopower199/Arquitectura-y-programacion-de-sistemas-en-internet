import { MensajeSchema } from "../db/schema.ts";


export const Mensaje = {
    _id: (parent: MensajeSchema): string => parent._id.toString()
}