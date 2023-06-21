import { CharacterAPIRest, RickAndMortyAPIRest } from "../types.ts";

export const Query = {
  character: async (_: unknown, args: { id: string }): Promise<CharacterAPIRest> => {
    const { id } = args;
    const character = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    console.log(character)
    return character.json();
  },

  charactersByIds: async (_: unknown,  args: { ids: string[] }): Promise<Array<CharacterAPIRest>> => {
    const { ids } = args;
    const characters = await fetch(`https://rickandmortyapi.com/api/character/${ids.toString()}`);
    console.log(characters)
    return characters.json();
  },

  characterByName: async (_: unknown, args: { name: string }):  Promise<CharacterAPIRest | undefined> => {
    try {
      const { name } = args;
      const character = await fetch(`https://rickandmortyapi.com/api/character?name=${name}`);
      const data: RickAndMortyAPIRest = await character.json();
      console.log(data.results)

      const characterUnique: CharacterAPIRest | undefined = data.results.at(0);

      return characterUnique;
    }
    catch(error) {
      throw new Error("No se ha encontrado");
    }
  },

  charactersByName: async (_: unknown, args: { name: string }):  Promise<CharacterAPIRest[]> => {
    try {
      const { name } = args;
      const characters = await fetch(`https://rickandmortyapi.com/api/character?name=${name}`);
      const data: RickAndMortyAPIRest = await characters.json();
      

      return data.results;
    }
    catch(error) {
      throw new Error("No se ha encontrado");
    }
  },
};
