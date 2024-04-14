import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');       // Logger es como un console.log pero con super poderes

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

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;      // Desestructuramos limit y offset del paginationDto

    const products = await this.productRepository.find({   // Aplicamos esos params a la busqueda
      take: limit,                                         // La busqueda tendrá un limit
      skip: offset,                                        // y empezará desde el offset
    })

    return products.map(product => ({                      // Mapeamos los products encontrados
      ...product,                                          // spread de las props de cada producto que se itera
    }))
  }

  async findOne(term: string) {

    let product: Product;                                                      // Inicializamos una variable product

    if (isUUID(term)) {                                                        // Si el term de busqueda es un uuid
      product = await this.productRepository.findOneBy({ id: term });          // el product = busqueda por el id que nos pasan
    } else {                                                          //alias  // Pero si es otra cosa,
      const queryBuilder = this.productRepository.createQueryBuilder('prod');  // Creamos un queryBuilder (sobre la instancia del Producto) que es un método para la creación de consultas SQL
      product = await queryBuilder                                             // El producto = al rdo de la consulta a traves del queryBuilder
        .where('UPPER(title) = :title or slug =:slug', {                       // Condiciones: buscamos rdos por title o slugs                  
          title: term.toUpperCase(),                                           // Siendo ambos = termino de busqueda
          slug: term.toLowerCase(),                                            // La condicion sería: buscamos por title en mayúsculas en la bd contra el term de busqueda en mayúsculas
        })                                 // alias
        //.leftJoinAndSelect('prod.images', 'prodImages')                        // permite la carga de las relaciones sobre la busqueda del createQueryBuilder 
        .getOne()                                                              // Solo devolveremos un rdo.
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`)

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return `Product with id ${id} has been deleted`
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')                                                     // Si el error es por id duplicado
      throw new BadRequestException(error.detail)                                   // mensaje de error con el detalle 

    this.logger.error(error)                                                        // Si es cualquier otro error
    throw new InternalServerErrorException('Unexpected error, check server logs')   // mensaje de error en server y en postman
  }
}
