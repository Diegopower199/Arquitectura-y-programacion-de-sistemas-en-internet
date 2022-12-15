import { slotsCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Slot } from "../types.ts";

const isValidDate = (
    year: number,
    month: number,
    day: number,
    hour: number
  ): boolean => {
    const date = new Date(year, month, day, hour);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day &&
      date.getHours() === hour
    );
  };

export const Mutation = {
  addSlots: async (_: unknown, args: {day: number, month: number, year: number, hour: number}): Promise<Slot> => {
    try {
        if(!isValidDate(args.year, args.month, args.day, args.hour)) throw new Error("Datos de día, mes año y hora incorrectos");
      const exists = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour})
      if(exists) throw new Error("Slot already exists");
      
      const slot = await slotsCollection.insertOne({
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
        available: false // ocupado
        });
        return {
            day: args.day,
            month: args.month,
            year: args.year,
            hour: args.hour,
            available: false
        };

    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  removeSlots: async (_: unknown, args: {day: number, month: number, year: number, hour: number}): Promise<Slot> => {
    try {
        if(!isValidDate(args.year, args.month, args.day, args.hour)) throw new Error("Datos de día, mes año y hora incorrectos");
      const exists = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour})
      if(!exists) {
        throw new Error("Slot not exists") 
      } else if(exists && exists.available) {
          const removedSlot = await slotsCollection.deleteOne({
            day: args.day,
            month: args.month,
            year: args.year,
            hour: args.hour,
        });
  
        return {...exists}; 
      }

      return {...exists};
      
      

    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  bookSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number, dni: string}): Promise<Slot> => {
    try {
        if(!isValidDate(args.year, args.month, args.day, args.hour)) throw new Error("Datos de día, mes año y hora incorrectos");
      const exists = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour})
      if(exists && !exists.available){
        throw new Error("Slot is not available");
      }
      const updateSlot = await slotsCollection.updateOne({day: args.day, month: args.month, year: args.year, hour: args.hour}, {$set: {available: false}});
        return {
            day: args.day,
            month: args.month,
            year: args.year,
            hour: args.hour,
            available: false,
            dni: args.dni
        };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};