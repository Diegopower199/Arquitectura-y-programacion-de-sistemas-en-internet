import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { UsersCollection } from "../db/dbconnection.ts";
import { UserSchema } from "../db/schema.ts";
import { User } from "../types.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostTransactionContext = RouterContext<
  "/addTransaction",
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

    const newUser: Partial<User> = {
      nombre: value.nombre,
      apellidos: value.apellidos,
      dni: value.dni,
      telefono: value.telefono,
      email: value.email,
      iban: ibanAleatorio
    }

    const id: ObjectId = await UsersCollection.insertOne(newUser as UserSchema);
    newUser.id = id.toString();
    const {_id, ...newUserWithoutId} = newUser as UserSchema;
    context.response.body = {
      _id: _id,
      newUserWithoutId,
    };
    context.response.status = 200;

  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

export const postTransaction = async (context: PostTransactionContext) => {
  try {
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
