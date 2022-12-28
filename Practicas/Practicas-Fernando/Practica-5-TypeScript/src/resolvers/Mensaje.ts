import { MensajeSchema } from "../db/schema.ts";

export const Mensaje = {
    id: (parent: MensajeSchema): string => parent._id.toString(),
}