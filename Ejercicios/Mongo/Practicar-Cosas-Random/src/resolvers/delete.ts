import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { TransactionsCollection, UsersCollection } from "../db/dbconnection.ts";



type DeleteUserConEmailContext = RouterContext<"/deleteUser/email",
  {
    email: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const deleteUserConEmail = async (context: DeleteUserConEmailContext) => {

}