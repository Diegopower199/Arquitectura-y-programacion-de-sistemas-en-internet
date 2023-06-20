import { ObjectId } from "mongo";
import { Transactions, User } from "../types.ts";

export type UserSchema = Omit<User, "id"> & {
    _id: ObjectId,
};

export type TransactionSchema = Omit<Transactions, "id" | "id_sender" | "id_reciber"> & {
    _id: ObjectId,
    id_sender: ObjectId,
    id_reciber: ObjectId,
}