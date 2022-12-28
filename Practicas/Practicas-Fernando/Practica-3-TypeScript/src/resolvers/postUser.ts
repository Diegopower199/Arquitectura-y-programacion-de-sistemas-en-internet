import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schemas.ts";
import { User } from "../types.ts";
import { UserCollection } from "../db/mongo.ts";
import { isEmail } from "https://deno.land/x/isemail/mod.ts";

type PostAddUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postUsers = async (context: PostAddUserContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    
    const emailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    );
    if (!emailRegex.test(value.email)) {
      context.response.status = 400;
      return;
    }


    
    const users: UserSchema | undefined = await UserCollection.findOne({
      email: value.email,
    });
    if (users) {
      context.response.status = 400;
      return;

    }

    
    if (!isEmail(value.email)) {
      context.response.status = 400;
      return;
    }
   

    if (!value?.name || !value?.email || !value?.password) {
      context.response.status = 400;
      return;
    }
    const user: Partial<User> = {
      name: value.name,
      email: value.email,
      password: value.password,
      created_at: new Date(),
      cart: [],
    };

    await UserCollection.insertOne(user as UserSchema);
    const { _id, ...userWithoutId } = user as UserSchema;
    context.response.body = userWithoutId;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
