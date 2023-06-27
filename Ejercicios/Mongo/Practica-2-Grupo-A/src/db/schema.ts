import { ObjectId } from "mongo";
import { Coche } from "../types.ts";


/*export type schema1 = Omit<tipo1, "id"> & {
    _id: ObjectId;
};*/

export type CocheSchema = Omit<Coche, "id"> & {
    _id: ObjectId
}
