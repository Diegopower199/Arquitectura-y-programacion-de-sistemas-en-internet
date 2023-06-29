import { ComentarioSchema } from "../db/schema.ts";


export const Comentario = {
    _id: (parent: ComentarioSchema): string => parent._id.toString(),
}