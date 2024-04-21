import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');                 // Logger es como un console.log pero con super poderes

  constructor(                                                            // En el constructor indicamos que trabajamos con la entidad Product
    @InjectRepository(Product) //Modelo                                   // a traves de una inyección de un repositorio. Este repositorio nos permite
    private readonly productRepository: Repository<Product>,              // trabajar (CRUD) con las instancias de las entidades de Product (productRepository)
                    // Instancias de pto

    @InjectRepository(ProductImage)                                       // Inyección del modelo ProductImage
    private readonly productImageRepository: Repository<ProductImage>, 
  
    private readonly dataSource: DataSource,                              // DataSource mantiene la configuración de conexión de la base de datos 
                                                                          // y establece la conexión inicial de la base de datos
  ){}
  
  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto           // Del contenido del dto desestructuramos images[] y resto de props

    try {

      const product = this.productRepository.create({                     // Creamos la instancia del producto con el contenido del dto
        ...productDetails,                                                
        images: images.map(image => this.productImageRepository.create({ url: image })), // donde la imagenes son instancias de productImage
      });
      await this.productRepository.save(product);

      return { ...product, images: images };

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;      // Desestructuramos limit y offset del paginationDto

    const products = await this.productRepository.find({   // Aplicamos esos params a la busqueda
      take: limit,                                         // La busqueda tendrá un limit
      skip: offset,                                        // y empezará desde el offset
      relations: {
        images: true
      }
    })

    return products.map(product => ({                      // Mapeamos los products encontrados
      ...product,                                          // spread de las props de cada producto que se itera
      images: product.images.map(img => img.url)           // y de las imagenes solo nos quedamos con la url
    }))
  }

  async findOne(term: string) {

    let product: Product;                                                      // Inicializamos una variable product

    if (isUUID(term)) {                                                        // Si el term de busqueda es un uuid
      product = await this.productRepository.findOneBy({ id: term });          // el product = busqueda por el id que nos pasan
    } else {                                     //alias para el queryBuilder  // Pero si es otra cosa,
      const queryBuilder = this.productRepository.createQueryBuilder('prod');  // Creamos un queryBuilder (sobre la instancia del Producto) que es un método para la creación de consultas SQL
      product = await queryBuilder                                             // El producto = al rdo de la consulta a traves del queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {                        // Condiciones: buscamos rdos por title en mayúsculas o slugs como vengan                 
          title: term.toUpperCase(),                                           // Los valores del term se pasan a mayúsculas y se hace la comparacion
          slug: term.toLowerCase(),                                            // El slug se deja en minúsculas y se compara con el de bd tal como este.
        })                                                                     // prod.images: relacion product con images  // prodImages: alias tabla imagenes
        .leftJoinAndSelect('prod.images', 'prodImages')                        // permite la carga de las relaciones sobre la busqueda del createQueryBuilder 
        .getOne()                                                              // Solo devolveremos un rdo.
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`)

    return product
  }

  //Aplanamiento de las url de las imagenes
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);                  // Obtenemos un pto según un término de busqueda usando findOne ( método anterior )
    return {
      ...rest,                                                                  // retornamos las props del pto
      images: images.map(image => image.url)                                    // y de las imagenes solo las url
    }                                                                           // Este método se usará en el controller
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;
  
    const product = await this.productRepository.preload({                          // Buscamos un producto por el id y sustituimos su contenido 
      id,                                                                           // con el de la nueva instancia, imagenes aparte.
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`Product with id: ${id} not found`); 

    //Create query runner                                                           // Crea un ejecutor de consultas utilizado para realizar consultas en una sola conexión
    const queryRunner = this.dataSource.createQueryRunner();                        // de base de datos.
    await queryRunner.connect();                                                    // Nos conectamos a la bd.
    await queryRunner.startTransaction();                                           // Iniciamos la transacción

    try {

      if (images) {                       //entity          //target                // Si la actualización trae imagenes
        await queryRunner.manager.delete(ProductImage, { product: { id } })         // borramos la imagenes existentes del pto que queremos actualizar
        product.images = images.map(
          image => this.productImageRepository.create({ url: image }))              // Creamos instancias de productImage con las nuevas url en el pto a actualizar
      }

      //product.user = user                                                         // Añadimos el usuario que realizó la actualización al pto
      await queryRunner.manager.save(product);                                      // Guardamos en queryRunner los cambios realizados en el producto
      await queryRunner.commitTransaction();                                        // Ejecutamos el commit de la transacción guardada en el queryRunner
      await queryRunner.release();                                                  // Finalizamos el queryRunner
      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();                                      // Si hay algún error el queryRunner deja todo como estaba.
      await queryRunner.release();
      this.handleDBExceptions(error)
    }
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
