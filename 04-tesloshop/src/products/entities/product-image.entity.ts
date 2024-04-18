import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'product_images' })
export class ProductImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

}