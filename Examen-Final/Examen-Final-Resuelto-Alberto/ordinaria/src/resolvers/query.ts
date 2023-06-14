import { CharacterAPIRest } from "../types.ts";

export const Query = {
  character: async (_: unknown,  args: { id: string }): Promise<CharacterAPIRest> => {
    const { id } = args;
    const character: Response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    console.log(character.ok);
    return character.json();
  },

  charactersByIds: async (_: unknown, args: { ids: string[] }): Promise<Array<CharacterAPIRest>> => {
    const { ids } = args;
    const characters = await fetch(`https://rickandmortyapi.com/api/character/${ids.toString()}`);
    console.log(characters)
    return characters.json();
  },
};
