import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import {v4} from "https://deno.land/std@0.161.0/uuid/mod.ts";
import { AuthorSchema, BookSchema, UserSchema } from "../db/schema.ts";
import { AuthorsCollection, BooksCollection, UserCollection } from "../db/dbconnection.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postUser = async (context: PostUserContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.name || !value.email || !value.password) {
      context.response.body = { msg: "Falta algun campo de { name, email o password}" };
      context.response.status = 400;
      return;
    }

    const { name, email, password } = value;
    
    const expresionRegularEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (email.match(expresionRegularEmail) === null) {
      context.response.body = { msg: "El formato del email es incorrecto" };
      context.response.status = 400;
      return;
    }

    const usuarioEncontradoConEmail: UserSchema | undefined = await UserCollection.findOne({
      email: email,
    })

    if (usuarioEncontradoConEmail) {
      context.response.body = { msg: "Ya existe un usuario con esta cuenta de email" };
      context.response.status = 400;
      return;
    }

    const passwordEncriptada = await bcrypt.hash(password);

    const addUser: ObjectId = await UserCollection.insertOne({
      name: name,
      email: email,
      password: passwordEncriptada,
      createAt: new Date(),
      cart: [],
    });

    context.response.body = {
      _id: addUser,
      name: name,
      email: email,
      password: passwordEncriptada,
      createAt: new Date(),
      cart: [],
    }

    context.response.status = 200;


  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}

type PostAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAuthor = async (context: PostAuthorContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.name) {
      context.response.body = { msg: "Falta el campo de name" };
      context.response.status = 400;
      return;
    }

    const { name } = value;

    const authorExiste: AuthorSchema | undefined = await AuthorsCollection.findOne({
      name: name,
    })

    if(authorExiste) {
      context.response.body = { msg: "Author ya existe" };
      context.response.status = 400;
      return;
    }

    const addAuthor: ObjectId = await AuthorsCollection.insertOne({
      name: name,
      books: [],
    });

    context.response.body = {
      _id: addAuthor,
      name: name,
      books: [],
    };
    context.response.status = 200;

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}

type PostBookContext = RouterContext<
  "/addBook",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBook = async (context: PostBookContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.title || !value.author || !value.pages) {
      context.response.body = { msg: "Falta algun campo de { title, author o pages }" };
      context.response.status = 400;
      return;
    }

    const { title, author, pages  } = value;

    const bookExiste: BookSchema | undefined = await BooksCollection.findOne({
      title: title,
    });

    if (bookExiste) {
      context.response.body = { msg: "Este titulo ya existe en la base de datos" };
      context.response.status = 400;
      return;
    }

    const authorExiste: AuthorSchema | undefined = await AuthorsCollection.findOne({
      _id: new ObjectId(author),
    });

    if (!authorExiste) {
      context.response.body = { msg: "El id del author no existe" };
      context.response.status = 400;
      return;
    }

    const createISBN = crypto.randomUUID();
    const isValid = v4.validate(createISBN);
    if(!isValid){
      context.response.status = 400;
      context.response.body = { msg: "UUID no valido" };
    }

    const addBook: ObjectId = await BooksCollection.insertOne({
      title: title,
      author: author,
      pages: pages,
      ISBN: createISBN,
    })
    

    await AuthorsCollection.updateOne(
      {_id: new ObjectId(author)},
      {
        $push: {
          books:{
            $each: [addBook]
          }
        }
      }
    );
    
    context.response.body = {
      _id: addBook,
      title: title,
      author: author,
      pages: pages,
      ISBN: createISBN, 
    }
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}

