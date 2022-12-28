import { ObjectId } from "mongo";
import { Usuario, Mensaje } from "../types.ts";

export type UsuarioSchema = Omit<Usuario, "id" | "token"> & {
    _id: ObjectId;
};

export type MensajeSchema = Omit<Mensaje, "id"> & {
    _id: ObjectId;
};
