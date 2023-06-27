import { ObjectId } from "mongo";
import { SlotsCollection } from "../db/dbconnection.ts";
import { SlotSchema } from "../db/schema.ts";



export const Mutation = {
    addSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number }): Promise<SlotSchema> => {
        try {
            const { day, month, year, hour } = args;

            const fechaActual = new Date();


            if (day < 1 || day > 31) {
                throw new Error("El dia tiene que ser entre 1 y 31")
            }

            if (month < 1 || month > 12) {
                throw new Error("El mes tiene que ser entre 1 y 12");
            }

            if (year < fechaActual.getFullYear()) {
                throw new Error (`El año para reservar la cita debe ser a partir de ${fechaActual.getFullYear()}`)
            }

            if (hour < 0 || hour > 23) {
                throw new Error("La hora tiene que ser entre 0 y 23");
            }

            const citaEncontrada: SlotSchema | undefined = await SlotsCollection.findOne({
                day: day,
                month: month,
                year: year,
                hour: hour,
            });

            if (citaEncontrada && citaEncontrada.available === false) {
                throw new Error("La cita ya existe y está ocupada")
            }
            else if (citaEncontrada) {
                return {
                    _id: citaEncontrada?._id,
                    day: citaEncontrada?.day,
                    month: citaEncontrada?.month,
                    year: citaEncontrada?.year,
                    hour: citaEncontrada?.hour,
                    available: citaEncontrada?.available,
                    dni: citaEncontrada?.dni
                }
            }
            else {
                const addSlot: ObjectId = await SlotsCollection.insertOne({
                    day: day,
                    month: month,
                    year: year,
                    hour: hour,
                    available: true,
                    dni: ""
                });
    
                return {
                    _id: addSlot,
                    day: day,
                    month: month,
                    year: year,
                    hour: hour,
                    available: true,
                    dni: ""
                }
            }

        }

        catch(error) {
            throw new Error(error)
        }
    },
    removeSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number }): Promise<SlotSchema> => {
        try {
            const { day, month, year, hour } = args;

            const fechaActual = new Date();

            if (day < 1 || day > 31) {
                throw new Error("El dia tiene que ser entre 1 y 31")
            }

            if (month < 1 || month > 12) {
                throw new Error("El mes tiene que ser entre 1 y 12");
            }

            if (year < fechaActual.getFullYear()) {
                throw new Error (`El año para reservar la cita debe ser a partir de ${fechaActual.getFullYear()}`)
            }

            if (hour < 0 || hour > 23) {
                throw new Error("La hora tiene que ser entre 0 y 23");
            }

            const citaEncontrada: SlotSchema | undefined = await SlotsCollection.findOne({
                day: day,
                month: month,
                year: year,
                hour: hour,
            });

            if (!citaEncontrada) {
                throw new Error("No se ha encontrado una cita con esos valores");
            }
            else if (citaEncontrada && citaEncontrada.available === false) {
                throw new Error("La cita está ocupada")
            }
            else {
                await SlotsCollection.deleteOne({
                    _id: citaEncontrada._id,
                });

                return {
                    _id: citaEncontrada._id,
                    day: citaEncontrada.day,
                    month: citaEncontrada.month,
                    year: citaEncontrada.year,
                    hour: citaEncontrada.hour,
                    available: citaEncontrada.available,
                    dni: citaEncontrada.dni
                }
            }
            
        }

        catch(error) {
            throw new Error(error)
        }
    },
    bookSlot: async (_: unknown, args: {dni: string, day: number, month: number, year: number, hour: number }): Promise<SlotSchema> => {
        try {
            const { dni, day, month, year, hour } = args;

            const fechaActual = new Date();
            const expresionRegularDni = /^[0-9]{8}[A-Z]$/;

            if (dni.match(expresionRegularDni) === null) {
                throw new Error("El dni no tiene el formato correcto");
            }

            if (day < 1 || day > 31) {
                throw new Error("El dia tiene que ser entre 1 y 31")
            }

            if (month < 1 || month > 12) {
                throw new Error("El mes tiene que ser entre 1 y 12");
            }

            if (year < fechaActual.getFullYear()) {
                throw new Error (`El año para reservar la cita debe ser a partir de ${fechaActual.getFullYear()}`)
            }

            if (hour < 0 || hour > 23) {
                throw new Error("La hora tiene que ser entre 0 y 23");
            }

            const slotEncontrado: SlotSchema | undefined = await SlotsCollection.findOne({
                day: day,
                month: month,
                year: year,
                hour: hour,
            });

            if (!slotEncontrado) {
                throw new Error("No existe una cita disponible");
            }

            if (slotEncontrado.available === false) {
                throw new Error("Este slot ya esta ocupado");
            }
            else {
                await SlotsCollection.updateOne(
                    {_id: slotEncontrado._id},
                    {$set: {
                        available: false,
                        dni: dni,
                    }}
                );

                return {
                    _id: slotEncontrado._id,
                    day: slotEncontrado.day,
                    month: slotEncontrado.month,
                    year: slotEncontrado.year,
                    hour: slotEncontrado.hour,
                    dni: dni,
                    available: false
                }
            }

        }

        catch(error) {
            throw new Error(error)
        }
    },
};

