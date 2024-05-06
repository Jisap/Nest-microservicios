import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: '801bd6f6-6650-4f14-9011-31bdfc7d16be',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    example: 'lorem ipsum Anim reprehenderit nulla in anim mollit irure commodo.',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true // Puede aceptar nulos
  })
  description: string;

  @ApiProperty({
    example: 'T_Shirt_Teslo',
    description: 'Product SLUG - for SEO',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0
  })
  @Column('int',{
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true
  })
  sizes: string[]

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  // Relación
  // Un pto puede tener muchas imagenes
  @ApiProperty()
  @OneToMany(
    () => ProductImage,                                               // Entidad con la que se relaciona Product
    (productImage) => productImage.product,                           // Criterio de relación: Cada instancia de ProductImage tiene una propiedad product
    { cascade: true, eager: true }                                    // eager permite cargar las relaciones cuando se usa find*()
  )
  images?: ProductImage[]

  // Relación
  // Muchos productos serán creados por un único usuario ( ManyToOne )
  @ManyToOne(
    () => User,                                                        // Product apunta (se relaciona con) a la tabla de User
    (user) => user.product,                                            // Ese usuario pertenecerá a un producto.    
    { eager: true }                                                    // Eager carga automáticamente la relación 
  )
  user: User

  @BeforeInsert()                                                     // Antes de la inserción en la bd
  checkSlugInsert() {                                                 // Llamamos a este método que verifica que  
    if (!this.slug) {                                                 // sino existe el slug en el body
      this.slug = this.title                                          // usamos el title como slug
    }

    this.slug = this.slug                                              // Si el slug existe entonces
      .toLowerCase()                                                   // lo pasamos a minúsculas
      .replaceAll(' ', '_')                                            // y sustituimos los espacios por _
      .replaceAll("´", '')                                             // y eliminamos los ´
  }

  @BeforeUpdate()                                                      // Despues de la actualización en bd
  checkSlugUpdate() {                                                  // Llamamos a este otro método que verifica que
    this.slug = this.slug                                              // el slug existe
      .toLowerCase()                                                   // lo pasamos a minúsculas
      .replaceAll(' ', '_')                                            // sustituimos los espacios por _
      .replaceAll("´", '')                                             // y eliminamos los ´
  }
}
