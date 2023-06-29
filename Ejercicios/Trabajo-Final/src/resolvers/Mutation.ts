import { ObjectId } from "mongo";
import { ComentarioSchema, PostSchema, UsuarioSchema } from "../db/schema.ts";
import { Post, Usuario, tipoUsuario } from "../types.ts";
import {
  ComentariosCollection,
  PostsCollection,
  UsuariosCollection,
} from "../db/dbconnection.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import * as bcrypt from "bcrypt";

// No esta bien el createUser
export const Mutation = {
  registrer: async (
    _: unknown,
    args: { username: string; password: string; tipoUsuario: tipoUsuario }
  ): Promise<UsuarioSchema & { token: string }> => {
    try {
      const { username, password, tipoUsuario } = args;
      const existsUsuario: UsuarioSchema | undefined =
        await UsuariosCollection.findOne({
          username: username,
        });

      if (existsUsuario) {
        throw new Error("User already exists");
      }

      const hashedPassword: string = await bcrypt.hash(password);
      const _id: ObjectId = new ObjectId();

      const token = await createJWT(
        {
          id: _id.toString(),
          username: username,
          password: hashedPassword,
          fechaCreacion: new Date(),
          tipoUsuario: tipoUsuario,
          postCreados: [],
          inicioSesionCuenta: false,
        },
        Deno.env.get("JWT_SECRET")!
      );

      await UsuariosCollection.insertOne({
        _id: _id,
        username: username,
        password: hashedPassword,
        fechaCreacion: new Date(),
        tipoUsuario: tipoUsuario,
        postCreados: [],
        inicioSesionCuenta: false,
      });

      return {
        _id: _id,
        username: username,
        password: hashedPassword,
        fechaCreacion: new Date(),
        tipoUsuario: tipoUsuario,
        postCreados: [],
        inicioSesionCuenta: false,
        token: token,
      };

      /*if (tipoUsuario.toString() === "REGISTRADO_NORMAL") {


                const _id = await UsuariosCollection.insertOne({
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  });

                  return {
                    _id: _id,
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  }
            }
            else {
                const _id = await UsuariosCollection.insertOne({
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  });
                  return {
                    _id: _id,
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  }
            }*/
    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    _: unknown,
    args: { username: string; password: string }
  ): Promise<string> => {
    try {
      const { username, password } = args;
      const user: UsuarioSchema | undefined = await UsuariosCollection.findOne({
        username: username,
      });
      if (!user) {
        throw new Error("User does not exist");
      }

      let validPassword: boolean;

      if (user.password) {
        validPassword = await bcrypt.compare(password, user.password);
      } else {
        validPassword = false;
      }

      if (!validPassword) {
        throw new Error("Invalid password");
      }

      const token = await createJWT(
        {
          id: user._id.toString(),
          username: user.username,
          fechaCreacion: user.fechaCreacion,
          postCreados: user.postCreados.map((post) => post.toString()),
          tipoUsuario: user.tipoUsuario,
          inicioSesionCuenta: true,
        },
        Deno.env.get("JWT_SECRET")!
      );

      await UsuariosCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            inicioSesionCuenta: true,
          },
        }
      );

      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
  logOut: async (_: unknown, args: { token: string }): Promise<string> => {
    try {
      const { token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            inicioSesionCuenta: false,
          },
        }
      );
      return `Se ha cerrado sesion de este usuario ${user.username}`;
    } catch (e) {
      throw new Error(e);
    }
  },
  signOut: async (_: unknown, args: { token: string }): Promise<string> => {
    try {
      const { token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      }

      const usuarioInformacion = await UsuariosCollection.findOne({
        _id: new ObjectId(user.id),
      });

      if (!usuarioInformacion) {
        throw new Error("No existe el usuario");
      }

      const postsPromesas: Promise<PostSchema>[] = usuarioInformacion?.postCreados.map(
        async (post: ObjectId): Promise<PostSchema> => {
          const postEncontrado: PostSchema | undefined =
            await PostsCollection.findOne({ _id: post });
            //console.log(typeof postEncontrado === "undefined");

          if (!postEncontrado) {
            throw new Error(`Esta id: ${post} no esta en la base de datos`);
          }

          return postEncontrado;
        }
      );

      console.log(
        "Posts promesas (Abajo lo que hago es esperar a que se completen): ",
        postsPromesas
      );

      const postsEncontrados: (Omit<Post, "id" | "comentarios"> & {
        _id: ObjectId;
        comentarios: ObjectId[];
    })[] = await Promise.all(postsPromesas);

      console.log("PROMESAS DE POSTS: ")
      console.log(postsEncontrados);

      // Si quiero el campo de comentarios tengo que hacer flatMap para desestructurar el tipo
      const comentariosIds: ObjectId[] = postsEncontrados.flatMap(({ comentarios }) => comentarios);



       const comentariosPromesas = comentariosIds.map(
        async (comentario) => {
          const comentarioEncontrado: ComentarioSchema | undefined =
            await ComentariosCollection.findOne({ _id: new ObjectId(comentario) });

          if (!comentarioEncontrado) {
            throw new Error(`Esta id: ${comentario} no esta en la base de datos`);
          }

          return comentarioEncontrado;
        }
      );

      console.log(
        "Comentarios promesas (Abajo lo que hago es esperar a que se completen): ",
        comentariosPromesas
      );

      const comentariosEncontrados = await Promise.all(comentariosPromesas);


        console.log("PROMESAS DE POSTS: ")
      console.log(postsEncontrados);

      console.log("\n\nPROMESAS DE COMENTARIOS:")
      console.log(comentariosEncontrados)

      await UsuariosCollection.deleteOne({
        _id: new ObjectId(user.id),
      })
      
      postsEncontrados.map( async (post) => {
        await PostsCollection.deleteOne(
          { _id:  post._id}
        );
      });

      comentariosEncontrados.map( async (comentario) => {
        await ComentariosCollection.deleteOne({
          _id: comentario._id
        })
      })

      

      return `Se ha eliminado toda la informacion del usuario ${user.username}`;
    } catch (error) {
      throw new Error(error);
    }
  },
  escribirComentarios: async (
    _: unknown,
    args: { idPost: string; token: string; contenido: string }
  ): Promise<ComentarioSchema> => {
    try {
      const { idPost, token, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      }
      console.log(user);

      const postExiste: PostSchema | undefined = await PostsCollection.findOne({
        _id: new ObjectId(idPost),
      });

      if (!postExiste) {
        throw new Error("No existe un post con ese id");
      }

      const fecha = new Date();

      const addComentario: ObjectId = await ComentariosCollection.insertOne({
        contenido: contenido,
        fechaCreacion: fecha,
      });

      await PostsCollection.updateOne(
        { _id: new ObjectId(idPost) },
        {
          $push: {
            comentarios: {
              $each: [addComentario],
            },
          },
        }
      );

      return {
        _id: addComentario,
        contenido: contenido,
        fechaCreacion: fecha,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  escribirPost: async (
    _: unknown,
    args: { token: string; title: string; contenido: string }
  ): Promise<PostSchema> => {
    try {
      const { token, title, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      } else if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        console.log("El usuario se ha registrado como normal");
        throw new Error("El usuario se ha registrado como normal");
      }
      console.log(user);

      const postExiste: PostSchema | undefined = await PostsCollection.findOne({
        title: title,
      });

      if (postExiste) {
        throw new Error("Ya existe un post con ese titulo");
      }

      const fecha = new Date();

      const addPost: ObjectId = await PostsCollection.insertOne({
        title: title,
        contenido: contenido,
        fechaPost: fecha,
        comentarios: [],
      });

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $push: {
            postCreados: {
              $each: [addPost],
            },
          },
        }
      );

      return {
        _id: addPost,
        title: title,
        contenido: contenido,
        fechaPost: fecha,
        comentarios: [],
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  updateComentario: async (
    _: unknown,
    args: {
      idComentario: string;
      idPost: string;
      token: string;
      contenido: string;
    }
  ): Promise<ComentarioSchema> => {
    try {
      const { idComentario, idPost, token, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      } else if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        console.log("El usuario se ha registrado como normal");
        throw new Error("El usuario se ha registrado como normal");
      }

      const postExiste: PostSchema | undefined = await PostsCollection.findOne({
        _id: new ObjectId(idPost),
      });

      if (!postExiste) {
        throw new Error(
          "No existe un post con ese id con el usuario seleccionado "
        );
      }

      const comentarioExiste: ComentarioSchema | undefined =
        await ComentariosCollection.findOne({
          _id: new ObjectId(idComentario),
        });

      if (!comentarioExiste) {
        throw new Error(
          "No existe un comentario con ese id con el usuario seleccionado "
        );
      }

      await ComentariosCollection.updateOne(
        { _id: new ObjectId(idComentario) },
        {
          $set: {
            contenido: contenido,
          },
        }
      );

      return {
        _id: new ObjectId(idComentario),
        contenido: contenido,
        fechaCreacion: comentarioExiste.fechaCreacion,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  updatePost: async (
    _: unknown,
    args: {
      idPost: string;
      token: string;
      titleNew?: string;
      contenidoNew?: string;
    }
  ): Promise<PostSchema> => {
    try {
      const { idPost, token, titleNew, contenidoNew } = args;

      const actualizarParametros: { titleNew?: string; contenidoNew?: string } =
        {};

      if (titleNew) {
        actualizarParametros.titleNew = titleNew;
      }

      if (contenidoNew) {
        actualizarParametros.contenidoNew = contenidoNew;
      }

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      } else if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        console.log("El usuario se ha registrado como normal");
        throw new Error("El usuario se ha registrado como normal");
      }

      const postExiste: PostSchema | undefined = await PostsCollection.findOne({
        _id: new ObjectId(idPost),
      });

      if (!postExiste) {
        throw new Error(
          "No existe un post con ese id con el usuario seleccionado "
        );
      }

      await PostsCollection.updateOne(
        { _id: postExiste._id },
        {
          $set: actualizarParametros,
        }
      );

      return {
        _id: postExiste._id,
        title: actualizarParametros.titleNew || postExiste.title,
        contenido: actualizarParametros.contenidoNew || postExiste.contenido,
        fechaPost: postExiste.fechaPost,
        comentarios: postExiste.comentarios.map(
          (comentario) => new ObjectId(comentario)
        ),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteComentario: async (
    _: unknown,
    args: { idComentario: string; token: string }
  ): Promise<ComentarioSchema> => {
    try {
      const { idComentario, token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      } else if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        console.log("El usuario se ha registrado como normal");
        throw new Error("El usuario se ha registrado como normal");
      }

      const comentarioExiste = await ComentariosCollection.findOne({
        _id: new ObjectId(idComentario),
      });

      if (!comentarioExiste) {
        throw new Error("No existe el id del comentario");
      }

      const encontrarComentarioEnPost = await PostsCollection.findOne({
        comentarios: new ObjectId(idComentario),
      });

      await ComentariosCollection.deleteOne({
        _id: new ObjectId(idComentario),
      });

      await PostsCollection.updateOne(
        { _id: encontrarComentarioEnPost?._id },
        {
          $pull: {
            comentarios: new ObjectId(idComentario),
          },
        }
      );

      return {
        _id: new ObjectId(idComentario),
        contenido: comentarioExiste.contenido,
        fechaCreacion: comentarioExiste.fechaCreacion,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deletePost: async (
    _: unknown,
    args: { idPost: string; token: string }
  ): Promise<PostSchema> => {
    try {
      const { idPost, token } = args;
      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (user.inicioSesionCuenta === false) {
        console.log("No tiene iniciada sesion");
        throw new Error("No tiene iniciada sesion");
      } else if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        console.log("El usuario se ha registrado como normal");
        throw new Error("El usuario se ha registrado como normal");
      }

      const postExiste = await PostsCollection.findOne({
        _id: new ObjectId(idPost),
      });

      if (!postExiste) {
        throw new Error("No existe el id del post");
      }

      await PostsCollection.deleteOne({
        _id: new ObjectId(idPost),
      });

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $pull: {
            postCreados: new ObjectId(idPost),
          },
        }
      );

      return {
        _id: postExiste._id,
        title: postExiste.title,
        contenido: postExiste.contenido,
        fechaPost: postExiste.fechaPost,
        comentarios: postExiste.comentarios.map(
          (comentario) => new ObjectId(comentario)
        ),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
};

/*
deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
},

updateBooksMore2000: async (_: unknown, args: {}): Promise<number> => {
},
*/
