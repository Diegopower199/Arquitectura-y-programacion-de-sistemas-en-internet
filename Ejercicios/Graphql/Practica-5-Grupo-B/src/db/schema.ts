import { ObjectId } from "mongo";
import { Usuario, Mensaje } from "../types.ts";

export type UsuarioSchema = Omit<Usuario, "id" | "token"> & {
    _id: ObjectId;
};

export type MensajeSchema = Omit<Mensaje, "id" | "emisor" | "receptor"> & {
    _id: ObjectId,
    emisor: ObjectId,
    receptor: ObjectId
};
