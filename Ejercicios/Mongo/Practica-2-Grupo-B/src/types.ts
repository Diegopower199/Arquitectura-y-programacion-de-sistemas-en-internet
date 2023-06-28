export type User = {
    id: string,
    dni: string,
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    IBAN: string,
}

export type Transaction = {
    id: string,
    id_sender: string,
    id_reciber: string,
    amount: number,
}