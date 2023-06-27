import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";



type UpdateReleaseCarContext = RouterContext<
  "/releaseCar/:id",
  {
    id: string
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putReleaseCar = async (context: UpdateReleaseCarContext) => {
  try {

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}