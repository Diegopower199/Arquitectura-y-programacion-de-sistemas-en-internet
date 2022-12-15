
import { Slot } from "../types.ts";
import { ObjectId } from "mongo";

export type SlotSchema = Omit<Slot, "id"> & {
  _id: ObjectId;
};