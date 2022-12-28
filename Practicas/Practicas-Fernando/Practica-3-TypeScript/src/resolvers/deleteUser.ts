import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { UserCollection } from "../db/mongo.ts";
import { getQuery } from "oak/helpers.ts";

type deleteUserContext = RouterContext<
  "/deleteUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: deleteUserContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params._id) {
      context.response.status = 406;
      return;
    }   

    const { _id} = params;

    const user = await UserCollection.findOne({
        _id: new ObjectId(_id), 
    });

    if (!user) {
      context.response.status = 404;
      return;
    }
    
    await UserCollection.deleteOne({ _id: user._id });
    context.response.status = 200;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};