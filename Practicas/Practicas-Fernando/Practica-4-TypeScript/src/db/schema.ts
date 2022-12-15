import { ObjectId } from "mongo";
import { Coche, Vendedor, Concesionario } from "../types.ts";

export type CocheSchema = Omit<Coche, "id"> & {
    _id: ObjectId;
};

export type VendedorSchema = Omit<Vendedor, "id" | "coches"> & {
    _id: ObjectId;
    coches: ObjectId[];
};

export type ConcesionarioSchema = Omit<Concesionario, "id" | "vendedores"> & {
    _id: ObjectId;
    vendedores: ObjectId[];
};