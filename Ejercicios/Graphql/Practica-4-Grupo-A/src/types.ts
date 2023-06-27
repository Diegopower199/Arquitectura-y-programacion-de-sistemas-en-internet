import { ObjectId } from "mongo";


export type Slot = {
    id: string,
    day: number,
    month: number,
    year: number,
    hour: number,
    available: boolean,
    dni: string,
}