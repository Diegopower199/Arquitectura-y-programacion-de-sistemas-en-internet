import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { CochesCollection, ConcesionariosCollection, VendedoresCollection } from "../db/dbconnection.ts";
import { ConcesionarioSchema } from "../db/schema.ts"
import { VendedorSchema } from "../db/schema.ts"
import { CocheSchema } from "../db/schema.ts"


export const Query = {
    getCochesPorId: async(_: unknown, args: {ids: string[]}): Promise<CocheSchema[]> => {
        try {
          const { ids } = args;

          const cochesPromesas = ids.map ( async (id) => {
            const cocheEncontrado: CocheSchema | undefined  = await CochesCollection.findOne({_id: new ObjectId(id)});
    
            if (!cocheEncontrado) {
              throw new Error (`Esta id: ${id} no esta en la base de datos`);
            }
    
            return cocheEncontrado;
          });
    
          console.log("Coches promesas (Abajo lo que hago es esperar a que se completen): ", cochesPromesas)
    
          const cochesEncontrados = await Promise.all(cochesPromesas);

          console.log(cochesEncontrados)

          return cochesEncontrados.map( (coche: CocheSchema) => ({
            _id: coche._id,
            matricula: coche.matricula,
            marca: coche.marca,
            asientos: coche.asientos,
            precio: coche.precio
          }))

        }
        catch (error) {
            throw new Error(error);
        }
    },
    getCochesPorRangoDePrecios: async (_: unknown, args: {precioMinimo: number, precioMaximo: number}): Promise<CocheSchema[]> => {
        try {
            const { precioMinimo, precioMaximo } = args;

            const cochesEncontradosRangoPrecios = await CochesCollection.find({
                precio: {
                    $lte: precioMaximo,
                    $gte: precioMinimo
                }
            });

            return cochesEncontradosRangoPrecios.map( (coche: CocheSchema) => ({
                _id: coche._id,
                matricula: coche.matricula,
                marca: coche.marca,
                asientos: coche.asientos,
                precio: coche.precio
            }))
        }
        catch (error) {
            throw new Error(error);
        }
    },
    getVendedorPorId: async (_: unknown, args: {ids: string[] }): Promise<VendedorSchema[]> => {
        try {
            const { ids } = args;

            const vendedoresPromesas = ids.map ( async (id) => {
                const vendedorEncontrado: VendedorSchema | undefined  = await VendedoresCollection.findOne({_id: new ObjectId(id)});
        
                if (!vendedorEncontrado) {
                  throw new Error (`Esta id: ${id} no esta en la base de datos`);
                }
        
                return vendedorEncontrado;
              });
        
              console.log("Vendedores promesas (Abajo lo que hago es esperar a que se completen): ", vendedoresPromesas)
        
              const vendedoresEncontrados = await Promise.all(vendedoresPromesas);

              return vendedoresEncontrados.map( (vendedor: VendedorSchema) => ({
                _id: vendedor._id,
                nombre: vendedor.nombre,
                dni: vendedor.dni,
                coches: vendedor.coches
              }))


        }
        catch (error) {
            throw new Error(error);
        }
    },
    getVendedorPorNombre: async (_: unknown, args: {nombre: string }): Promise<VendedorSchema[]> => {
        try {
            const { nombre } = args;

            const vendedoresEncontrar = await VendedoresCollection.find({
                nombre: nombre,
            });

            if (!vendedoresEncontrar) {
                throw new Error("No hay vendedores con ese nombre")
            }

            return vendedoresEncontrar.map( (vendedor: VendedorSchema) => ({
                _id: vendedor._id,
                nombre: vendedor.nombre,
                dni: vendedor.dni,
                coches: vendedor.coches
            }))
        }
        catch (error) {
            throw new Error(error);
        }
    },
    getConcesionarioPorId: async (_: unknown, args: {ids: string[] }): Promise<ConcesionarioSchema[]> => {
        try {
            const { ids } = args;

            const concesionarioPromesas = ids.map ( async (id) => {
                const concesionarioEncontrado: ConcesionarioSchema | undefined  = await ConcesionariosCollection.findOne({_id: new ObjectId(id)});
        
                if (!concesionarioEncontrado) {
                  throw new Error (`Esta id: ${id} no esta en la base de datos`);
                }
        
                return concesionarioEncontrado;
              });
        
              console.log("Concesionario promesas (Abajo lo que hago es esperar a que se completen): ", concesionarioPromesas)
        
              const concesionarioEncontrados = await Promise.all(concesionarioPromesas);

              return concesionarioEncontrados.map( (concesionario: ConcesionarioSchema) => ({
                _id: concesionario._id,
                localidad: concesionario.localidad,
                vendedores: concesionario.vendedores,
              }))


        }
        catch (error) {
            throw new Error(error);
        }
    },
    getConcesionarioPorLocalidad: async (_: unknown, args: { localidad: string }): Promise<ConcesionarioSchema[]> => {
        try {
            const { localidad } = args;

            const concesionarioEncontradoPorLocalidad = await ConcesionariosCollection.find({
                localidad: localidad,
            });

            if (!concesionarioEncontradoPorLocalidad) {
                throw new Error("No se ha encontrado ningun concesionario con esa localidad");
            }

            return concesionarioEncontradoPorLocalidad.map( (concesionario: ConcesionarioSchema) => ({
                _id: concesionario._id,
                localidad: concesionario.localidad,
                vendedores: concesionario.vendedores
            }))
        }
        catch (error) {
            throw new Error(error);
        }
    }
};

/*
ejemplo: async (_: unknown, args: {}): Promise<Tipo1> => {

}
*/

