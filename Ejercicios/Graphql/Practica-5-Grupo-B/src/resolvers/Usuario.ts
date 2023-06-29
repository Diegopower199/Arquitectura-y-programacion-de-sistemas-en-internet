import { UsuarioSchema } from "../db/schema.ts";


export const Usuario = {
    _id: (parent: UsuarioSchema): string => parent._id.toString()
}