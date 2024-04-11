import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');         // Logger es como un console.log pero con super poderes

  constructor(                                                  // En el constructor indicamos que trabajamos con la entidad Product
    @InjectRepository(Product) //Modelo                         // a traves de una inyección de un repositorio. Este repositorio nos permite
    private readonly productRepository: Repository<Product>,    // trabajar (CRUD) con las instancias de las entidades de Product (productRepository)
                    // Instancias de pto
  ){}
  
  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')                                                     // Si el error es por id duplicado
      throw new BadRequestException(error.detail)                                   // mensaje de error con el detalle 

    this.logger.error(error)                                                        // Si es cualquier otro error
    throw new InternalServerErrorException('Unexpected error, check server logs')   // mensaje de error en server y en postman
  }
}
