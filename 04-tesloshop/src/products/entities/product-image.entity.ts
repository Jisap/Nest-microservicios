import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";



@Entity({ name: 'product_images' })
export class ProductImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  // Relación
  // Un conjunto de imagenes pueden pertenecer a un solo pto
  @ManyToOne(
    () => Product,                          // Entidad con la que se relaciona ProductImage
    (product) => product.images,            // Criterio de relación: Cada instancia de ProductImage tiene una propiedad product
    { onDelete: 'CASCADE' }
  )
  product: Product

}