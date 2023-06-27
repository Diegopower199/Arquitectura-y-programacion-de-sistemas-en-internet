export type PressHouse = {
    id: string,
    name: string,
    web: string,
    country: string,
    books: Book[]
}

export type Author = {
    id: string,
    name: string,
    lang: string,
    books: Book[]
}

export type Book = {
    id: string,
    title: string,
    author: string,
    pressHouse: string,
    year: number
}

export type User = {
    id: string,
    name: string,
    surname: string,
    dni: string,
    birthDate: Date,
    dateCreate: Date,
    tipoUsuario: TipoUsuario,
    username: string
    password?: string,
    token?: string
    autoresQueSigue: string[],
    librosQueTiene: string[],
    librosQueLeGustariaTener: string[],
}
  
export enum TipoUsuario {
    REGISTRADO = "REGISTRADO",
    MODO_INVITADO = "MODO INVITADO",
}