import { ObjectId } from "mongo";
import { Coche, Concesionario, Vendedor } from "../types.ts";


export type ConcesionarioSchema = Omit<Concesionario, "id" | "vendedores"> & {
    _id: ObjectId,
    vendedores: ObjectId[],
}

export type VendedorSchema = Omit<Vendedor, "id" | "coches"> & {
    _id: ObjectId,
    coches: ObjectId[],
}

export type CocheSchema = Omit<Coche, "id"> & {
    _id: ObjectId,
}