import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

export type Books = {
    title: string;
    author: string;
    pages: number;
    ISBN: string;
};

export type User = {
    name: string;
    email: string;
    password: string;
    created_at: Date;
    cart: ObjectId[];
};

export type Author ={
    name: string;
    books: ObjectId[];
};


