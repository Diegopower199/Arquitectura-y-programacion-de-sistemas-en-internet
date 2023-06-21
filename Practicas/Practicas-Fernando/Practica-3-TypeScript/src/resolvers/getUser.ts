import { ObjectId } from "mongo";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = async (context: GetUserContext) => {
    try {
      if (context.params?.id) {
        const user: UserSchema | undefined = await UserCollection.findOne({
          _id: new ObjectId(context.params.id),
        });
  
        if (user) {
          const { _id, ...userWithoutId } = user as UserSchema;
          console.log(userWithoutId.name)
          context.response.body = {
            userWithoutId,
            id: _id.toString(),
          };
        } else {
          context.response.status = 404;
          context.response.body = { message: "User not found" };
        }
      }
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
  };