import { SlotsCollection } from "../db/dbconnection.ts";
import { SlotSchema } from "../db/schema.ts";


export const Query = {
    availableSlots: async (_: unknown, args: { day?: number, month: number, year: number}): Promise<SlotSchema[]> => {
        try {
            const { day, month , year} = args;

            if (typeof month === "undefined" || typeof year === "undefined") {
                throw new Error("Error, debes pasar el parametro month o year obligatorios");
            }

            if (typeof month === "number" && typeof year === "number" && typeof day === "number") {
                const citasDisponiblesConDia = await SlotsCollection.find({
                    day: day,
                    month: month,
                    year: year,
                    available: true,
                });

                return citasDisponiblesConDia.map( (cita: SlotSchema) => ({
                    _id: cita._id,
                    day: cita.day,
                    month: cita.month,
                    year: cita.year,
                    hour: cita.hour,
                    available: cita.available,
                    dni: cita.dni,
                }))
            }
            else {
                const citaDisponibleSinDia = await SlotsCollection.find({
                    month: month,
                    year: year,
                    available: true,
                });

                return citaDisponibleSinDia.map( (cita: SlotSchema) => ({
                    _id: cita._id,
                    day: cita.day,
                    month: cita.month,
                    year: cita.year,
                    hour: cita.hour,
                    available: cita.available,
                    dni: cita.dni,
                }))
            }

        }

        catch(error) {
            throw new Error(error)
        }
    },
};


