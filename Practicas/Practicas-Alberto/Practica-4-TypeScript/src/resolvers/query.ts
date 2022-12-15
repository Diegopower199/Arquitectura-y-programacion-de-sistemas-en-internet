import { slotsCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Slot } from "../types.ts";

export const Query = {
  getSlots: async (): Promise<Slot[]> => {
    try {
      const slots = await slotsCollection.find().toArray();
      return slots.map((slot) => ({ ...slot, id: slot._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  availableSlots: async (_: unknown, args: {day: number, month: number, year: number}): Promise<Slot[]> => {
    try {
        if(args.day) {
            const slots = await slotsCollection.find({day: args.day, month: args.month, year: args.year}).toArray();
            return slots.map((slot) => ({ ...slot, id: slot._id.toString()}));
        } else {
            const slots = await slotsCollection.find({month: args.month, year: args.year}).toArray();
            return slots.map((slot) => ({ ...slot, id: slot._id.toString()}));
        }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
};