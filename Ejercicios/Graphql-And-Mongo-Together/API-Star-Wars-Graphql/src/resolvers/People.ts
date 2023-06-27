import { FilmAPI, PlanetAPI, SpecieAPI, StarshipAPI, VehicleAPI } from "../types.ts";
import { PeopleAPI } from "../types.ts";


export const People = {
    films: async (parent: PeopleAPI): Promise<Array<FilmAPI>> => {
      const films = await Promise.all(
        parent.films.map( async (film: string) => {
          const filmUnico = await fetch(film);
          return await filmUnico.json();
        })
      );
      return films;
    },
    species: async (parent: PeopleAPI): Promise<Array<SpecieAPI>> => {
      const species = await Promise.all(
        parent.species.map( async (specie: string) => {
          const specieUnique = await fetch(specie);
          return await specieUnique.json()
        })
      );
      return species;
    },
    vehicles: async (parent: PeopleAPI): Promise<Array<VehicleAPI>> => {
      const vehicles = await Promise.all(
        parent.vehicles.map( async (vehicle: string) => {
          const vehicleUnique = await fetch(vehicle);
          return await vehicleUnique.json();
        })
      );
      return vehicles;
    },
    starships: async (parent: PeopleAPI): Promise<Array<StarshipAPI>> => {
      const starships = await Promise.all(
        parent.starships.map( async (starship: string) => {
          const starshipUnique = await fetch(starship);
          return await starshipUnique.json();
        })
      );
      return starships;
    }
}


/*
films: [Film!]!
species: [Specie!]!
vehicles: [Vehicle!]!
starships: [Starship!]!
*/