import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokem-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
  
  async executeSeed(){
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')
    
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');                  // [ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '643', '' ] array de 8, 
      const no = +segments[segments.length - 2]         // id en la posición 6, hay que apuntar a la posición 8-2  
    
      console.log({name, no})
    })
    
    return data.results

  }
}
