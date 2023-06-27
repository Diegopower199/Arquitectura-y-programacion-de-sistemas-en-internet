import { ObjectId } from "mongo";
import { CochesCollection, ConcesionariosCollection, VendedoresCollection } from "../db/dbconnection.ts";
import { ConcesionarioSchema } from "../db/schema.ts";
import { CocheSchema } from "../db/schema.ts";
import { VendedorSchema } from "../db/schema.ts";

export const Mutation = {
  addVendedor: async (_: unknown,  args: { nombre: string; dni: string }): Promise<VendedorSchema> => {
    try {
        const { nombre, dni } = args;

        const expresionRegularDni = /^[0-9]{8}[A-Z]$/;

        if (dni.match(expresionRegularDni) === null) {
            throw new Error("Dni invalido")
        }

        const vendedorEncontrado: VendedorSchema | undefined = await VendedoresCollection.findOne({
            dni: dni,
        });

        if (vendedorEncontrado) {
            throw new Error("Ya tenemos un vendedor con ese dni");
        }

        const addVendedor: ObjectId = await VendedoresCollection.insertOne({
            nombre: nombre,
            dni: dni,
            coches: []
        });

        return {
            _id: addVendedor,
            nombre: nombre,
            dni: dni,
            coches: []
        }


    } 
    catch (error) {
      throw new Error(error);
    }
  },
  addCoche: async (_: unknown,  args: { matricula: string, marca: string, asientos: number; precio: number }): Promise<CocheSchema> => {
    try {
        const { matricula, marca, asientos, precio } = args;

        const expresionRegularMatricula = /^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

        if (matricula.match(expresionRegularMatricula) === null) {
            throw new Error("Matricula invalido")
        }

        const cocheEncontrado: CocheSchema | undefined = await CochesCollection.findOne({
            matricula: matricula,
        });

        if (cocheEncontrado) {
            throw new Error("La matricula ya existe con un coche");
        }

        const addCoche = await CochesCollection.insertOne({
            matricula: matricula,
            marca: marca,
            asientos: asientos,
            precio: precio,
        });

        return {
            _id: addCoche,
            matricula: matricula,
            marca: marca,
            asientos: asientos,
            precio: precio,
        }
    } 
    catch (error) {
      throw new Error(error);
    }
  },
  addConcesionario: async (_: unknown, args: { localidad: string, }): Promise<ConcesionarioSchema> => {
    try {
        const { localidad } = args;

        const addConcesionario: ObjectId = await ConcesionariosCollection.insertOne({
            localidad: localidad,
            vendedores: [],
        });

        return {
            _id: addConcesionario,
            localidad: localidad,
            vendedores: []
        }
    } 
    catch (error) {
      throw new Error(error);
    }
  },
  addCocheAVendedor: async (_: unknown, args: { idCoche: string; idVendedor: string }): Promise<VendedorSchema> => {
    try {
        const { idCoche, idVendedor } = args;

        const cocheEncontrado: CocheSchema | undefined = await CochesCollection.findOne({
            _id: new ObjectId(idCoche),
        })

        if (!cocheEncontrado) {
            throw new Error("El id del coche no existe");
        }

        const vendedorEncontrado: VendedorSchema | undefined = await VendedoresCollection.findOne({
            _id: new ObjectId(idVendedor),
        })

        if (!vendedorEncontrado) {
            throw new Error("El id del vendedor no existe")
        }

        const vendedorTieneIdCoche: VendedorSchema | undefined = await VendedoresCollection.findOne({
            coches: new ObjectId(idCoche)
        });

        if (vendedorTieneIdCoche) {
            throw new Error("Este vendedor ya tiene ese coche seleccionado")
        }

        await VendedoresCollection.updateOne(
            {_id: new ObjectId(idVendedor)},
            {$push: {
                coches: {
                    $each: [new ObjectId(idCoche)]
                }
            }}
        );

        const vendedorActualizado: VendedorSchema | undefined = await VendedoresCollection.findOne({
            _id: new ObjectId(idVendedor),
        });

        if (!vendedorActualizado) {
            throw new Error("No se encuentra el vendedor con esa id")
        }

        return {
            _id: vendedorActualizado._id,
            nombre: vendedorActualizado.nombre,
            dni: vendedorActualizado.dni,
            coches: vendedorActualizado.coches,
        }
    }
    
    catch (error) {
      throw new Error(error);
    }
  },

  addVendedorAConcesionario: async (_: unknown, args: { idVendedor: string; idConcesionario: string }): Promise<ConcesionarioSchema> => {
    try {
        const { idVendedor, idConcesionario } = args;

        const vendedorEncontrado: VendedorSchema | undefined = await VendedoresCollection.findOne({
            _id: new ObjectId(idVendedor),
        })

        if (!vendedorEncontrado) {
            throw new Error("El id del vendedor no existe")
        }

        const concesionarioEncontrado: ConcesionarioSchema | undefined = await ConcesionariosCollection.findOne({
            _id: new ObjectId(idConcesionario),
        });

        if (!concesionarioEncontrado) {
            throw new Error("El id del concesionario no existe")
        }

        const concesionarioTieneIdVendedor: ConcesionarioSchema | undefined = await ConcesionariosCollection.findOne({
            vendedores: new ObjectId(idVendedor)
        });

        if (concesionarioTieneIdVendedor) {
            throw new Error("Este concesionario ya tiene ese vendedor seleccionado")
        }

        await ConcesionariosCollection.updateOne(
            {_id: new ObjectId(idConcesionario)},
            {$push: {
                vendedores: {
                    $each: [new ObjectId(idVendedor)]
                }
            }}
        );

        const concesionarioActualizado: ConcesionarioSchema | undefined = await ConcesionariosCollection.findOne({
            _id: new ObjectId(idConcesionario),
        }); 

        if (!concesionarioActualizado) {
            throw new Error("El id del concesionario no existe")
        }

        return {
            _id: concesionarioActualizado._id,
            localidad: concesionarioActualizado.localidad,
            vendedores: concesionarioActualizado.vendedores,
        }

    } 
    catch (error) {
      throw new Error(error);
    }
  },
};

/*
ejemplo: async (_: unknown, args: {}): Promise<Tipo1> => {
}
*/
