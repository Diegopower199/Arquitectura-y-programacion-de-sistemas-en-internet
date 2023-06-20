
export type User = {
    id: string,
    email: string,
    nombre: string,
    apellidos: string,
    telefono: string,
    dni: string,
    iban: string,
}

export type Transactions = {
    id: string,
    id_sender: string,
    id_reciber: string,
    amount: number,
}