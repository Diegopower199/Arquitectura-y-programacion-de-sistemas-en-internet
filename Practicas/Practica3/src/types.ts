export type User = {
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    cart: string[]
};
  
export type Books = {
    title: string;
    author: string; // id autor
    pages: number;
    ISBN: string;
};

export type Author = {
    name: string,
    books: string[] // id book
}

