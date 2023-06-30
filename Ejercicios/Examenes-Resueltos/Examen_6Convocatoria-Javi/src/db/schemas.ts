import {ObjectId} from "mongo"
import { Evento } from "../types.ts"

export type AgendaSchema = Omit<Evento, "id"> & {_id: ObjectId}