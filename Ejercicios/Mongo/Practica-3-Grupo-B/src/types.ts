
export type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    createAt: Date,
    cart: Book[]
}

export type Book = {
    id: string,
    title: string,
    author: Author,
    pages: number,
    ISBN: string,
}

export type Author = {
    id: string,
    name: string,
    books: Book[]
}
