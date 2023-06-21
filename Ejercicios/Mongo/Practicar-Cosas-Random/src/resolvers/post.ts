import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { TransactionsCollection, UsersCollection } from "../db/dbconnection.ts";
import { TransactionSchema, UserSchema } from "../db/schema.ts";
import { Transactions, User } from "../types.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postUser = async (context: PostUserContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.nombre || !value?.apellidos || !value?.dni || !value?.telefono || !value?.email ) {
      context.response.status = 400;
      context.response.body = { msg: "Faltan datos" };
      return;
    }

    if (!/^[0-9]{8}[A-Z]$/.test(value.dni)) {
      context.response.body = "Formato DNI incorrecto";
      context.response.status = 400;
      return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.email)) {
      context.response.body = "Formato email incorrecto";
      context.response.status = 400;
      return;
    }

    if (!/^[0-9]{9}$/.test(value.telefono)) {
      context.response.body = "Formato telefono incorrecto";
      context.response.status = 400;
      return;
    }

    const comprobarDNI: UserSchema | undefined = await UsersCollection.findOne({ 
      dni: value.dni 
    });

    const comprobarTelefono: UserSchema | undefined = await UsersCollection.findOne({
      telefono: value.telefono,
    });

    const comprobarEmail: UserSchema | undefined = await UsersCollection.findOne({
      email: value.email,
    });

    const ibanAleatorio: string = "ES21" + Math.floor(Math.random() * 1000000000000000000000);
    const comprobarIban: UserSchema | undefined = await UsersCollection.findOne({
      iban: ibanAleatorio, 
    });

    if (comprobarDNI || comprobarTelefono || comprobarEmail || comprobarIban) {
      context.response.status = 400;
      context.response.body = { msg: "El usuario ya existe" };
      return;
    }


    const createUserId = await UsersCollection.insertOne({
      nombre: value.nombre,
      apellidos: value.apellidos,
      dni: value.dni,
      telefono: value.telefono,
      email: value.email,
      iban: ibanAleatorio
    });

    context.response.body = {
      _id: createUserId,
      nombre: value.nombre,
      apellidos: value.apellidos,
      dni: value.dni,
      telefono: value.telefono,
      email: value.email,
      iban: ibanAleatorio
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
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value.id_sender || !value.id_reciber || !value.amount) {
      context.response.body = { msg: "Falta el parametro de id_sender, id_reciber o amount en el json"};
      context.response.status = 404;
      return;
    }

    const { id_sender, id_reciber, amount } = value;

    const createTransaction: ObjectId = await TransactionsCollection.insertOne({
      id_reciber: new ObjectId(id_reciber),
      id_sender: new ObjectId(id_sender),
      amount: amount,
    });

    context.response.body = {
      _id: createTransaction,
      id_reciber: id_reciber,
      id_sender: id_sender,
      amount: amount
    };
    context.response.status = 200;

   
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
