import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { TransactionsCollection, UsersCollection } from "../db/dbconnection.ts";
import { TransactionSchema, UserSchema } from "../db/schema.ts";


type DeleteUserConEmailContext = RouterContext<"/deleteUser/email",
  {
    email: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const deleteUserConEmail = async (context: DeleteUserConEmailContext) => {
  try {
    const email: string = context.params.email;
    const userEncontrado: UserSchema | undefined = await UsersCollection.findOne({
      email: email,
    });

    if (!userEncontrado) {
      context.response.body = { msg: "Usuario no encontrado por el email"};
      context.response.status = 404;
      return;
    }


    await UsersCollection.deleteOne({
      email: email,
    })
    context.response.status = 200;
    context.response.body = { msg: "Se ha eliminado el usuario" };
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
};

type DeleteTransactionConIdContext = RouterContext<"/deleteTransaction/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const DeleteTransaction = async (context: DeleteTransactionConIdContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.id) {
      context.response.status = 404;
      context.response.body = { msg: "Debes poner el id en la ruta"}
      return;
    }
    const { id } = params;

    const transactionEncontrada: TransactionSchema | undefined = await TransactionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!transactionEncontrada) {
      context.response.body = { msg: "Esa id no esta en la base de datos"}
      context.response.status = 404;
      return;
    }

    await TransactionsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    context.response.body = { msg: "Se ha borrado la transaction de la base de datos"};
    context.response.status = 200;
    return;
  }
  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}