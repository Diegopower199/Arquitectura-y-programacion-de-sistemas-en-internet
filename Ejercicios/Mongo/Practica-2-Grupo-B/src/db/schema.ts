import { ObjectId } from "mongo";
import { Transaction, User } from "../types.ts";


/*export type schema1 = Omit<tipo1, "id"> & {
    _id: ObjectId;
};*/

export type UserSchema = Omit<User, "id"> & {
    _id: ObjectId,
}

export type TransactionSchema = Omit<Transaction, "id" | "id_sender" | "id_reciber"> & {
    _id: ObjectId,
    id_sender: ObjectId,
    id_reciber: ObjectId

}