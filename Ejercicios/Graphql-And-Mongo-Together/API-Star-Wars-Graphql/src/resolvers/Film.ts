import { FilmAPI, PeopleAPI, PlanetAPI, SpecieAPI, StarshipAPI, VehicleAPI } from "../types.ts";


export const Film = {
    characters: async (parent: FilmAPI): Promise<Array<PeopleAPI>> => {
        const allCharacters = await Promise.all(
            parent.characters.map(async (character: string) => {
                const characterUnique = await fetch(character);
                return await characterUnique.json()
            })
        );
        return allCharacters;
    },
    planets: async (parent: FilmAPI): Promise<Array<PlanetAPI>> => {
        const planets = await Promise.all(
            parent.planets.map( async (planet: string) => {
                const planetUnique = await fetch(planet);
                return await planetUnique.json();
            })
        );
        return planets;
    },
    starships: async (parent: FilmAPI): Promise<Array<StarshipAPI>> => {
        const starships = await Promise.all(
          parent.starships.map( async (starship: string) => {
            const starshipUnique = await fetch(starship);
            return await starshipUnique.json();
          })
        );
        return starships;
      },
      vehicles: async (parent: FilmAPI): Promise<Array<VehicleAPI>> => {
        const vehicles = await Promise.all(
          parent.vehicles.map( async (vehicle: string) => {
            const vehicleUnique = await fetch(vehicle);
            return await vehicleUnique.json();
          })
        );
        return vehicles;
      },
      species: async (parent: FilmAPI): Promise<Array<SpecieAPI>> => {
        const species = await Promise.all(
          parent.species.map( async (specie: string) => {
            const specieUnique = await fetch(specie);
            return await specieUnique.json()
          })
        );
        return species;
      },
}

/*
characters: [People!]!
planets: [Planet!]!
starships: [Starship!]!
vehicles: [Vehicle!]!
species: [Specie!]!
*/