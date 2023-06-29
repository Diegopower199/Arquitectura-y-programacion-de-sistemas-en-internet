import { PostsCollection } from "../db/dbconnection.ts";
import { PostSchema, UsuarioSchema } from "../db/schema.ts";
import { Usuario } from "../types.ts";
import { ObjectId } from "mongo";


export const UsuarioResolver = {
    _id: (parent: UsuarioSchema | Usuario) =>
    (parent as Usuario).id
      ? (parent as Usuario).id
      : new ObjectId((parent as UsuarioSchema)._id),

    postCreados: async (parent: UsuarioSchema,): Promise<PostSchema[]> => {
        try {
            return await PostsCollection.find({
                _id: {
                    $in: parent.postCreados
                }
            }).toArray();
        }
        catch(error) {
            throw new Error(error);
        }
    },
}