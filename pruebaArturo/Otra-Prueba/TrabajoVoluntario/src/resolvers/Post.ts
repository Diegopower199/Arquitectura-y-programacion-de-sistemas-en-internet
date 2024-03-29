import { ComentarioCollection } from "../database/database.ts";
import { ComentarioSchema } from "../database/schema.ts";
import { PostSchema } from "../database/schema.ts";


export const Post = {
    
    comentario: async (parent: PostSchema): Promise<ComentarioSchema | undefined> => {
        try {
            return await ComentarioCollection.findOne({
                _id: parent.comentario
            })
        }
        catch(e) {

        }
    }
    
}

