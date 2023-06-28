import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { TransactionSchema, UserSchema } from "../db/schema.ts";
import { TransactionsCollection, UsersCollection } from "../db/dbconnection.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postUser = async (context: PostUserContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.email || !value.nombre || !value.apellido || !value.telefono || !value.dni) {
      context.response.body = { msg: "Falta algun parametro de estos {email, nombre, apellido, telefono, dni}", };
      context.response.status = 404;
      return;
    }
    const { email, nombre, apellido, telefono, dni } = value;

    if (typeof email !== "string") {
      context.response.body = { msg: "La campo email no es de tipo string", };
      context.response.status = 400;
      return;
    }

    if (typeof nombre !== "string") {
      context.response.body = { msg: "La campo nombre no es de tipo string", };
      context.response.status = 400;
      return;
    }
    if (typeof apellido !== "string") {
      context.response.body = { msg: "La campo apellido no es de tipo string", };
      context.response.status = 400;
      return;
    }
    if (typeof telefono !== "string") {
      context.response.body = { msg: "La campo telefono no es de tipo string", };
      context.response.status = 400;
      return;
    }
    if (typeof dni !== "string") {
      context.response.body = { msg: "La campo dni no es de tipo string", };
      context.response.status = 400;
      return;
    }
    const expresionRegularEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (email.match(expresionRegularEmail) === null) {
      context.response.body = { msg: "El email no tiene un formato correcto" };
      context.response.status = 400;
      return;
    }

    const expresionRegularTelefono = /^[0-9]{9}$/;

    if (telefono.match(expresionRegularTelefono) === null) {
      context.response.body = { msg: "El telefono no tiene un formato correcto", };
      context.response.status = 400;
      return;
    }

    const expresionRegularDni = /^[0-9]{8}[A-Z]$/;

    if (dni.match(expresionRegularDni) === null) {
      context.response.body = { msg: "El dni no tiene un formato correcto" };
      context.response.status = 400;
      return;
    }

    const ibanAleatorio = "ES21" + Math.floor(Math.random() * 1000000000000000000000);

    const usuarioExiste: UserSchema | undefined = await UsersCollection.findOne(
      {
        $or: [
          { telefono: telefono },
          { email: email },
          { dni: dni },
          { IBAN: ibanAleatorio },
        ],
      }
    );

    if (usuarioExiste) {
      context.response.body = { msg: "El usuario ya existe con alguno de los campos unicos introducidos", };
      context.response.status = 400;
      return;
    }

    const addUser: ObjectId = await UsersCollection.insertOne({
      email: email,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      dni: dni,
      IBAN: ibanAleatorio,
    });

    context.response.body = {
      _id: addUser,
      email: email,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      dni: dni,
      IBAN: ibanAleatorio,
    };
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type PostTransactionContext = RouterContext<
  "/addTransaction",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postTransaction = async (context: PostTransactionContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.id_reciber || !value.id_sender || !value.amount) {
      context.response.body = { msg: "Falta algun parametro de estos {id_reciber, id_sender, amount}", };
      context.response.status = 400;
      return;
    }

    const { id_reciber, id_sender, amount } = value;

    if (typeof id_reciber !== "string") {
      context.response.body = { msg: "La campo id_reciber no es de tipo string", };
      context.response.status = 400;
      return;
    }

    if (typeof id_sender !== "string") {
      context.response.body = { msg: "La campo id_sender no es de tipo string", };
      context.response.status = 400;
      return;
    }

    if (typeof amount !== "number") {
      context.response.body = { msg: "El campo amount no es de tipo number", };
      context.response.status = 400;
      return;
    }


    const expresionRegularObjectId = /^[0-9a-fA-F]{24}$/;

    if (id_reciber.match(expresionRegularObjectId) === null) { // No es un ObjectId
      context.response.body = { msg: "El campo id_reciber no tiene el formato de ObjectId", };
      context.response.status = 404;
      return;
    }

    if (id_sender.match(expresionRegularObjectId) === null) { 
      context.response.body = { msg: "El campo id_sender no tiene el formato de ObjectId", };
      context.response.status = 404;
      return;
    }

    const usuarioReciberExiste: UserSchema | undefined =
      await UsersCollection.findOne({
        _id: new ObjectId(id_reciber),
      });

    if (!usuarioReciberExiste) {
      context.response.body = { msg: "El usuario reciber no existe" };
      context.response.status = 400;
      return;
    }

    const usuarioSenderExiste: UserSchema | undefined =
      await UsersCollection.findOne({
        _id: new ObjectId(id_sender),
      });

    if (!usuarioSenderExiste) {
      context.response.body = { msg: "El usuario sender no existe" };
      context.response.status = 400;
      return;
    }

    const addTransaction: ObjectId = await TransactionsCollection.insertOne({
      id_reciber: new ObjectId(id_reciber),
      id_sender: new ObjectId(id_sender),
      amount: amount,
    });

    context.response.body = {
      _id: addTransaction,
      id_reciber: id_reciber,
      id_sender: id_sender,
      amount: amount,
    };
    context.response.status = 200;
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
