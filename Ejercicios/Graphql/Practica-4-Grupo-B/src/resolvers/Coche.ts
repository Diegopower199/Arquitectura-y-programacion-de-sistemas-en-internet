import { CocheSchema } from "../db/schema.ts";

export const Coche = {
    _id: (parent: CocheSchema): string => parent._id.toString(),
    
}