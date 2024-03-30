import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokem-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)                     // InjectModel nos permite injectar el modelo de mongoose 
    private readonly pokemonModel: Model<Pokemon>, // Inyección de dependencias: pokemonModel como modelo de mongoose basado en la entity pokemon
    //private readonly http: AxiosAdapter,           // Inyección de dependencias: http como adapter de Axios
  ) { }
  
  async executeSeed(){

    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const insertPromisesArray = [];
    
    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');                  // [ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '643', '' ] array de 8, 
      const no = +segments[segments.length - 2]         // id en la posición 6, hay que apuntar a la posición 8-2  
    
      insertPromisesArray.push(this.pokemonModel.create({ no, name }))      // Inserción en el array de cada promesa de pokemon
    
    })

    await Promise.all(insertPromisesArray);   // Ejecución de las promesas del array de una sola vez
    
    return 'Seed executed successfully';

  }
}
