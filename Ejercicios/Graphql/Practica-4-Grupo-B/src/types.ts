export type Concesionario = {
    id: string,
    localidad: string,
    vendedores: Vendedor[],
}

export type Vendedor = {
    id: string,
    nombre: string,
    dni: string,
    coches: Coche[],
}

export type Coche = {
    id: string,
    matricula: string,
    marca: string,
    asientos: number,
    precio: number,
}