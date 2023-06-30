export type Evento = {
    id: string,
    titulo: string,
    descripcion: string,
    fecha: Date,
    horaInicio: number,
    horaFinal: number,
    invitados: string[]
}