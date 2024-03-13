import { HttpAdapter, PokeApiAdapter, PokeApiFetchAdapter } from '../src/api/pokeApi.adapter';
import { Move, PokeapiReponse } from '../interfaces/pokeapi-response.interface';

export class Pokemon {

  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  constructor(
    public readonly id: number,
    public name: string,
    // Todo: inyectar dependencias
    private readonly http: HttpAdapter, // Inyección del patron adaptador para peticiones a urls
  ) { }

  scream() {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}`);
  }

  async getMoves(): Promise<Move[]> { 
    const data = await this.http.get<PokeapiReponse>('https://pokeapi.co/api/v2/pokemon/4');    
    console.log(data.moves);


    return data.moves;
  }

}

// Instancia del patron adaptador a usar
// en HttpAdapter
const pokeApiAxios = new PokeApiAdapter();        // patron axios
const pokeApiFetch = new PokeApiFetchAdapter();   // patron http

export const charmander = new Pokemon(4, 'Charmander', pokeApiAxios); // Instancia del pokemon 4 con el patron axios


charmander.getMoves();