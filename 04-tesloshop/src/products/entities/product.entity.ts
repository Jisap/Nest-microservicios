import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({ name: 'products' })
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true // Puede aceptar nulos
  })
  description: string;

  @Column('text', {
    unique: true
  })
  slug: string;

  @Column('int',{
    default: 0
  })
  stock: number;

  @Column('text', {
    array: true
  })
  sizes: string[]

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  // Relación
  // Un pto puede tener muchas imagenes
  @OneToMany(
    () => ProductImage,                                               // Entidad con la que se relaciona Product
    (productImage) => productImage.product,                           // Criterio de relación: Cada instancia de ProductImage tiene una propiedad product
    { cascade: true, eager: true }                                    // eager permite cargar las relaciones cuando se usa find*()
  )
  images?: ProductImage[]

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
