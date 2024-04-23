import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService                       // Inyección del productsService
  ){}

  async runSeed() {
    await this.insertNewProducts()
    return 'SEED EXECUTED'
  }

 
    private async insertNewProducts() {
      
      await this.productsService.deleteAllProducts();               // Borramos todos los productos de la bd
      
      const products = initialData.products;                        // Cargamos la data desde initialData en products
      
      const insertPromises = [];                                    // Inicializamos un [] de promesas
      
      products.forEach(product => {
        insertPromises.push(this.productsService.create(product));  // Recorremos products e insertamos en nuestro [] de promesas las instancias de ptos
      });
      
      await Promise.all(insertPromises);                            // Resolvemos/ejecutamos las promesas e insertamos en bd los registros 
      
      return true
    }
  
  
}