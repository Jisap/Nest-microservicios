import axios from 'axios';


export interface HttpAdapter {

  get<T>(url: string): Promise<T>; // get acepta una URL y devuelve una promesa genérica tipo T

}



export class PokeApiFetchAdapter implements HttpAdapter { // Esta clase implementa la interfaz httpAdapter

  async get<T>(url: string): Promise<T> { // En su método get
    const resp = await fetch(url);        // se utiliza la función nativa fetch para realizar una solicitud http
    const data: T = await resp.json();    // la respuesta se convierte a formato json  
    console.log('con fetch');
    return data;                          // y la retorna
  }
}


export class PokeApiAdapter implements HttpAdapter {  // Esta clase también implementa la interfaz httpAdapter

  private readonly axios = axios;                     // pero realiza las peticiones a las url usando Axios

  async get<T>(url: string): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    console.log('con axios');
    return data;
  }

  async post(url: string, data: any) {

  }
  async patch(url: string, data: any) {

  }
  async delete(url: string) {

  }



}