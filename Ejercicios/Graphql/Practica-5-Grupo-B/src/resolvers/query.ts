import { MensajesCollection } from "../db/dbconnection.ts";
import { MensajeSchema } from "../db/schema.ts";


export const Query = {
  getMessages: async (_: unknown, args: { page: number, perPage: number }): Promise<MensajeSchema[]> => {
    const { page, perPage } = args;

    if (page < 0) {
        throw new Error("Las paginas deben ser de 1 hacia arriba");
    }

    if (perPage < 10 || perPage > 200) {
        throw new Error("El limite por pagina es de 10 a 200 incluidos esos valores");
    }

    const mensajes: MensajeSchema[] | undefined = await MensajesCollection.find({}).limit(perPage).skip((page - 1) * perPage).toArray();

    if (!mensajes) {
        throw new Error("No hay mensajes en la base de datos en esa pagina");
    }

    return mensajes.map( (mensaje: MensajeSchema) => ({
        _id: mensaje._id,
        emisor: mensaje.emisor,
        receptor: mensaje.receptor,
        idioma: mensaje.idioma,
        fechaCreacionMensaje: mensaje.fechaCreacionMensaje,
        contenido: mensaje.contenido
    }))
  }
};

/*
ejemplo: async (_: unknown, args: {}): Promise<Tipo1> => {

}
*/