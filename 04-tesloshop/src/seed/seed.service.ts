import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,                       // Inyección del productsService
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>                        // Inyección del modelo User
  ){}

  async runSeed() {
    await this.deleteTables()                                               // Borramos todas las tablas

    const adminUser = await this.insertUsers()                              // Obtenemos el adminUser

    await this.insertNewProducts(adminUser)                                 //Insertamos los ptos seed enviando el userAdmin
    return 'SEED EXECUTED'
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts()                          // Borramos todos los productos -> borra también las imagenes (cascade)
    const queryBuilder = this.userRepository.createQueryBuilder();          
    await queryBuilder                                                      // Borramos todos los usuarios
      .delete()
      .where({})
      .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users;                                    // SeedUsers
    const users: User[] = []                                                // Inicialización de users[]
    seedUsers.forEach(user => {                                             // Creamos una instancia de usuario por cada seedUser
      users.push(this.userRepository.create(user))                          // que se insertan en users[]
    })
    const dbUsers = await this.userRepository.save(users)                                   // Grabamos en bd los users[]
    return dbUsers[0]                                                         // Obtenemos el 1er usuario de users[] que es el admin
  }
 
  private async insertNewProducts( user: User ) {
    
    await this.productsService.deleteAllProducts();               // Borramos todos los productos de la bd
    
    const products = initialData.products;                        // Cargamos la data desde initialData en products
    
    const insertPromises = [];                                    // Inicializamos un [] de promesas
    
    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));  // Recorremos products e insertamos en nuestro [] de promesas las instancias de ptos
    });
    
    await Promise.all(insertPromises);                            // Resolvemos/ejecutamos las promesas e insertamos en bd los registros 
    
    return true
  }
  
  
}